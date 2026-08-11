import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/ordersApi';
import { 
  ArrowLeft, DollarSign, ShoppingBag, TrendingUp, 
  Users, Activity, Calendar, FileText
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';

export const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    totalOrders: 0,
    aov: 0
  });
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ordersData = await ordersApi.getOrders();
      
      // Calculate Metrics
      let totalRev = 0;
      let completedOrdersCount = 0;

      ordersData.forEach(order => {
        if (order.status === 'COMPLETED' || order.status === 'PAID') {
          totalRev += order.totalAmount || 0;
          completedOrdersCount++;
        }
      });

      setMetrics({
        revenue: totalRev,
        totalOrders: ordersData.length,
        aov: completedOrdersCount > 0 ? (totalRev / completedOrdersCount) : 0
      });

      // Prepare Chart Data (Group by Day)
      const groupedByDate = {};
      ordersData.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!groupedByDate[date]) {
          groupedByDate[date] = { date, revenue: 0, orders: 0 };
        }
        if (order.status === 'COMPLETED' || order.status === 'PAID') {
          groupedByDate[date].revenue += order.totalAmount || 0;
        }
        groupedByDate[date].orders += 1;
      });

      const formattedChartData = Object.values(groupedByDate).slice(-7); // Last 7 days
      setChartData(formattedChartData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount);
  };

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#11161d] border border-amber-500/30 p-3 rounded-2xl shadow-xl">
          <p className="text-white font-bold mb-1">{label}</p>
          <p className="text-amber-400 text-sm">
            Revenue: <span className="font-mono">{formatCurrency(payload[0].value)}</span>
          </p>
          {payload[1] && (
            <p className="text-emerald-400 text-sm">
              Orders: <span className="font-mono">{payload[1].value}</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-slate-100 font-sans p-6 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center bg-[#11161d] border-b border-amber-500/30 p-4 px-6 shrink-0 rounded-3xl mb-6 shadow-2xl relative z-10">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/welcome')}
            className="p-2.5 bg-[#07090c] hover:bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-amber-400" />
          </button>
          
          <div>
            <h1 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Activity className="w-5 h-5 text-amber-500" />
              <span>Admin Analytics Dashboard</span>
            </h1>
            <p className="text-xs text-slate-400">Financial & Operational Overview</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/admin/users')}
          className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-bold rounded-2xl transition cursor-pointer text-xs flex items-center space-x-2"
        >
          <Users className="w-4 h-4" />
          <span>Staff Approvals</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-20">
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#11161d] border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition duration-500" />
            <div className="flex items-start justify-between mb-2 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <DollarSign className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-400 mb-1 relative z-10">Total Revenue (Completed)</h3>
            <p className="text-3xl font-black text-white tracking-tight relative z-10">{formatCurrency(metrics.revenue)}</p>
          </div>

          <div className="bg-[#11161d] border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition duration-500" />
            <div className="flex items-start justify-between mb-2 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-400 mb-1 relative z-10">Total Orders Logged</h3>
            <p className="text-3xl font-black text-white tracking-tight relative z-10">{metrics.totalOrders}</p>
          </div>

          <div className="bg-[#11161d] border border-slate-800 p-6 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition duration-500" />
            <div className="flex items-start justify-between mb-2 relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                <TrendingUp className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-400 mb-1 relative z-10">Average Order Value</h3>
            <p className="text-3xl font-black text-white tracking-tight relative z-10">{formatCurrency(metrics.aov)}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue Area Chart */}
          <div className="bg-[#11161d] border border-slate-800 p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <span>Revenue Trend</span>
                </h3>
                <p className="text-xs text-slate-400">Last 7 operational days</p>
              </div>
            </div>
            <div className="h-72 w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full text-amber-500">Loading chart...</div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rs.${value/1000}k`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
              )}
            </div>
          </div>

          {/* Orders Bar Chart */}
          <div className="bg-[#11161d] border border-slate-800 p-6 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-500" />
                  <span>Order Volume</span>
                </h3>
                <p className="text-xs text-slate-400">Total orders processed per day</p>
              </div>
            </div>
            <div className="h-72 w-full">
              {loading ? (
                <div className="flex items-center justify-center h-full text-emerald-500">Loading chart...</div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e293b', opacity: 0.4}} />
                    <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">No data available</div>
              )}
            </div>
          </div>

        </div>

        {/* Recent Transactions Table */}
        <div className="bg-[#11161d] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Recent Transactions</span>
              </h3>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#0b0f16] text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.slice().reverse().slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">#{order.id}</td>
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 font-medium">
                        {order.orderType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        order.status === 'COMPLETED' || order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        order.status === 'CANCELLED' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-amber-400">
                      {formatCurrency(order.totalAmount || 0)}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      No recent transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
