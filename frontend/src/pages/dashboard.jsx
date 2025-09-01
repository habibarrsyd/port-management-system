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
} from "recharts";

export default function Dashboard() {
  const barData = [
    { name: "Vessel A", value: 150 },
    { name: "Vessel B", value: 200 },
    { name: "Vessel C", value: 250 },
    { name: "Vessel D", value: 220 },
    { name: "Vessel E", value: 130 },
  ];

  const lineData = [
    { name: "Jan", value: 180 },
    { name: "Feb", value: 240 },
    { name: "Mar", value: 280 },
    { name: "Apr", value: 320 },
    { name: "May", value: 360 },
    { name: "Jun", value: 400 },
    { name: "Jul", value: 420 },
    { name: "Aug", value: 460 },
  ];

  const pieData = [
    { name: "20ft", value: 200 },
    { name: "40FL", value: 300 },
    { name: "40FRL", value: 150 },
    { name: "Other", value: 100 },
  ];
  const COLORS = ["#60a5fa", "#3b82f6", "#2563eb", "#1e40af"];

  return (
    <div className="p-10 mt-10 w-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        Port Operations Dashboard
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <select className="p-2 border rounded">
          <option>Time Period</option>
        </select>
        <select className="p-2 border rounded">
          <option>Vessel / Voyage</option>
        </select>
        <select className="p-2 border rounded">
          <option>Port</option>
        </select>
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-12 gap-6">
        {/* Bar Chart */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Port Stay & Berth Occupancy</h2>
          <BarChart width={400} height={200} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </div>

        {/* Gauge Placeholder */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Average Berth Occupancy</h2>
          <div className="flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border-[12px] border-gray-200 flex items-center justify-center relative">
              <div className="absolute top-0 left-0 w-32 h-32 rounded-full border-[12px] border-blue-500 border-t-transparent border-l-transparent rotate-[45deg]" />
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
          <h2 className="font-bold mb-4">Performance / Productivity</h2>
          <LineChart width={400} height={200} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </div>

        {/* Stacked Bar + Pie */}
        <div className="col-span-6 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold mb-4">Container Composition</h2>
          <div className="grid grid-cols-2">
            <BarChart width={200} height={200} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#60a5fa" />
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
