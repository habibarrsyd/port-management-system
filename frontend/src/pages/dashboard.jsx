import React from "react";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      {/* Header */}
      <main className="main-content">
        <h1 className="title">Dashboard</h1>
        <p className="subtitle">
          Welcome back, <span className="bold">admin!</span> You have access to all branches.
        </p>

        {/* Cards */}
        <div className="cards">
          <div className="card purple">126<br /><span>Total Transactions</span></div>
          <div className="card red">1<br /><span>Active Branches</span></div>
          <div className="card green">1<br /><span>Active Ports</span></div>
          <div className="card gradient">1<br /><span>Days Active</span></div>
        </div>

        {/* Chart Area */}
        <div className="charts">
          <div className="chart-box">📊 Port Time Trends by Branch</div>
          <div className="chart-box">📊 Port Time Components</div>
        </div>

        <div className="charts">
          <div className="chart-box">📊 Branch Statistics</div>
          <div className="chart-box">📊 Recent Transactions</div>
        </div>
      </main>
    </div>
  );
}
