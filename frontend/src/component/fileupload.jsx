import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { XCircleIcon } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Pilih file dulu!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    // 🔑 ambil user_id dari Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Anda harus login dulu!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    const userId = session.user.id;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      const res = await fetch("http://127.0.0.1:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      await res.json();
      toast.success("File berhasil di-upload!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset file setelah upload berhasil
      setTimeout(() => {
        setFile(null);
      }, 2500);
    } catch (err) {
      toast.error("Upload gagal: " + err.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <div className="complete-upload">
      <div className="flex flex-col items-center text-center mt-[60px] w-[500px]">
        <h4 className="font-bold text-[60px] mt-[40px] text-gray-900">Upload Excel File</h4>

        {!file ? (
          <label className="cursor-pointer bg-[#c51717] px-[70px] py-[10px] rounded-[15px] text-[40px] text-white hover:bg-[#ED5555] mt-[10px]">
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
            <div className="remove-file">
              <XCircleIcon onClick={handleRemoveFile} className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-center">
              <img
                src="https://img.icons8.com/color/96/microsoft-excel-2019.png" 
                alt="Excel"
                className="w-16 h-16"
              />
              <span className="mt-2 text-sm text-gray-500 truncate w-full">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </span>
            </div>
          </div>
        )}

        {file && (
          <button onClick={handleUpload} className="btn-upload">
            Upload
          </button>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}