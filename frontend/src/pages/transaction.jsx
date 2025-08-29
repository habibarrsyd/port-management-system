import React, { useEffect, useState } from "react";
import { supabase } from "../Supabaseclient";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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
    <div className="transactions-container">
      <div className="transactions-header">
        <h2>Port Transactions</h2>
        <span>{transactions.length} total records</span>
      </div>

      {/* 🔍 Search box */}
      <div className="transactions-search">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="transactions-table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => requestSort("kapal")}>Ship</th>
              <th onClick={() => requestSort("voy_arr")}>Voyage</th>
              <th onClick={() => requestSort("asal")}>Route</th>
              <th onClick={() => requestSort("td_ta")}>Td_Ta</th>
              <th onClick={() => requestSort("ta_taob")}>Ta_Taob</th>
              <th onClick={() => requestSort("port")}>Port</th>
              <th onClick={() => requestSort("remark")}>Problem</th>
              <th onClick={() => requestSort("period")}>Period</th>
              <th onClick={() => requestSort("port_route")}>Port Route</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((t) => (
                <tr key={t.id}>
                  <td>{t.kapal}</td>
                  <td>{t.voy_arr} → {t.voy_dep}</td>
                  <td>{t.asal} → {t.tujuan}</td>
                  <td>{t.td_ta}</td>
                  <td>{t.ta_taob}</td>
                  <td>{t.port}</td>
                  <td className="problem">{t.remark}</td>
                  <td>{t.period}</td>
                  <td>{t.port_route}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500">
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
