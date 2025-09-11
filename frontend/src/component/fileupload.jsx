import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  // Ambil user_id dari localStorage
  const userId = localStorage.getItem("user_id");
  console.log("user_id dari localStorage:", userId); // <-- tambahkan ini

// if (!userId) {
//   toast.error("Anda harus login dulu!");
//   navigate("/login");
//   return;
// }
  if (!userId) {
    toast.error("Anda harus login dulu!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate("/login");
    return;
  }

  // Buat FormData untuk kirim file + user_id ke Flask
  const formData = new FormData();
  formData.append("file", file);
  formData.append("user_id", userId);

  try {
    const response = await fetch("http://127.0.0.1:5000/upload", {
      method: "POST",
      body: formData,
      // JANGAN set Content-Type — biar browser otomatis handle multipart/form-data
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Upload gagal di server");
    }

    const result = await response.json();
    toast.success(result.message || "File berhasil di-upload dan diproses!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Reset file setelah sukses
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
    console.error("Upload error:", err);
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