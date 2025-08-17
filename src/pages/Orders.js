import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import apiService, { mockData } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Orders = () => {
  const { darkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setOrders(mockData.orders);
      setFilteredOrders(mockData.orders);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders
  useEffect(() => {
    let filtered = orders;

    // Filter by status
    if (filter !== 'ALL') {
      filtered = filtered.filter(order => order.status === filter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, filter, searchTerm]);

  // Delete order
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await apiService.deleteOrder(id);
      const updatedOrders = orders.filter(order => order.id !== id);
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error deleting order:', err);
      // Still remove from UI for demo purposes
      const updatedOrders = orders.filter(order => order.id !== id);
      setOrders(updatedOrders);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED': return '#10b981';
      case 'ACTIVE': return '#3b82f6';
      case 'PENDING': return '#f59e0b';
      case 'CANCELLED': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    active: orders.filter(o => o.status === 'ACTIVE').length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    completed: orders.filter(o => o.status === 'COMPLETED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    totalRevenue: orders
      .filter(o => o.status === 'COMPLETED')
      .reduce((sum, o) => sum + parseFloat(o.amount), 0)
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading orders..." />;
  }

  return (
    <div className={`orders-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>Order Management</h2>
            <p>Track and manage customer orders</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Backend Connection Error:</strong> {error} - Displaying mock data for demo purposes.
        </div>
      )}

      {/* Order Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Orders</h3>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-change">All time orders</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Active Orders</h3>
            <span className="stat-icon">🟢</span>
          </div>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-change">Currently processing</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Pending Orders</h3>
            <span className="stat-icon">🟡</span>
          </div>
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-change">Awaiting action</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Total Revenue</h3>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">${stats.totalRevenue.toFixed(2)}</div>
          <div className="stat-change">From completed orders</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card filters-section">
        <div className="card-body">
          <div className="filters-row">
            <div className="filter-group">
              <label className="filter-label">Filter by Status:</label>
              <div className="filter-buttons">
                {['ALL', 'ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'].map(status => (
                  <button
                    key={status}
                    className={`filter-btn ${filter === status ? 'active' : ''}`}
                    onClick={() => setFilter(status)}
                  >
                    {status}
                    {status !== 'ALL' && (
                      <span className="filter-count">
                        {status === 'ALL' ? stats.total : stats[status.toLowerCase()]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="search-group">
              <label className="filter-label">Search Orders:</label>
              <input
                type="text"
                className="search-input"
                placeholder="Search by order number or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card orders-table-container">
        <div className="card-header">
          <h3>Orders List</h3>
          <span className="record-count">{filteredOrders.length} orders found</span>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-number">{order.orderNumber}</span>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">
                          {order.customer.charAt(0).toUpperCase()}
                        </div>
                        <span className="customer-name">{order.customer}</span>
                      </div>
                    </td>
                    <td>
                      <span className="amount">${order.amount}</span>
                    </td>
                    <td>
                      <span 
                        className={`status-badge status-${order.status.toLowerCase()}`}
                        style={{ backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{order.orderDate || order.date}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon view-btn" title="View Order">
                          👁️
                        </button>
                        <button className="btn-icon edit-btn" title="Edit Order">
                          ✏️
                        </button>
                        <button 
                          className="btn-icon delete-btn"
                          onClick={() => handleDelete(order.id)}
                          title="Delete Order"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredOrders.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No orders found</h3>
                <p>No orders match your current filters. Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .orders-page {
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

        .orders-page.light .header-content h2 {
          color: #1e293b;
        }

        .orders-page.dark .header-content h2 {
          color: #f1f5f9;
        }

        .header-content p {
          margin: 4px 0 0 0;
          font-size: 1rem;
        }

        .orders-page.light .header-content p {
          color: #64748b;
        }

        .orders-page.dark .header-content p {
          color: #94a3b8;
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
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          padding: 24px;
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid;
        }

        .orders-page.light .stat-card {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .orders-page.dark .stat-card {
          background: #1e293b;
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

        .orders-page.light .stat-value {
          color: #1e293b;
        }

        .orders-page.dark .stat-value {
          color: #f1f5f9;
        }

        .stat-change {
          font-size: 0.85rem;
          font-weight: 500;
        }

        .orders-page.light .stat-change {
          color: #64748b;
        }

        .orders-page.dark .stat-change {
          color: #94a3b8;
        }

        .filters-section {
          margin-bottom: 24px;
        }

        .filters-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }

        .filter-group {
          flex: 1;
        }

        .search-group {
          flex: 0 0 300px;
        }

        .filter-label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .orders-page.light .filter-label {
          color: #374151;
        }

        .orders-page.dark .filter-label {
          color: #d1d5db;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid;
          border-radius: 20px;
          background: none;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .orders-page.light .filter-btn {
          border-color: #d1d5db;
          color: #6b7280;
        }

        .orders-page.dark .filter-btn {
          border-color: #4b5563;
          color: #9ca3af;
        }

        .filter-btn:hover {
          transform: translateY(-2px);
        }

        .orders-page.light .filter-btn:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        .orders-page.dark .filter-btn:hover {
          border-color: #60a5fa;
          color: #60a5fa;
        }

        .filter-btn.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }

        .filter-count {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.75rem;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px;
          border: 1px solid;
          border-radius: 25px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .orders-page.light .search-input {
          background: white;
          border-color: #d1d5db;
          color: #111827;
        }

        .orders-page.dark .search-input {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }

        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .orders-table-container .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .record-count {
          font-size: 0.9rem;
          padding: 4px 12px;
          border-radius: 12px;
          font-weight: 500;
        }

        .orders-page.light .record-count {
          background: #f1f5f9;
          color: #64748b;
        }

        .orders-page.dark .record-count {
          background: #374151;
          color: #9ca3af;
        }

        .order-number {
          font-family: 'Courier New', monospace;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .orders-page.light .order-number {
          background: #f1f5f9;
          color: #2563eb;
        }

        .orders-page.dark .order-number {
          background: #374151;
          color: #60a5fa;
        }

        .customer-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .customer-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .customer-name {
          font-weight: 500;
        }

        .amount {
          font-weight: 600;
          font-size: 1rem;
          color: #10b981;
        }

        .action-buttons {
          display: flex;
          gap: 6px;
        }

        .btn-icon {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .view-btn {
          background: #e0f2fe;
          color: #0369a1;
        }

        .view-btn:hover {
          background: #b3e5fc;
          transform: scale(1.1);
        }

        .edit-btn {
          background: #f3f4f6;
          color: #374151;
        }

        .edit-btn:hover {
          background: #e5e7eb;
          transform: scale(1.1);
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #fecaca;
          transform: scale(1.1);
        }

        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .orders-page.light .empty-state h3 {
          color: #374151;
        }

        .orders-page.dark .empty-state h3 {
          color: #d1d5db;
        }

        .empty-state p {
          margin: 0;
          font-size: 0.9rem;
        }

        .orders-page.light .empty-state p {
          color: #6b7280;
        }

        .orders-page.dark .empty-state p {
          color: #9ca3af;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .filters-row {
            flex-direction: column;
            gap: 16px;
          }

          .search-group {
            flex: 1;
            width: 100%;
          }

          .filter-buttons {
            flex-wrap: wrap;
          }

          .action-buttons {
            flex-direction: column;
            gap: 4px;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;