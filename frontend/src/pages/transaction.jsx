import React, { useEffect, useState } from "react";
import { supabase } from "../Supabaseclient";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    const { data, error } = await supabase
      .from("another")
      .select(
        "id, kapal, voy_arr, voy_dep, asal, tujuan, td_ta, ta_taob, port, remark, period, port_route"
      );

    if (error) console.error(error);
    else setTransactions(data);
    setLoading(false);
  }

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Port Transactions</h2>
        <span className="bg-sky-400 text-white px-3 py-1 rounded-md text-sm font-semibold">
          {transactions.length} total records
        </span>
      </div>

      {/* Container tanpa batasan tinggi, hanya skrol horizontal jika perlu */}
      <div className="overflow-y-auto">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-gray-800 text-white text-sm sticky top-0 z-10">
            <tr>
              <th className="p-2">Ship</th>
              <th className="p-2">Voyage</th>
              <th className="p-2">Route</th>
              <th className="p-2">Td_Ta</th>
              <th className="p-2">Ta_Taob</th>
              <th className="p-2">Port</th>
              <th className="p-2">Problem</th>
              <th className="p-2">Period</th>
              <th className="p-2">Port Route</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t.id}
                className={`text-sm border-b hover:bg-gray-50 ${
                  i % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <td className="p-2">{t.kapal}</td>
                <td className="p-2">{t.voy_arr} → {t.voy_dep}</td>
                <td className="p-2">{t.asal} → {t.tujuan}</td>
                <td className="p-2">{t.td_ta}</td>
                <td className="p-2">{t.ta_taob}</td>
                <td className="p-2">{t.port}</td>
                <td className="p-2">{t.remark}</td>
                <td className="p-2">{t.period}</td>
                <td className="p-2">{t.port_route}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}