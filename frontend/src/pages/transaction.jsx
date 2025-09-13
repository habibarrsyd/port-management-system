import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { ShoppingCart } from "lucide-react";
import { MdArrowCircleRight } from 'react-icons/md';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
  setLoading(true);

  // Ambil user_id dari localStorage
  const userId = localStorage.getItem("user_id");
  if (!userId) {
    toast.error("You must be logged in to access transactions!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate("/login");
    setLoading(false);
    return;
  }

    try {
      // 🔹 Panggil backend Flask (pastikan Flask jalan di port 5000)
      const response = await fetch(`${API_URL}/api/transactions?user_id=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setTransactions(data);
      } else {
        toast.error("Failed to fetch transactions: " + (data.error || "Unknown error"), {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast.error("Failed to connect to backend!", {
        position: "top-right",
        autoClose: 3000,
      });
    }

    setLoading(false);
  }

  // Filtering (search)
  const filteredData = transactions.filter((t) =>
    Object.values(t).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key] ?? "";
    const valB = b[sortConfig.key] ?? "";

    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-[30px] mt-[60px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2 text-gray-700" />
          <h2 className="text-xl font-bold">Port Transactions</h2>
        </div>
        <span className="bg-[#f54040] text-white px-3 py-1 rounded-md text-sm font-semibold shadow-md">
          {transactions.length} total records
        </span>
      </div>

      {/* 🔍 Search box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[250px] px-3 py-1.5 border border-gray-300 rounded-md outline-none 
                    focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      <div className="overflow-x-auto overflow-y-auto rounded-xl min-h-[200px] max-h-[calc(100vh-150px)] shadow">
        <table className="w-full border-collapse bg-white rounded-xl table-fixed">
          <thead className="bg-gradient-to-r from-red-600 to-red-950 text-white text-sm">
            <tr>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("kapal")}
              >
                Ship
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("voy_arr")}
              >
                Voyage
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("asal")}
              >
                Route
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("td_ta")}
              >
                Td_Ta
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("ta_taob")}
              >
                Ta_Taob
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("port")}
              >
                Port
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("remark")}
              >
                Problem
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("period")}
              >
                Period
              </th>
              <th
                className="px-3 py-3 text-left cursor-pointer select-none hover:bg-white/20"
                onClick={() => requestSort("port_route")}
              >
                Port Route
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {sortedData.length > 0 ? (
              sortedData.map((t) => (
                <tr
                  key={t.id}
                  className="even:bg-gray-50 hover:bg-sky-50 transition-colors"
                >
                  <td className="px-3 py-3">{t.kapal}</td>
                  <td className="px-3 py-3 flex items-center gap-1">
                    {t.voy_arr}
                    <MdArrowCircleRight className="text-red-700 w-4 h-4" />
                    {t.voy_dep}
                  </td>
                  <td className="px-3 py-3">
                    {t.asal}
                    <MdArrowCircleRight className="text-blue-700 w-4 h-4" />
                    {t.tujuan}
                  </td>
                  <td className="px-3 py-3">{t.td_ta}</td>
                  <td className="px-3 py-3">{t.ta_taob}</td>
                  <td className="px-3 py-3">{t.port}</td>
                  <td className="px-3 py-3 text-red-600 font-medium">{t.remark}</td>
                  <td className="px-3 py-3">{t.period}</td>
                  <td className="px-3 py-3">{t.port_route}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 italic text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}