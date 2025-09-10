import React, { useState, useEffect, useRef } from 'react';
import { ShipWheel, CalendarCheck, Anchor } from "lucide-react";
import { HiChartBarSquare } from 'react-icons/hi2';
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
import { supabase } from '../supabaseClient';

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
  const COLORS = ['#5a0202ff', '#aeaba9ff'];

  // Fetch user profile and data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError('User not authenticated');
          return;
        }
        const userId = user.id;

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Failed to fetch user profile. Please try again.');
          return;
        }
        setUserName(profileData?.name || 'User');

        // Fetch transaction count
        const { data: transactionData, error: transactionError } = await supabase
          .from('another')
          .select('*', { count: 'exact' })
          .eq('user_id', userId);
        if (transactionError) {
          console.error('Error fetching transaction count:', transactionError);
          setError('Failed to fetch transaction count. Please try again.');
          return;
        }
        setTransactionCount(transactionData.length);

        // Fetch unique ports
        const { data: portData, error: portError } = await supabase
          .from('another')
          .select('port')
          .not('port', 'is', null)
          .eq('user_id', userId);
        if (portError) {
          console.error('Error fetching ports:', portError);
          setError('Failed to fetch ports. Please try again.');
          return;
        }
        const uniquePorts = [...new Set(portData.map(item => item.port))]
          .filter(port => port)
          .map(port => ({ label: port, href: '#', disabled: false }));
        setPortItems(uniquePorts);

        // Fetch vessel frequency
        const { data: vesselFrequencyData, error: vesselFrequencyError } = await supabase
          .from('another')
          .select('kapal')
          .not('kapal', 'is', null)
          .eq('user_id', userId);
        if (vesselFrequencyError) {
          console.error('Error fetching vessel frequency:', vesselFrequencyError);
          setError('Failed to fetch vessel frequency data. Please try again.');
          return;
        }
        const vesselCounts = vesselFrequencyData.reduce((acc, item) => {
          const kapal = item.kapal;
          if (kapal) acc[kapal] = (acc[kapal] || 0) + 1;
          return acc;
        }, {});
        const sortedVessels = Object.entries(vesselCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([kapal]) => ({ label: kapal, href: '#', disabled: true }));
        setVesselVoyageItems(sortedVessels);

        // Fetch vessel data
        const { data: vesselData, error: vesselError } = await supabase
          .from('another')
          .select(`
            kapal, td, tb, prod_td_ta, td_ta, tcl_tb, td_tcl, tb_ta, 
            d20fl, d20mt, d40fl, d40mt, d10fl, d10mt, d21fl, d21mt, 
            d40frfl, d40frmt, d45fl, d45mt, l20fl, l20mt, l40fl, l40mt, 
            l10fl, l10mt, l21fl, l21mt, l40frfl, l40frmt, l45fl, l45mt, 
            port
          `)
          .not('kapal', 'is', null)
          .not('td', 'is', null)
          .not('tb', 'is', null)
          .not('prod_td_ta', 'is', null)
          .not('td_ta', 'is', null)
          .not('tcl_tb', 'is', null)
          .not('td_tcl', 'is', null)
          .not('tb_ta', 'is', null)
          .not('d20fl', 'is', null)
          .not('d20mt', 'is', null)
          .not('d40fl', 'is', null)
          .not('d40mt', 'is', null)
          .not('d10fl', 'is', null)
          .not('d10mt', 'is', null)
          .not('d21fl', 'is', null)
          .not('d21mt', 'is', null)
          .not('d40frfl', 'is', null)
          .not('d40frmt', 'is', null)
          .not('d45fl', 'is', null)
          .not('d45mt', 'is', null)
          .not('l20fl', 'is', null)
          .not('l20mt', 'is', null)
          .not('l40fl', 'is', null)
          .not('l40mt', 'is', null)
          .not('l10fl', 'is', null)
          .not('l10mt', 'is', null)
          .not('l21fl', 'is', null)
          .not('l21mt', 'is', null)
          .not('l40frfl', 'is', null)
          .not('l40frmt', 'is', null)
          .not('l45fl', 'is', null)
          .not('l45mt', 'is', null)
          .not('port', 'is', null)
          .eq('user_id', userId);
        if (vesselError) {
          console.error('Error fetching vessels:', vesselError);
          setError('Failed to fetch vessels. Please try again.');
          return;
        }

        // Fetch remarks
        const { data: remarksRaw, error: remarksError } = await supabase
          .from('another')
          .select('kapal, remark')
          .not('remark', 'is', null)
          .eq('user_id', userId);
        if (remarksError) {
          console.error('Error fetching remarks:', remarksError);
          setError('Failed to fetch remarks. Please try again.');
          return;
        }
        setRemarksData(remarksRaw);

        // Process container data
        const dropColumns = [
          'd20fl', 'd20mt', 'd40fl', 'd40mt', 'd10fl', 'd10mt',
          'd21fl', 'd21mt', 'd40frfl', 'd40frmt', 'd45fl', 'd45mt'
        ];
        const loadColumns = [
          'l20fl', 'l20mt', 'l40fl', 'l40mt', 'l10fl', 'l10mt',
          'l21fl', 'l21mt', 'l40frfl', 'l40frmt', 'l45fl', 'l45mt'
        ];

        const portContainerData = uniquePorts.reduce((acc, portItem) => {
          const port = portItem.label;
          const portData = vesselData.filter(item => item.port === port);
          let dropCount = 0;
          let loadCount = 0;
          portData.forEach(item => {
            dropColumns.forEach(col => dropCount += parseFloat(item[col]) || 0);
            loadColumns.forEach(col => loadCount += parseFloat(item[col]) || 0);
          });
          return [...acc, { port, drop: dropCount, load: loadCount }];
        }, []);
        setStackedBarData(portContainerData);

        // Process pie data
        let totalFull = 0;
        let totalEmpty = 0;
        const flColumns = [
          'd20fl', 'd40fl', 'd10fl', 'd21fl', 'd40frfl', 'd45fl',
          'l20fl', 'l40fl', 'l10fl', 'l21fl', 'l40frfl', 'l45fl'
        ];
        const mtColumns = [
          'd20mt', 'd40mt', 'd10mt', 'd21mt', 'd40frmt', 'd45mt',
          'l20mt', 'l40mt', 'l10mt', 'l21mt', 'l40frmt', 'l45mt'
        ];
        vesselData.forEach(item => {
          flColumns.forEach(col => totalFull += parseFloat(item[col]) || 0);
          mtColumns.forEach(col => totalEmpty += parseFloat(item[col]) || 0);
        });
        setPieData([{ name: 'Full', value: totalFull }, { name: 'Empty', value: totalEmpty }]);

        // Process bar data (Port Stay)
        const parseDurationToHours = (str) => {
          if (!str || typeof str !== 'string') return 0;

          // Handle "0", "0:00", "0:00:00"
          if (str === "0" || str === "0:00" || str === "0:00:00") {
            return 0;
          }

          // Handle "HH:MM" or "HH:MM:SS"
          if (str.includes(':')) {
            const parts = str.split(':').map(part => parseFloat(part.trim()));
            if (parts.length >= 2 && !parts.some(isNaN)) {
              const hours = parts[0] || 0;
              const minutes = parts[1] || 0;
              const seconds = parts[2] || 0;
              return hours + minutes / 60 + seconds / 3600;
            }
          }

          // Handle "2.5" or "2,5"
          const num = parseFloat(str.replace(',', '.'));
          if (!isNaN(num)) {
            return num;
          }

          console.warn("⚠️ Cannot parse duration:", str);
          return 0;
        };

        // DEBUG: Log raw data for occupancy calculation
        console.log("=== OCCUPANCY DEBUG ===");
        console.log("vesselData length:", vesselData.length);
        console.log("Sample tcl_tb values:", vesselData.slice(0, 3).map(item => ({ kapal: item.kapal, tcl_tb: item.tcl_tb })));
        console.log("Sample td_tcl values:", vesselData.slice(0, 3).map(item => ({ kapal: item.kapal, td_tcl: item.td_tcl })));

        const berthingTimes = vesselData
          .map(item => parseDurationToHours(item.tcl_tb))
          .filter(n => !isNaN(n) && n > 0); // Filter out 0 and NaN
        console.log("berthingTimes (filtered):", berthingTimes);

        const timeAfterTimes = vesselData
          .map(item => parseDurationToHours(item.td_tcl))
          .filter(n => !isNaN(n) && n > 0); // Filter out 0 and NaN
        console.log("timeAfterTimes (filtered):", timeAfterTimes);

        const validBerthingCount = berthingTimes.length;
        const validTimeAfterCount = timeAfterTimes.length;

        console.log("validBerthingCount:", validBerthingCount);
        console.log("validTimeAfterCount:", validTimeAfterCount);

        let avgBerthing = 0;
        let avgTimeAfter = 0;

        if (validBerthingCount > 0) {
          avgBerthing = berthingTimes.reduce((a, b) => a + b, 0) / validBerthingCount;
        }
        if (validTimeAfterCount > 0) {
          avgTimeAfter = timeAfterTimes.reduce((a, b) => a + b, 0) / validTimeAfterCount;
        }

        setAverageBerthingDuration(avgBerthing);
        setAverageTimeAfterCompletion(avgTimeAfter);

        // Calculate occupancy based on valid data
        if (validBerthingCount > 0 && validTimeAfterCount > 0) {
          // Use the minimum count to ensure fair comparison
          const minCount = Math.min(validBerthingCount, validTimeAfterCount);
          const totalBerthingTime = avgBerthing * minCount;
          const totalTimeAfterTime = avgTimeAfter * minCount;
          const totalTime = totalBerthingTime + totalTimeAfterTime;
          const newOccupancy = totalTime > 0 ? (totalBerthingTime / totalTime) * 100 : 0;
          setOccupancy(newOccupancy);
          console.log("Occupancy calculated:", newOccupancy.toFixed(2), "%");
          console.log("totalBerthingTime:", totalBerthingTime.toFixed(2));
          console.log("totalTimeAfterTime:", totalTimeAfterTime.toFixed(2));
          console.log("totalTime:", totalTime.toFixed(2));
        } else if (validBerthingCount > 0) {
          // Only berthing data available
          setOccupancy(100);
          console.log("Only berthing data available - occupancy set to 100%");
        } else if (validTimeAfterCount > 0) {
          // Only time after data available
          setOccupancy(0);
          console.log("Only time after data available - occupancy set to 0%");
        } else {
          // No valid data
          setOccupancy(0);
          console.log("No valid data for occupancy calculation");
        }

        // Process bar data (Port Stay) - Fixed to use td_ta
        const tdTaData = vesselData
          .map(item => ({
            kapal: item.kapal,
            td_ta: parseDurationToHours(item.td_ta),
          }))
          .filter(item => !isNaN(item.td_ta) && item.td_ta > 0); // Filter out 0 and NaN
        const groupedTdTaData = tdTaData.reduce((acc, curr) => {
          const { kapal, td_ta } = curr;
          if (!acc[kapal]) acc[kapal] = { sum: 0, count: 0 };
          acc[kapal].sum += td_ta;
          acc[kapal].count += 1;
          return acc;
        }, {});
        const averageTdTaData = Object.keys(groupedTdTaData).map(kapal => ({
          kapal,
          value: groupedTdTaData[kapal].sum / groupedTdTaData[kapal].count,
        }));
        setBarData(averageTdTaData);

        // Process productivity data
        const prodData = vesselData
          .map(item => ({
            kapal: item.kapal,
            prod_td_ta: parseFloat(item.prod_td_ta),
          }))
          .filter(item => !isNaN(item.prod_td_ta) && item.prod_td_ta > 0); // Filter out 0 and NaN
        const groupedProdData = prodData.reduce((acc, curr) => {
          const { kapal, prod_td_ta } = curr;
          if (!acc[kapal]) acc[kapal] = { sum: 0, count: 0 };
          acc[kapal].sum += prod_td_ta;
          acc[kapal].count += 1;
          return acc;
        }, {});
        const averageProdData = Object.keys(groupedProdData).map(kapal => ({
          kapal,
          value: groupedProdData[kapal].sum / groupedProdData[kapal].count,
        }));
        setProductivityData(averageProdData);

        // Calculate waiting time (tb_ta) - Fixed filter
        const waitingTimes = vesselData
          .map(item => parseDurationToHours(item.tb_ta))
          .filter(n => !isNaN(n) && n > 0); // Filter out 0 and NaN
        setAverageWaitingTime(waitingTimes.length > 0 ? waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length : 0);

        // Most frequent vessel
        if (Object.keys(vesselCounts).length > 0) {
          const maxVessel = Object.keys(vesselCounts).reduce((a, b) => vesselCounts[a] > vesselCounts[b] ? a : b);
          setMostFrequentVessel(maxVessel);
          const totalVessels = vesselData.length;
          setFrequencyPercentage((vesselCounts[maxVessel] / totalVessels) * 100 || 0);
        }

        // Fetch time periods
        const { data: periodData, error: periodError } = await supabase
          .from('another')
          .select('period')
          .not('period', 'is', null)
          .eq('user_id', userId);
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

      {/* Filters - Uncomment if needed */}
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
              <span className="text-7xl font-bold text-red-900">{mostFrequentVessel || 'N/A'}</span>
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
              <YAxis
                tickFormatter={(value) => value.toFixed(2)}
              />
              <Tooltip
                formatter={(value) => Number(value).toFixed(2)}
              />
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
      <LineChart
        data={productivityData}
        margin={{ top: 5, right: 20, left: 10, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="kapal"
          interval="preserveStartEnd"
          label={{ value: "Vessel Type", position: "bottom", offset: 4 }}
        />
        <YAxis
          label={{ value: "Value", angle: -90, position: "left", offset: 0 }}
          tickFormatter={(value) => value.toFixed(2)}
        />
        <Tooltip
          formatter={(value) => Number(value).toFixed(2)}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#500606ff"
          strokeWidth={2}
        />
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
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
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