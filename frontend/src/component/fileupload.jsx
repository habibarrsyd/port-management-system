import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { XCircleIcon } from "lucide-react";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih file dulu!");
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
      toast.success("File berhasil di-upload!");
      navigate("/success");
    } catch (err) {
      toast.error("Upload gagal: " + err.message);
    }
  };

  return (
    <div className="complete-upload">
      <div className="flex flex-col items-center text-center mt-[60px] w-[500px]">
        <h5 className="font-bold text-[60px] mt-[40px]">Upload Excel File</h5>

        {/* Pilih File */}
        {!file ? (
          <label className="cursor-pointer bg-[#c51717] px-[70px] py-[10px] rounded-[15px] text-[40px] text-white hover:bg-[#d0d6d1] mt-[40px]">
            Select File
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          
          <div className="file-info relative mt-[10px]">
            {/* Tombol X */}
            <div className="remove-file">
              <XCircleIcon onClick={handleRemoveFile} className="w-5 h-5" />
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col items-center">
              <img
                src="https://img.icons8.com/color/96/microsoft-excel-2019.png" 
                alt="Excel"
                className="w-16 h-16"
              />
              <span className="mt-2 text-sm font-small text-gray-500 truncate w-full">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        )}

        {/* Tombol Upload */}
        {file && (
          <button onClick={handleUpload} 
            className="btn-upload">
            Upload
          </button>
        )}

        {message && (
          <p className="mt-10 text-green-600 font-medium">{message}</p>
        )}
        <ToastContainer />
      </div>
    </div>
  );
}
