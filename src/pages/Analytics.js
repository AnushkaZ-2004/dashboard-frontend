import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useTheme } from '../App';
import apiService, { mockData } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Analytics = () => {
  const { darkMode } = useTheme();
  const [revenueData, setRevenueData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      const [revenueRes, salesRes] = await Promise.all([
        apiService.getRevenueData().catch(() => mockData.revenueData),
        apiService.getSalesData().catch(() => mockData.salesData)
      ]);

      setRevenueData(revenueRes);
      setSalesData(salesRes);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message);
      setRevenueData(mockData.revenueData);
      setSalesData(mockData.salesData);
    } finally {
      setLoading(false);
    }
  };

  // Generate performance metrics
  const getPerformanceMetrics = () => {
    if (!revenueData.length) return {};
    
    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalUsers = revenueData.reduce((sum, item) => sum + item.users, 0);
    const totalOrders = revenueData.reduce((sum, item) => sum + item.orders, 0);
    
    const avgRevenuePerMonth = totalRevenue / revenueData.length;
    const avgUsersPerMonth = totalUsers / revenueData.length;
    const avgOrdersPerMonth = totalOrders / revenueData.length;
    
    // Calculate growth (last month vs previous month)
    const lastMonth = revenueData[revenueData.length - 1];
    const prevMonth = revenueData[revenueData.length - 2];
    
    const revenueGrowth = prevMonth ? ((lastMonth.revenue - prevMonth.revenue) / prevMonth.revenue * 100) : 0;
    const userGrowth = prevMonth ? ((lastMonth.users - prevMonth.users) / prevMonth.users * 100) : 0;
    const orderGrowth = prevMonth ? ((lastMonth.orders - prevMonth.orders) / prevMonth.orders * 100) : 0;

    return {
      totalRevenue,
      totalUsers,
      totalOrders,
      avgRevenuePerMonth,
      avgUsersPerMonth,
      avgOrdersPerMonth,
      revenueGrowth,
      userGrowth,
      orderGrowth
    };
  };

  const metrics = getPerformanceMetrics();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading analytics..." />;
  }

  return (
    <div className={`analytics-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Analytics Dashboard</h2>
            <p>Comprehensive business insights and performance metrics</p>
          </div>
          <div className="period-selector">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Backend Connection Error:</strong> {error} - Displaying mock data for demo purposes.
        </div>
      )}

      {/* Key Performance Indicators */}
      <div className="kpi-section">
        <h3 className="section-title">Key Performance Indicators</h3>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <h4>Total Revenue</h4>
              <span className="kpi-icon">💰</span>
            </div>
            <div className="kpi-value">${metrics.totalRevenue?.toLocaleString()}</div>
            <div className={`kpi-change ${metrics.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              {metrics.revenueGrowth >= 0 ? '↗️' : '↘️'} {Math.abs(metrics.revenueGrowth?.toFixed(1))}% vs last month
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <h4>Total Users</h4>
              <span className="kpi-icon">👥</span>
            </div>
            <div className="kpi-value">{metrics.totalUsers?.toLocaleString()}</div>
            <div className={`kpi-change ${metrics.userGrowth >= 0 ? 'positive' : 'negative'}`}>
              {metrics.userGrowth >= 0 ? '↗️' : '↘️'} {Math.abs(metrics.userGrowth?.toFixed(1))}% vs last month
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <h4>Total Orders</h4>
              <span className="kpi-icon">📦</span>
            </div>
            <div className="kpi-value">{metrics.totalOrders?.toLocaleString()}</div>
            <div className={`kpi-change ${metrics.orderGrowth >= 0 ? 'positive' : 'negative'}`}>
              {metrics.orderGrowth >= 0 ? '↗️' : '↘️'} {Math.abs(metrics.orderGrowth?.toFixed(1))}% vs last month
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-header">
              <h4>Avg. Revenue/Month</h4>
              <span className="kpi-icon">📊</span>
            </div>
            <div className="kpi-value">${metrics.avgRevenuePerMonth?.toLocaleString()}</div>
            <div className="kpi-change neutral">Monthly average</div>
          </div>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="analytics-section">
        <h3 className="section-title">Revenue Analytics</h3>
        <div className="charts-row">
          <div className="chart-container large">
            <div className="chart-header">
              <h4>Revenue Trend Analysis</h4>
              <span className="chart-subtitle">Monthly revenue performance over time</span>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
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
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h4>Revenue vs Orders</h4>
              <span className="chart-subtitle">Correlation analysis</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
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
                <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} name="Orders" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product Performance */}
      <div className="analytics-section">
        <h3 className="section-title">Product Performance</h3>
        <div className="charts-row">
          <div className="chart-container">
            <div className="chart-header">
              <h4>Sales by Product</h4>
              <span className="chart-subtitle">Revenue breakdown by product category</span>
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
                <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} name="Sales" />
                <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h4>Profit Margins</h4>
              <span className="chart-subtitle">Profitability by product</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: $${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="profit"
                >
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45 + 200}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Analytics */}
      <div className="analytics-section">
        <h3 className="section-title">User Analytics</h3>
        <div className="user-metrics">
          <div className="metric-card">
            <h4>User Growth Rate</h4>
            <div className="metric-value">{metrics.userGrowth?.toFixed(1)}%</div>
            <div className="metric-description">Monthly growth in user base</div>
          </div>
          
          <div className="metric-card">
            <h4>Avg Users/Month</h4>
            <div className="metric-value">{metrics.avgUsersPerMonth?.toLocaleString()}</div>
            <div className="metric-description">Average monthly active users</div>
          </div>
          
          <div className="metric-card">
            <h4>Revenue per User</h4>
            <div className="metric-value">${(metrics.totalRevenue / metrics.totalUsers).toFixed(2)}</div>
            <div className="metric-description">Average revenue generated per user</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-page {
          padding: 0;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 20px;
        }

        .header-content h2 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }

        .analytics-page.light .header-content h2 {
          color: #1e293b;
        }

        .analytics-page.dark .header-content h2 {
          color: #f1f5f9;
        }

        .header-content p {
          margin: 4px 0 0 0;
          font-size: 1rem;
        }

        .analytics-page.light .header-content p {
          color: #64748b;
        }

        .analytics-page.dark .header-content p {
          color: #94a3b8;
        }

        .period-select {
          padding: 8px 16px;
          border: 1px solid;
          border-radius: 8px;
          font-size: 0.9rem;
          cursor: pointer;
        }

        .analytics-page.light .period-select {
          background: white;
          border-color: #d1d5db;
          color: #374151;
        }

        .analytics-page.dark .period-select {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
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

        .analytics-section {
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 24px;
          color: #2563eb;
        }

        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .kpi-card {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .analytics-page.light .kpi-card {
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-color: #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .analytics-page.dark .kpi-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-color: #334155;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .kpi-card h4 {
          margin: 0;
          color: #2563eb;
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .kpi-icon {
          font-size: 1.5rem;
          opacity: 0.7;
        }

        .kpi-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1;
        }

        .analytics-page.light .kpi-value {
          color: #1e293b;
        }

        .analytics-page.dark .kpi-value {
          color: #f1f5f9;
        }

        .kpi-change {
          font-size: 0.85rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .kpi-change.positive {
          color: #10b981;
        }

        .kpi-change.negative {
          color: #ef4444;
        }

        .kpi-change.neutral {
          color: #6b7280;
        }

        .charts-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-container {
          padding: 24px;
          border-radius: 16px;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .chart-container.large {
          grid-column: 1 / -1;
        }

        .analytics-page.light .chart-container {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .analytics-page.dark .chart-container {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .chart-container:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.1);
        }

        .chart-header {
          margin-bottom: 24px;
        }

        .chart-header h4 {
          margin: 0 0 4px 0;
          color: #2563eb;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .chart-subtitle {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .analytics-page.light .chart-subtitle {
          color: #64748b;
        }

        .analytics-page.dark .chart-subtitle {
          color: #94a3b8;
        }

        .user-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .metric-card {
          padding: 24px;
          border-radius: 12px;
          border: 1px solid;
          text-align: center;
          transition: all 0.3s ease;
        }

        .analytics-page.light .metric-card {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .analytics-page.dark .metric-card {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .metric-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .metric-card h4 {
          margin: 0 0 16px 0;
          color: #2563eb;
          font-size: 1rem;
          font-weight: 600;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1;
        }

        .analytics-page.light .metric-value {
          color: #1e293b;
        }

        .analytics-page.dark .metric-value {
          color: #f1f5f9;
        }

        .metric-description {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .analytics-page.light .metric-description {
          color: #64748b;
        }

        .analytics-page.dark .metric-description {
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .charts-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .chart-container.large {
            grid-column: auto;
          }

          .user-metrics {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .kpi-value {
            font-size: 2rem;
          }

          .metric-value {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;