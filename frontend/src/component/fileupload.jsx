import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from "react-toastify";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file dulu!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      const text = await res.json();
      setMessage(text);
      if (res.ok){
        toast.success("File berhasil di-upload!");
        navigate("/success");
      }
    } catch (err) {
      // setMessage("Error: " + err.message);
      toast.error("Upload gagal: " + err.message); 
    }
  };

  return (
    <div className="complete-upload">
    <div className="flex items-start justify-center min-h-screen h-screen w-screen">
      <div className="flex flex-col items-center text-center mt-[10px] w-[700px] h-[200px] bg-gray-100 rounded-xl shadow-lg p-10">
        <h2 className="text-[55px] font-semibold">Upload Excel File</h2>
        <label
  className="mt-6 bg-blue-400 hover:bg-blue-600 text-white rounded-lg px-6 py-3 cursor-pointer inline-block"
>
  Pilih File
  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={handleFileChange}
    className="hidden"
  />
</label>

        <button
          onClick={handleUpload}
          className="mt-11 bg-blue-400 hover:bg-blue-600 text-white rounded-lg "
        >
          Upload
        </button>

        {message && (
          <p className="mt-10 text-green-600 font-medium">{message}</p>
        )}
      </div>
    </div>
    </div>
  );
}


