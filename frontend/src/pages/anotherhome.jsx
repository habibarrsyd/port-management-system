import React from "react";
import { useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
        Upload Berhasil!
        </h1>
        <p className="text-gray-600 mb-6">
          File Anda sudah berhasil diupload dan disimpan ke database.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Kembali ke Upload
        </button>
      </div>
    </div>
  );
}
