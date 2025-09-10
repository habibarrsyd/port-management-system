import re
from flask import Flask, request, render_template, redirect, url_for, jsonify
import pandas as pd
from supabase import create_client, Client
import os
import hashlib
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
def upload_file():
    file = request.files.get("file")
    user_id = request.form.get("user_id")

    print("DEBUG user_id:", user_id)   # <-- cek di terminal
    print("DEBUG files:", file)        # <-- cek file masuk apa enggak

    if not file or not user_id:
        return jsonify({"error": "File atau user_id tidak ada"}), 400

SUPABASE_URL = "https://rnberjvkhkyoocczalqb.supabase.co"  
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuYmVyanZraGt5b29jY3phbHFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTgzMTkxNiwiZXhwIjoyMDcxNDA3OTE2fQ.hcJM1Sv5ckXg2sj2iLEDgua59J4EDBFRCmSvT7IpjwI"  # ganti dgn API key
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


from datetime import datetime

def parse_datetime(value):
    if pd.isna(value):
        return None
    if isinstance(value, datetime):  
        return value.strftime("%Y-%m-%d %H:%M:%S")
    try:
        # coba parsing format DD/MM/YYYY HH:MM
        return datetime.strptime(str(value), "%d/%m/%Y %H:%M").strftime("%Y-%m-%d %H:%M:%S")
    except:
        try:
            # coba parsing format DD/MM/YYYY
            return datetime.strptime(str(value), "%d/%m/%Y").strftime("%Y-%m-%d")
        except:
            return str(value)  


def parse_time(value):
    """Konversi HH:MM ke float jam. Return None kalau kosong/error."""
    if pd.isna(value):
        return None
    try:
        time_str = str(value).strip()
        if ":" in time_str:
            h, m = map(int, time_str.split(":"))
            return h + m/60
        return float(time_str)  
    except:
        return None

def extract_year(period_text):
    import re
    years = re.findall(r"(\d{4})", period_text)
    return years[0] if years else None

def extract_route(route_text):
    """Extracts everything after the first colon, stripped of whitespace."""
    parts = route_text.split(":", 1)
    return parts[1].strip() if len(parts) > 1 else None

def extract_after_colon(text):
    """Extracts everything after the first colon, stripped of whitespace."""
    parts = text.split(":", 1)
    return parts[1].strip() if len(parts) > 1 else None

def file_hash(file_obj):
    """Return SHA256 hash of file-like object."""
    file_obj.seek(0)
    hasher = hashlib.sha256()
    while True:
        data = file_obj.read(8192)
        if not data:
            break
        hasher.update(data)
    file_obj.seek(0)
    return hasher.hexdigest()

@app.route("/")
def index():
    return render_template("upload.html")

@app.route("/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    user_id = request.form.get("user_id")

    if not file:
        return jsonify({"error": "File tidak ditemukan"}), 400
    if not user_id:
        return jsonify({"error": "user_id tidak ditemukan"}), 400

    # Baru hitung hash & cek duplikat
    file_hash_value = file_hash(file)

    # Cek duplikat hanya untuk user ini
    exists = supabase.table("another")\
        .select("id")\
        .eq("file_hash", file_hash_value)\
        .eq("user_id", user_id)\
        .execute()

    if exists.data:
        return jsonify({"error": "File ini sudah pernah kamu upload"}), 409

    
    file_hash_value = file_hash(file)
    user_id = request.form.get("user_id")  # <-- AMBIL user_id DULU

    if not user_id:
        return jsonify({"error": "user_id tidak ditemukan"}), 400

    # Cek hash hanya untuk user ini
    exists = supabase.table("another")\
        .select("file_hash")\
        .eq("file_hash", file_hash_value)\
        .eq("user_id", user_id)\
        .execute()

    if len(exists.data) > 0:
        return jsonify({"error": "File ini sudah pernah kamu upload"}), 409  # 409 lebih tepat

    df_raw = pd.read_excel(file, header=None)

    metadata = {}
    for i in range(1, 4): 
        row_text = " ".join(df_raw.iloc[i].dropna().astype(str).tolist())
        match = re.search(r":\s*(.*)", row_text)
        if match:
            metadata[f"line_{i+1}"] = match.group(1).strip()

    print("Metadata parsed:", metadata)

    # Extract route from line_3
    route_text = df_raw.iloc[2].dropna().astype(str).tolist()
    route_line = " ".join(route_text)
    extracted_route = extract_route(route_line)
    print("Extracted route:", extracted_route)

    
    period_text = metadata.get("line_4", "")
    period_year = extract_year(period_text)
    print("Line 4 value:", period_text)
    print("Extracted period year:", period_year)

    # Extract company from line_2
    company_text = df_raw.iloc[1].dropna().astype(str).tolist()
    company_line = " ".join(company_text)
    extracted_company = extract_after_colon(company_line)
    print("Extracted company:", extracted_company)

    df = pd.read_excel(file, skiprows=6, nrows=54) 
    df = df.iloc[:-1, :]  
    df = df.where(pd.notnull(df), None)  

    for _, row in df.iterrows():
        supabase.table("another").insert({
            "user_id": request.form.get("user_id"),  
            "file_hash": file_hash_value,
            "company": extracted_company,
            "port_route": extracted_route,
            "period": period_year,
            "kapal": row[df.columns[1]],
            "voy_arr": row[df.columns[2]],
            "voy_dep": row[df.columns[3]],
            "asal": row[df.columns[4]],
            "tujuan": row[df.columns[5]],
            "taob": parse_datetime(row[df.columns[6]]),
            "ta": parse_datetime(row[df.columns[7]]),
            "tb": parse_datetime(row[df.columns[8]]),
            "tcl": parse_datetime(row[df.columns[9]]),
            "td": parse_datetime(row[df.columns[10]]),
            "d20fl": row[df.columns[11]],
            "d20mt": row[df.columns[12]],   
            "d40fl": row[df.columns[13]],
            "d40mt": row[df.columns[14]],
            "d10fl": row[df.columns[15]],
            "d10mt": row[df.columns[16]],
            "d21fl": row[df.columns[17]],
            "d21mt": row[df.columns[18]],
            "d40frfl": row[df.columns[19]],
            "d40frmt": row[df.columns[20]],
            "d45fl": row[df.columns[21]],
            "d45mt" : row[df.columns[22]],
            "l20fl": row[df.columns[23]],
            "l20mt": row[df.columns[24]],
            "l40fl": row[df.columns[25]],
            "l40mt": row[df.columns[26]],
            "l10fl": row[df.columns[27]],
            "l10mt": row[df.columns[28]],
            "l21fl": row[df.columns[29]],
            "l21mt": row[df.columns[30]],
            "l40frfl": row[df.columns[31]],
            "l40frmt": row[df.columns[32]],
            "l45fl": row[df.columns[33]],
            "l45mt": row[df.columns[34]],
            "ucdisc": row[df.columns[35]],
            "ucdisc_qty": row[df.columns[36]],
            "ucload": row[df.columns[37]],
            "ucload_qty": row[df.columns[38]],
            "td_ta": row[df.columns[39]],
            "tcl_tb": row[df.columns[40]],
            "ta_taob": row[df.columns[41]],
            "td_tcl": row[df.columns[42]],
            "tb_ta": row[df.columns[43]],
            "prod_td_ta": row[df.columns[44]],
            "prod_tcl_tb": row[df.columns[45]],
            "port": row[df.columns[46]],
            "remark": row[df.columns[47]],
            

        }).execute()
    return jsonify({"status": "success", "message": "sukses terunggah!"}), 200

    

if __name__ == "__main__":
    app.run(debug=True)




