from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import psycopg2.errors
import bcrypt
import os
import pandas as pd
import re
import hashlib
import pandas as pd
from datetime import datetime
from flask import request, jsonify
from dotenv import load_dotenv   


# Load environment variables dari file .env
load_dotenv()
app = Flask(__name__)
CORS(app)

# Folder simpan upload
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "port": os.getenv("DB_PORT"),
    "sslmode": os.getenv("DB_SSLMODE")
}

def get_db_connection():
    try:
        print("Mencoba koneksi ke database...")
        conn = psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)
        print("Koneksi database berhasil")
        return conn
    except Exception as e:
        print(f"Koneksi database gagal: {e}")
        raise

@app.get("/api/health")
def health():
    return {"status":"ok"}, 200

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Flask API is running", "status": "ok"})

@app.route("/api/register", methods=["GET"])
def register_info():
    return jsonify({"message": "Use POST with JSON body {name, email, password}"})

@app.route("/api/register", methods=["POST"])
def register():
    print("Menerima permintaan POST ke /api/register")
    data = request.get_json(silent=True)

    if not data:
        return jsonify({"error": "Invalid JSON data"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password required"}), 400

    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # cek email sudah terdaftar
        cur.execute("SELECT user_id FROM profiles WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email already registered"}), 409

        # hash password
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        # insert user baru
        cur.execute(
            "INSERT INTO profiles (name, email, password) VALUES (%s, %s, %s) RETURNING user_id",
            (name, email, hashed_password),
        )
        user_id = cur.fetchone()["user_id"]

        conn.commit()
        return jsonify({"status": "success", "user_id": user_id}), 200

    except psycopg2.Error as db_err:
        if conn:
            conn.rollback()
        print(f"Error database: {db_err}")
        return jsonify({"error": "Database error", "details": str(db_err)}), 500

    except Exception as e:
        if conn:
            conn.rollback()
        print(f"Error selama registrasi: {e}")
        return jsonify({"error": "Registration failed", "details": str(e)}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

@app.route("/api/login", methods=["POST"])
def login():
    print("Menerima permintaan POST ke /api/login")
    data = request.get_json(silent=True)
    if not data:
        print("Error: Data JSON tidak valid")
        return jsonify({"error": "Invalid JSON data"}), 400

    email = data.get("email")
    password = data.get("password")
    print(f"Data diterima: email={email}, password=***")
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    conn = cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT user_id, password FROM profiles WHERE email = %s", (email,))
        user = cur.fetchone()

        if not user:
            print(f"Error: Email {email} tidak ditemukan")
            return jsonify({"error": "Invalid email or password"}), 401

        stored_password = user["password"].encode("utf-8")
        if not bcrypt.checkpw(password.encode("utf-8"), stored_password):
            print("Error: Password salah")
            return jsonify({"error": "Invalid email or password"}), 401

        print(f"Login berhasil untuk user_id: {user['user_id']}, email: {email}")
        return jsonify({"status": "success", "user_id": user["user_id"]}), 200

    except Exception as e:
        print(f"Error selama login: {e}")
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

    finally:
        if cur:  cur.close()
        if conn: conn.close()

@app.route("/api/transactions", methods=["GET"])
def get_transactions():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    conn = cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT id, kapal, voy_arr, voy_dep, asal, tujuan, td_ta, ta_taob, port, remark, period, port_route
            FROM another
            WHERE user_id = %s
        """, (user_id,))
        rows = cur.fetchall()

        return jsonify(rows)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cur:  cur.close()
        if conn: conn.close()

# ======================
# Helper functions
# ======================
def parse_datetime(value):
    if pd.isna(value):
        return None
    if isinstance(value, datetime):
        return value.strftime("%Y-%m-%d %H:%M:%S")
    try:
        return datetime.strptime(str(value), "%d/%m/%Y %H:%M").strftime("%Y-%m-%d %H:%M:%S")
    except:
        try:
            return datetime.strptime(str(value), "%d/%m/%Y").strftime("%Y-%m-%d")
        except:
            return str(value)

def file_hash(file_obj):
    file_obj.seek(0)
    hasher = hashlib.sha256()
    while True:
        data = file_obj.read(8192)
        if not data:
            break
        hasher.update(data)
    file_obj.seek(0)
    return hasher.hexdigest()

def extract_after_colon(text):
    parts = text.split(":", 1)
    return parts[1].strip() if len(parts) > 1 else None

def extract_year(period_text):
    years = re.findall(r"(\d{4})", period_text)
    return years[0] if years else None

def extract_route(route_text):
    parts = route_text.split(":", 1)
    return parts[1].strip() if len(parts) > 1 else None

@app.route("/api/upload", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    user_id = request.form.get("user_id")

    if not file:
        return jsonify({"error": "File tidak ditemukan"}), 400
    if not user_id:
        return jsonify({"error": "user_id tidak ditemukan"}), 400

    # Hitung hash file (fungsi file_hash() sudah reset pointer ke awal di akhir)
    file_hash_value = file_hash(file)

    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Cek duplikat untuk user ini
        cur.execute(
            "SELECT id FROM another WHERE file_hash = %s AND user_id = %s",
            (file_hash_value, user_id),
        )
        if cur.fetchone():
            return jsonify({"error": "File ini sudah pernah kamu upload"}), 409

        # ======================
        # Parsing metadata
        # ======================
        df_raw = pd.read_excel(file, header=None)

        company_line = " ".join(df_raw.iloc[1].dropna().astype(str).tolist())
        route_line   = " ".join(df_raw.iloc[2].dropna().astype(str).tolist())
        period_line  = " ".join(df_raw.iloc[3].dropna().astype(str).tolist())

        extracted_company = extract_after_colon(company_line)
        extracted_route   = extract_route(route_line)
        extracted_year    = extract_year(period_line)

        print("DEBUG company:", extracted_company)
        print("DEBUG route:", extracted_route)
        print("DEBUG period:", extracted_year)

        # === RESET POINTER sebelum baca kedua ===
        try:
            file.seek(0)
        except Exception:
            try:
                file.stream.seek(0)
            except Exception:
                pass

        # ======================
        # Parsing tabel utama
        # ======================
        df = pd.read_excel(file, skiprows=6)  # tabel mulai baris ke-7
        df = df.where(pd.notnull(df), None)   # ganti NaN jadi None
        df = df.iloc[:-1, :]

        insert_query = """
        INSERT INTO another (
            user_id, file_hash, company, port_route, period,
            kapal, voy_arr, voy_dep, asal, tujuan,
            taob, ta, tb, tcl, td,
            d20fl, d20mt, d40fl, d40mt, d10fl, d10mt,
            d21fl, d21mt, d40frfl, d40frmt, d45fl, d45mt,
            l20fl, l20mt, l40fl, l40mt, l10fl, l10mt,
            l21fl, l21mt, l40frfl, l40frmt, l45fl, l45mt,
            ucdisc, ucdisc_qty, ucload, ucload_qty,
            td_ta, tcl_tb, ta_taob, td_tcl, tb_ta,
            prod_td_ta, prod_tcl_tb, port, remark
        )
        VALUES (
            %s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,%s,%s,
            %s,%s,%s,%s,
            %s,%s,%s,%s,%s,
            %s,%s,%s,%s
        )
        """

        for _, row in df.iterrows():
            cur.execute(insert_query, (
                user_id,
                file_hash_value,
                extracted_company,
                extracted_route,
                extracted_year,

                row.get("Kapal"),
                row.get("Voy Arr"),
                row.get("Voy Dep"),
                row.get("Asal"),
                row.get("Tujuan"),

                parse_datetime(row.get("TAOB")),
                parse_datetime(row.get("TA")),
                parse_datetime(row.get("TB")),
                parse_datetime(row.get("TCL")),
                parse_datetime(row.get("TD")),

                row.get("D20FL"),
                row.get("D20MT"),
                row.get("D40FL"),
                row.get("D40MT"),
                row.get("D10FL"),
                row.get("D10MT"),

                row.get("D21FL"),
                row.get("D21MT"),
                row.get("D40FRFL"),
                row.get("D40FRMT"),
                row.get("D45FL"),
                row.get("D45MT"),

                row.get("L20FL"),
                row.get("L20MT"),
                row.get("L40FL"),
                row.get("L40MT"),
                row.get("L10FL"),
                row.get("L10MT"),

                row.get("L21FL"),
                row.get("L21MT"),
                row.get("L40FRFL"),
                row.get("L40FRMT"),
                row.get("L45FL"),
                row.get("L45MT"),

                row.get("UCDisc"),
                row.get("UCDisc Qty"),
                row.get("UCLoad"),
                row.get("UCLoad Qty"),

                row.get("TD - TA"),
                row.get("TCL - TB"),
                row.get("TA - TAOB"),
                row.get("TD - TCL"),
                row.get("TB - TA"),

                row.get("Prod / (TD - TA)"),
                row.get("Prod / (TCL - TB)"),
                row.get("Port"),
                row.get("Remark"),
            ))

        conn.commit()
        return jsonify({"status": "success", "message": "File berhasil diunggah!"}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        print("Error saat upload:", e)
        return jsonify({"error": "Upload failed", "details": str(e)}), 500

    finally:
        if cur:  cur.close()
        if conn: conn.close()

def parse_duration_to_hours(duration):
    if not duration or not isinstance(duration, str):
        return 0
    if duration in ["0", "0:00", "0:00:00"]:
        return 0
    if ':' in duration:
        try:
            parts = [float(p.strip()) for p in duration.split(':')]
            hours = parts[0] if len(parts) > 0 else 0
            minutes = parts[1] / 60 if len(parts) > 1 else 0
            seconds = parts[2] / 3600 if len(parts) > 2 else 0
            return hours + minutes + seconds
        except:
            pass
    try:
        return float(duration.replace(',', '.'))
    except:
        print(f"⚠️ Cannot parse duration: {duration}")
        return 0

@app.route("/api/dashboard", methods=["GET"])
def dashboard():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch profile
        cur.execute("SELECT name FROM profiles WHERE user_id = %s", (user_id,))
        profile = cur.fetchone()
        user_name = profile["name"] if profile else "User"

        # Fetch transaction count
        cur.execute("SELECT COUNT(*) FROM another WHERE user_id = %s", (user_id,))
        transaction_count = cur.fetchone()['count']

        # Fetch unique ports
        cur.execute("SELECT DISTINCT port FROM another WHERE user_id = %s AND port IS NOT NULL", (user_id,))
        port_items = [{"label": row["port"], "href": "#", "disabled": False} for row in cur.fetchall()]

        # Fetch vessel frequency (top 5)
        cur.execute("""
            SELECT kapal, COUNT(*) as count 
            FROM another 
            WHERE user_id = %s AND kapal IS NOT NULL 
            GROUP BY kapal 
            ORDER BY count DESC 
            LIMIT 5
        """, (user_id,))
        vessel_counts = {row['kapal']: row['count'] for row in cur.fetchall()}
        vessel_voyage_items = [{"label": kapal, "href": "#", "disabled": True} for kapal in vessel_counts.keys()]

        # Fetch periods
        cur.execute("SELECT DISTINCT period FROM another WHERE user_id = %s AND period IS NOT NULL", (user_id,))
        time_period_items = [{"label": row["period"], "href": "#", "disabled": False} for row in cur.fetchall()]

        # Fetch vessel data
        query = """
            SELECT kapal, td, tb, prod_td_ta, td_ta, tcl_tb, td_tcl, tb_ta,
                   d20fl, d20mt, d40fl, d40mt, d10fl, d10mt, d21fl, d21mt,
                   d40frfl, d40frmt, d45fl, d45mt, l20fl, l20mt, l40fl, l40mt,
                   l10fl, l10mt, l21fl, l21mt, l40frfl, l40frmt, l45fl, l45mt, port
            FROM another
            WHERE user_id = %s
            AND kapal IS NOT NULL AND td IS NOT NULL AND tb IS NOT NULL
            AND prod_td_ta IS NOT NULL AND td_ta IS NOT NULL AND tcl_tb IS NOT NULL
            AND td_tcl IS NOT NULL AND tb_ta IS NOT NULL
            AND d20fl IS NOT NULL AND d20mt IS NOT NULL AND d40fl IS NOT NULL AND d40mt IS NOT NULL
            AND d10fl IS NOT NULL AND d10mt IS NOT NULL AND d21fl IS NOT NULL AND d21mt IS NOT NULL
            AND d40frfl IS NOT NULL AND d40frmt IS NOT NULL AND d45fl IS NOT NULL AND d45mt IS NOT NULL
            AND l20fl IS NOT NULL AND l20mt IS NOT NULL AND l40fl IS NOT NULL AND l40mt IS NOT NULL
            AND l10fl IS NOT NULL AND l10mt IS NOT NULL AND l21fl IS NOT NULL AND l21mt IS NOT NULL
            AND l40frfl IS NOT NULL AND l40frmt IS NOT NULL AND l45fl IS NOT NULL AND l45mt IS NOT NULL
            AND port IS NOT NULL
        """
        cur.execute(query, (user_id,))
        vessel_data = cur.fetchall()

        # Fetch remarks
        cur.execute("SELECT kapal, remark FROM another WHERE user_id = %s AND remark IS NOT NULL", (user_id,))
        remarks_data = cur.fetchall()

        # Process container data
        drop_columns = [
            'd20fl', 'd20mt', 'd40fl', 'd40mt', 'd10fl', 'd10mt',
            'd21fl', 'd21mt', 'd40frfl', 'd40frmt', 'd45fl', 'd45mt'
        ]
        load_columns = [
            'l20fl', 'l20mt', 'l40fl', 'l40mt', 'l10fl', 'l10mt',
            'l21fl', 'l21mt', 'l40frfl', 'l40frmt', 'l45fl', 'l45mt'
        ]
        stacked_bar_data = []
        for port_item in port_items:
            port = port_item['label']
            port_data = [item for item in vessel_data if item['port'] == port]
            drop_count = sum(sum(float(item[col] or 0) for col in drop_columns) for item in port_data)
            load_count = sum(sum(float(item[col] or 0) for col in load_columns) for item in port_data)
            stacked_bar_data.append({'port': port, 'drop': drop_count, 'load': load_count})

        # Process pie data
        fl_columns = ['d20fl', 'd40fl', 'd10fl', 'd21fl', 'd40frfl', 'd45fl', 'l20fl', 'l40fl', 'l10fl', 'l21fl', 'l40frfl', 'l45fl']
        mt_columns = ['d20mt', 'd40mt', 'd10mt', 'd21mt', 'd40frmt', 'd45mt', 'l20mt', 'l40mt', 'l10mt', 'l21mt', 'l40frmt', 'l45mt']
        total_full = sum(sum(float(item[col] or 0) for col in fl_columns) for item in vessel_data)
        total_empty = sum(sum(float(item[col] or 0) for col in mt_columns) for item in vessel_data)
        pie_data = [{'name': 'Full', 'value': total_full}, {'name': 'Empty', 'value': total_empty}]

        # Process bar data (Port Stay)
        td_ta_data = [
            {'kapal': item['kapal'], 'td_ta': parse_duration_to_hours(item['td_ta'])}
            for item in vessel_data if item['td_ta'] is not None
        ]
        td_ta_data = [item for item in td_ta_data if item['td_ta'] > 0]
        grouped_td_ta = {}
        for item in td_ta_data:
            kapal = item['kapal']
            if kapal not in grouped_td_ta:
                grouped_td_ta[kapal] = {'sum': 0, 'count': 0}
            grouped_td_ta[kapal]['sum'] += item['td_ta']
            grouped_td_ta[kapal]['count'] += 1
        bar_data = [
            {'kapal': kapal, 'value': data['sum'] / data['count']}
            for kapal, data in grouped_td_ta.items()
        ]

        # Process productivity data
        prod_data = [
            {'kapal': item['kapal'], 'prod_td_ta': float(item['prod_td_ta'] or 0)}
            for item in vessel_data if item['prod_td_ta'] is not None
        ]
        prod_data = [item for item in prod_data if item['prod_td_ta'] > 0]
        grouped_prod_data = {}
        for item in prod_data:
            kapal = item['kapal']
            if kapal not in grouped_prod_data:
                grouped_prod_data[kapal] = {'sum': 0, 'count': 0}
            grouped_prod_data[kapal]['sum'] += item['prod_td_ta']
            grouped_prod_data[kapal]['count'] += 1
        productivity_data = [
            {'kapal': kapal, 'value': data['sum'] / data['count']}
            for kapal, data in grouped_prod_data.items()
        ]

        # Calculate berthing and time after completion
        berthing_times = [
            parse_duration_to_hours(item['tcl_tb'])
            for item in vessel_data if item['tcl_tb'] is not None
        ]
        berthing_times = [t for t in berthing_times if t > 0]
        time_after_times = [
            parse_duration_to_hours(item['td_tcl'])
            for item in vessel_data if item['td_tcl'] is not None
        ]
        time_after_times = [t for t in time_after_times if t > 0]
        avg_berthing = sum(berthing_times) / len(berthing_times) if berthing_times else 0
        avg_time_after = sum(time_after_times) / len(time_after_times) if time_after_times else 0

        # Calculate occupancy
        if berthing_times and time_after_times:
            min_count = min(len(berthing_times), len(time_after_times))
            total_berthing_time = avg_berthing * min_count
            total_time_after_time = avg_time_after * min_count
            total_time = total_berthing_time + total_time_after_time
            occupancy = (total_berthing_time / total_time * 100) if total_time > 0 else 0
        elif berthing_times:
            occupancy = 100
        else:
            occupancy = 0

        # Calculate waiting time
        waiting_times = [
            parse_duration_to_hours(item['tb_ta'])
            for item in vessel_data if item['tb_ta'] is not None
        ]
        waiting_times = [t for t in waiting_times if t > 0]
        avg_waiting_time = sum(waiting_times) / len(waiting_times) if waiting_times else 0

        # Most frequent vessel
        most_frequent_vessel = max(vessel_counts, key=vessel_counts.get) if vessel_counts else ''
        total_vessels = sum(vessel_counts.values())
        frequency_percentage = (vessel_counts.get(most_frequent_vessel, 0) / total_vessels * 100) if total_vessels > 0 else 0

        cur.close()
        conn.close()

        return jsonify({
            "user_name": user_name,
            "transaction_count": transaction_count,
            "port_items": port_items,
            "vessel_voyage_items": vessel_voyage_items,
            "time_period_items": time_period_items,
            "bar_data": bar_data,
            "productivity_data": productivity_data,
            "average_berthing_duration": avg_berthing,
            "average_time_after_completion": avg_time_after,
            "average_waiting_time": avg_waiting_time,
            "occupancy": occupancy,
            "stacked_bar_data": stacked_bar_data,
            "pie_data": pie_data,
            "remarks_data": remarks_data,
            "most_frequent_vessel": most_frequent_vessel,
            "frequency_percentage": frequency_percentage
        })

    except Exception as e:
        print("Dashboard fetch error:", e)
        return jsonify({"error": f"Failed to fetch dashboard data: {str(e)}"}), 500

@app.route("/api/profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    conn = cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute(
            "SELECT user_id, name, email FROM profiles WHERE user_id = %s",
            (user_id,)
        )
        profile = cur.fetchone()

        if not profile:
            return jsonify({"error": "Profile not found"}), 404

        return jsonify({
            "user_id": profile["user_id"],
            "name": profile["name"],
            "email": profile["email"]
        })

    except Exception as e:
        print(f"Error fetching profile: {e}")
        return jsonify({"error": f"Failed to fetch profile: {str(e)}"}), 500

    finally:
        if cur:  cur.close()
        if conn: conn.close()

@app.route("/api/logout", methods=["POST"])
def logout():
    user_id = request.json.get("user_id")
    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    try:
        # Placeholder for future session/token invalidation
        # For now, just return success since authentication is client-side
        print(f"User {user_id} logged out")
        return jsonify({"status": "success", "message": "Logged out successfully"}), 200
    except Exception as e:
        print(f"Error during logout: {e}")
        return jsonify({"error": f"Logout failed: {str(e)}"}), 500
    
if __name__ == "__main__":
    print("Starting Server on Flask port 5000")
    app.run(host="0.0.0.0", debug=False, port=5000)