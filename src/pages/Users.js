import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import apiService, { mockData } from '../services/api';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Users = () => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User'
  });

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setUsers(mockData.users);
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await apiService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      // Still remove from UI for demo purposes
      setUsers(users.filter(user => user.id !== id));
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const addedUser = await apiService.createUser(newUser);
      setUsers([...users, addedUser]);
      setNewUser({ name: '', email: '', role: 'User' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding user:', err);
      // Add to UI anyway for demo purposes
      const tempUser = {
        id: Date.now(),
        ...newUser,
        lastLogin: new Date().toLocaleDateString()
      };
      setUsers([...users, tempUser]);
      setNewUser({ name: '', email: '', role: 'User' });
      setShowAddForm(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading users..." />;
  }

  return (
    <div className={`users-page ${darkMode ? 'dark' : 'light'}`}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div>
            <h2>User Management</h2>
            <p>Manage system users and their permissions</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <span>➕</span>
            Add New User
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Backend Connection Error:</strong> {error} - Displaying mock data for demo purposes.
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="card add-user-form">
          <div className="card-header">
            <h3>Add New User</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddUser}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Enter user name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save User
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Stats */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-number">{users.length}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{users.filter(u => u.role === 'Admin').length}</div>
          <div className="stat-label">Administrators</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{users.filter(u => u.role === 'User').length}</div>
          <div className="stat-label">Regular Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{users.filter(u => {
            const loginDate = new Date(u.lastLogin);
            const today = new Date();
            const diffTime = Math.abs(today - loginDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          }).length}</div>
          <div className="stat-label">Active This Week</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card users-table-container">
        <div className="card-header">
          <h3>All Users</h3>
          <span className="record-count">{users.length} users found</span>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge status-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit-btn" title="Edit User">
                          ✏️
                        </button>
                        <button 
                          className="btn-icon delete-btn"
                          onClick={() => handleDelete(user.id)}
                          title="Delete User"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        .users-page {
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

        .users-page.light .header-content h2 {
          color: #1e293b;
        }

        .users-page.dark .header-content h2 {
          color: #f1f5f9;
        }

        .header-content p {
          margin: 4px 0 0 0;
          font-size: 1rem;
        }

        .users-page.light .header-content p {
          color: #64748b;
        }

        .users-page.dark .header-content p {
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

        .add-user-form {
          margin-bottom: 32px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 200px;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .stat-item {
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .users-page.light .stat-item {
          background: white;
          border-color: #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .users-page.dark .stat-item {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .stat-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #2563eb;
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .users-page.light .stat-label {
          color: #64748b;
        }

        .users-page.dark .stat-label {
          color: #94a3b8;
        }

        .users-table-container .card-header {
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

        .users-page.light .record-count {
          background: #f1f5f9;
          color: #64748b;
        }

        .users-page.dark .record-count {
          background: #374151;
          color: #9ca3af;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .user-name {
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
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

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default Users;