import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useTheme } from '../App';
import apiService, { mockData } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Dashboard = () => {
  const { darkMode } = useTheme();
  const [data, setData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [revenueRes, salesRes, statsRes] = await Promise.all([
        apiService.getRevenueData().catch(() => mockData.revenueData),
        apiService.getSalesData().catch(() => mockData.salesData),
        apiService.getDashboardStats().catch(() => mockData.stats)
      ]);

      setData(revenueRes);
      setSalesData(salesRes);
      setStats(statsRes);

      // Generate pie data
      setPieData([
        { name: 'Desktop', value: 45, fill: '#2563eb' },
        { name: 'Mobile', value: 35, fill: '#60a5fa' },
        { name: 'Tablet', value: 15, fill: '#93c5fd' },
        { name: 'Other', value: 5, fill: '#dbeafe' }
      ]);

      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      
      // Use mock data as fallback
      setData(mockData.revenueData);
      setSalesData(mockData.salesData);
      setStats(mockData.stats);
      setPieData([
        { name: 'Desktop', value: 45, fill: '#2563eb' },
        { name: 'Mobile', value: 35, fill: '#60a5fa' },
        { name: 'Tablet', value: 15, fill: '#93c5fd' },
        { name: 'Other', value: 5, fill: '#dbeafe' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`dashboard-page ${darkMode ? 'dark' : 'light'}`}>
      {error && (
        <div className="error-banner">
          <strong>Backend Connection Error:</strong> {error} - Displaying mock data for demo purposes.
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Revenue</h3>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">${stats.totalRevenue?.toLocaleString() || '124,592'}</div>
          <div className="stat-change positive">+12% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Active Users</h3>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">{stats.activeUsers?.toLocaleString() || '2,849'}</div>
          <div className="stat-change positive">+8% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Orders</h3>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-value">{stats.totalOrders?.toLocaleString() || '1,247'}</div>
          <div className="stat-change positive">+15% from last month</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Conversion Rate</h3>
            <span className="stat-icon">📈</span>
          </div>
          <div className="stat-value">{stats.conversionRate || '3.2%'}</div>
          <div className="stat-change positive">+2.1% from last month</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Revenue Trends</h3>
            <span className="chart-period">Last 12 months</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="month" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : 'white',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={3} 
                dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }} 
                activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Sales by Product</h3>
            <span className="chart-period">Current month</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : 'white',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">Traffic Sources</h3>
            <span className="chart-period">This week</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3 className="chart-title">User Growth</h3>
            <span className="chart-period">Year to date</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="month" stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: darkMode ? '#1e293b' : 'white',
                  border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: darkMode ? '#f1f5f9' : '#1e293b'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="users" 
                stroke="#2563eb" 
                fill="rgba(37, 99, 235, 0.3)" 
                strokeWidth={2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 0;
        }

        .error-banner {
          background: #fee2e2;
          color: #dc2626;
          padding: 16px 20px;
          border-radius: 8px;
          margin-bottom: 24px;
          border-left: 4px solid #dc2626;
          font-size: 0.9rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          padding: 24px;
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid;
          position: relative;
          overflow: hidden;
        }

        .dashboard-page.light .stat-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-color: #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .dashboard-page.dark .stat-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-color: #334155;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .stat-card h3 {
          margin: 0;
          color: #2563eb;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-icon {
          font-size: 1.5rem;
          opacity: 0.7;
        }

        .stat-value {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1;
        }

        .dashboard-page.light .stat-value {
          color: #1e293b;
        }

        .dashboard-page.dark .stat-value {
          color: #f1f5f9;
        }

        .stat-change {
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .stat-change.negative {
          color: #ef4444;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
        }

        .chart-container {
          padding: 24px;
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid;
        }

        .dashboard-page.light .chart-container {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .dashboard-page.dark .chart-container {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .chart-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.1);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .chart-title {
          margin: 0;
          color: #2563eb;
          font-size: 1.3rem;
          font-weight: 600;
        }

        .chart-period {
          font-size: 0.8rem;
          padding: 4px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .dashboard-page.light .chart-period {
          background: #f1f5f9;
          color: #64748b;
        }

        .dashboard-page.dark .chart-period {
          background: #374151;
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .charts-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stat-card {
            padding: 20px;
          }

          .chart-container {
            padding: 20px;
          }

          .stat-value {
            font-size: 1.8rem;
          }

          .chart-title {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;