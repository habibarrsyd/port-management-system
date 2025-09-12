import React, { useState, useEffect, useRef } from 'react';
import { ShipWheel, CalendarCheck } from "lucide-react";
import { HiChartBarSquare } from 'react-icons/hi2';
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { toast } from "react-toastify";

function Dropdown({ id, label, items, menuColor, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(label);
  const dropdownRef = useRef(null);

  const handleSelect = (item) => {
    if (!item.disabled) {
      setSelected(item.label);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="dropdown relative inline-flex w-full" ref={dropdownRef}>
      <button
        id={id}
        type="button"
        className="dropdown-toggle btn p-2 border rounded flex items-center justify-between w-full text-gray-700 bg-white hover:bg-gray-50"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Dropdown"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2 text-gray-700" />}
          {selected}
        </div>
        <span
          className={`ml-2 w-4 h-4 transform ${isOpen ? 'rotate-180' : ''}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </button>
      <ul
        className={`dropdown-menu absolute mt-2 min-w-full ${menuColor} border rounded shadow-lg z-10 ${isOpen ? 'opacity-100' : 'hidden opacity-0'}`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={id}
      >
        {items.map((item, index) => (
          <li key={index}>
            <button
              className={`dropdown-item block px-4 py-2 hover:bg-opacity-80 w-full text-left ${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`}
              onClick={() => handleSelect(item)}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const [portItems, setPortItems] = useState([]);
  const [vesselVoyageItems, setVesselVoyageItems] = useState([]);
  const [timePeriodItems, setTimePeriodItems] = useState([]);
  const [barData, setBarData] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [averageBerthingDuration, setAverageBerthingDuration] = useState(0);
  const [averageTimeAfterCompletion, setAverageTimeAfterCompletion] = useState(0);
  const [averageWaitingTime, setAverageWaitingTime] = useState(0);
  const [occupancy, setOccupancy] = useState(0);
  const [error, setError] = useState(null);
  const [stackedBarData, setStackedBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [remarksData, setRemarksData] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [mostFrequentVessel, setMostFrequentVessel] = useState('');
  const [frequencyPercentage, setFrequencyPercentage] = useState(0);
  const [userName, setUserName] = useState('User');
  const navigate = useNavigate();
  const COLORS = ['#5a0202ff', '#aeaba9ff'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user_id from localStorage
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          toast.error("You must be logged in to access the dashboard!", {
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

        // Fetch data from Flask /dashboard endpoint
        const response = await fetch(`http://localhost:5000/dashboard?user_id=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authentication header if needed (e.g., JWT)
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Map response directly to state variables
        setUserName(data.user_name || 'User');
        setTransactionCount(data.transaction_count || 0);
        setPortItems(data.port_items || []);
        setVesselVoyageItems(data.vessel_voyage_items || []);
        setTimePeriodItems(data.time_period_items || []);
        setBarData(data.bar_data || []);
        setProductivityData(data.productivity_data || []);
        setAverageBerthingDuration(data.average_berthing_duration || 0);
        setAverageTimeAfterCompletion(data.average_time_after_completion || 0);
        setAverageWaitingTime(data.average_waiting_time || 0);
        setOccupancy(data.occupancy || 0);
        setStackedBarData(data.stacked_bar_data || []);
        setPieData(data.pie_data || []);
        setRemarksData(data.remarks_data || []);
        setMostFrequentVessel(data.most_frequent_vessel || 'N/A');
        setFrequencyPercentage(data.frequency_percentage || 0);

      } catch (err) {
        console.error('Error fetching dashboard data:', err.message);
        setError('Failed to fetch dashboard data. Please try again.');
        toast.error('Failed to fetch dashboard data.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="p-10 mt-10 w-screen">
      <div className="flex items-center mb-2">
        <ShipWheel className="h-8 w-8 mr-2 text-gray-900" />
        <h1 className="text-3xl font-bold">Port Operations Dashboard</h1>
      </div>

      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

      <div className="mb-6 text-gray-600">
        <p>
          Welcome <strong className="uppercase"><b>{userName}</b></strong>! Here you can monitor key metrics and performance indicators related to port activities.
        </p>
      </div>

      {/* Filters (uncomment if you want to enable dropdowns) */}
      {/* <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="text-gray-600">
          <Dropdown
            id="dropdown-time"
            label="Time Period"
            items={timePeriodItems}
            menuColor="bg-gray-50"
            icon={CalendarCheck}
          />
        </div>
        <Dropdown
          id="dropdown-vessel"
          label="Top 5 Vessel Frequent"
          items={vesselVoyageItems}
          menuColor="bg-gray-50"
        />
        <Dropdown
          id="dropdown-port"
          label="Port"
          items={portItems}
          menuColor="bg-gray-50"
        />
      </div> */}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between h-25">
            <span className="text-7xl font-bold text-red-900">{transactionCount}</span>
            <HiChartBarSquare className="text-8xl text-red-900 ml-4" />
          </div>
          <h2 className="font-bold">Total Transactions</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between h-25">
            <span className="text-7xl font-bold text-red-900">{remarksData.length}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-red-900 ml-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fee2e2" />
              <path
                stroke="#4d0404ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01"
              />
            </svg>
          </div>
          <h2 className="font-bold">Total Problems</h2>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h2 className="font-bold mb-2">Most Frequent Vessel Calls</h2>
          <div className="flex items-center justify-center h-25">
            <div className="text-center">
              <span className="text-7xl font-bold text-red-900">{mostFrequentVessel}</span>
              <p className="text-md text-gray-500">
                {frequencyPercentage.toFixed(2)}% of total calls
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Port Stay</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kapal" interval="preserveStartEnd" />
                <YAxis tickFormatter={(value) => value.toFixed(2)} />
                <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                <Bar dataKey="value" fill="#820606ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Berthing Efficiency Ratio</h2>
          <div className="flex flex-col items-center justify-center">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center relative"
              style={{
                background: `conic-gradient(#7f1d1d ${occupancy}%, #e5e7eb ${occupancy}% 100%)`,
              }}
            >
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round(occupancy)}%</span>
              </div>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p>Waiting Time: <span className="font-bold">{averageWaitingTime.toFixed(1)}hrs</span></p>
              <p>Berthing Duration: <span className="font-bold">{averageBerthingDuration.toFixed(1)}hrs</span></p>
              <p>Time After Completion: <span className="font-bold">{averageTimeAfterCompletion.toFixed(1)}hrs</span></p>
            </div>
          </div>
        </div>

        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Productivity</h2>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={productivityData} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kapal" interval="preserveStartEnd" label={{ value: "Vessel Type", position: "bottom", offset: 4 }} />
                <YAxis label={{ value: "Value", angle: -90, position: "left", offset: 0 }} tickFormatter={(value) => value.toFixed(2)} />
                <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                <Line type="monotone" dataKey="value" stroke="#500606ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Container Composition</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stackedBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="port" angle={0} textAnchor="end" interval="preserveStartEnd" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="drop" stackId="a" fill="#5a0202ff" name="Drop Containers" />
                  <Bar dataKey="load" stackId="a" fill="#aeaba9ff" name="Load Containers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-12 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Remarks & Notes</h2>
          <table className="w-full border text-sm rounded-lg overflow-hidden">
            <thead className="bg-red-900 text-white">
              <tr>
                <th className="p-3 border-b border-gray-200 rounded-tl-lg">Vessel</th>
                <th className="p-3 border-b border-gray-200 rounded-tr-lg">Notes</th>
              </tr>
            </thead>
            <tbody>
              {remarksData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-b border-gray-200">{item.kapal}</td>
                  <td className="p-3 border-b border-gray-200">{item.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}