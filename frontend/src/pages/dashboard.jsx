import React, { useState, useEffect, useRef } from 'react';
import {
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
import { supabase } from '../Supabaseclient';

function Dropdown({ id, label, items, menuColor }) {
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
        {selected}
        <span
          className={`ml-2 w-4 h-4 transform ${isOpen ? 'rotate-180' : ''}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        ></span>
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
  const [error, setError] = useState(null);

  const lineData = [
    { name: 'Jan', value: 180 },
    { name: 'Feb', value: 240 },
    { name: 'Mar', value: 280 },
    { name: 'Apr', value: 320 },
    { name: 'May', value: 360 },
    { name: 'Jun', value: 400 },
    { name: 'Jul', value: 420 },
    { name: 'Aug', value: 460 },
  ];

  const pieData = [
    { name: '20ft', value: 200 },
    { name: '40FL', value: 300 },
    { name: '40FRL', value: 150 },
    { name: 'Other', value: 100 },
  ];
  const COLORS = ['#c82f14ff', '#b92503ff', '#6ba010ff', '#818e0eff'];

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch unique ports
        const { data: portData, error: portError } = await supabase
          .from('another') // Adjust table name if different
          .select('port')
          .not('port', 'is', null);
        if (portError) {
          console.error('Error fetching ports:', portError);
          setError('Failed to fetch ports. Please try again.');
          return;
        }
        const uniquePorts = [...new Set(portData.map(item => item.port))]
          .filter(port => port)
          .map(port => ({ label: port, href: '#', disabled: false }));
        setPortItems(uniquePorts);

        // Fetch data for Vessel / Voyage and BarChart from 'another' table
        const { data: vesselData, error: vesselError } = await supabase
          .from('another') // Table name from your request
          .select('kapal, td, tb') // Select kapal, td, tb
          .not('kapal', 'is', null)
          .not('td', 'is', null)
          .not('tb', 'is', null);
        if (vesselError) {
          console.error('Error fetching vessels:', vesselError);
          setError('Failed to fetch vessels. Please try again.');
          return;
        }

        // Calculate durations for each entry, ignoring date and using time only
        const durations = vesselData.map(item => {
          const parseTimeToHours = (str) => {
            if (!str) return 0;
            const [, timePart] = str.split(' ');
            const [hours = 0, minutes = 0, seconds = 0] = (timePart || '00:00:00').split(':').map(Number);
            return hours + minutes / 60 + seconds / 3600;
          };

          const tdHours = parseTimeToHours(item.td);
          const tbHours = parseTimeToHours(item.tb);
          let durasi = tbHours - tdHours;
          if (durasi < 0) durasi += 24; // Handle overnight spans assuming <24h total

          return {
            kapal: item.kapal,
            durasi,
          };
        }).filter(item => !isNaN(item.durasi));

        // Group by kapal and calculate average duration
        const groupedData = durations.reduce((acc, curr) => {
          const { kapal, durasi } = curr;
          if (!acc[kapal]) {
            acc[kapal] = { sum: 0, count: 0 };
          }
          acc[kapal].sum += durasi;
          acc[kapal].count += 1;
          return acc;
        }, {});
        
        const averageData = Object.keys(groupedData).map(kapal => ({
          kapal: kapal,
          value: groupedData[kapal].sum / groupedData[kapal].count // Rata-rata durasi
        }));

        setBarData(averageData);

        // For Vessel / Voyage dropdown, use unique kapal with example format
        const uniqueVessels = [...new Set(vesselData.map(item => item.kapal))]
          .filter(kapal => kapal)
          .map(kapal => ({ label: `${kapal}`, href: '#', disabled: false }));
        setVesselVoyageItems(uniqueVessels);

        // Fetch unique time periods from 'period' column
        const { data: periodData, error: periodError } = await supabase
          .from('another') // Adjust table name if different
          .select('period')
          .not('period', 'is', null);
        if (periodError) {
          console.error('Error fetching periods:', periodError);
          setError('Failed to fetch time periods. Please try again.');
          return;
        }
        const uniquePeriods = [...new Set(periodData.map(item => item.period))]
          .filter(period => period)
          .map(period => ({ label: period, href: '#', disabled: false }));
        setTimePeriodItems(uniquePeriods);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Unexpected error occurred while fetching data.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-10 mt-10 w-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Port Operations Dashboard
      </h1>

      {/* Error Display */}
      {error && (
        <div className="mb-4 text-red-500 text-center">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Dropdown id="dropdown-time" label="Time Period" items={timePeriodItems} menuColor="bg-blue-50" />
        <Dropdown id="dropdown-vessel" label="Vessel / Voyage" items={vesselVoyageItems} menuColor="bg-green-50" />
        <Dropdown id="dropdown-port" label="Port" items={portItems} menuColor="bg-yellow-50" />
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Port Stay & Berth Occupancy</h2>
          <div style = {{marginLeft: -40}}>
          <BarChart width={600} height={200} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kapal" interval="preserveStartEnd" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#820606ff" />
          </BarChart>
          </div>
        </div>

        {/* Gauge Placeholder */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Average Berth Occupancy</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-[12px] border-gray-200 flex items-center justify-center relative">
              <div className="absolute w-32 h-32 rounded-full border-[11px] border-red-900 border-t-transparent border-l-transparent rotate-[45deg]" />
              <span className="text-2xl font-bold">65%</span>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p>Waiting Time: <span className="font-bold">40hrs</span></p>
              <p>Berthing Duration: <span className="font-bold">34hrs</span></p>
              <p>Time After Completion: <span className="font-bold">22hrs</span></p>
            </div>
          </div>
        </div>

        {/* Line Chart */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Productivity</h2>
          <div style={{marginLeft: -40}}>
          <LineChart width={600} height={200} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kapal" interval="preserveStartEnd" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#075b35ff" strokeWidth={2} />
          </LineChart>
          </div>
        </div>

        {/* Stacked Bar + Pie */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Container Composition</h2>
          <div className="grid grid-cols-2">
            <BarChart width={200} height={200} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kapal" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#512a17ff" />
            </BarChart>
            <PieChart width={200} height={200}>
              <Pie
                data={pieData}
                cx={100}
                cy={100}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>
        </div>

        {/* Table */}
        <div className="col-span-12 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Remarks & Notes</h2>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Vessel</th>
                <th className="p-2 border">Voyage</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">Vessel A</td>
                <td className="p-2 border">123</td>
              </tr>
              <tr>
                <td className="p-2 border">Vessel B</td>
                <td className="p-2 border">456</td>
              </tr>
              <tr>
                <td className="p-2 border">Vessel C</td>
                <td className="p-2 border">789</td>
              </tr>
              <tr>
                <td className="p-2 border">Vessel D</td>
                <td className="p-2 border">690</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}