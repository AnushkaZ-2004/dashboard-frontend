// API service for backend communication
const API_BASE_URL = 'http://localhost:8080/api/dashboard';

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this.request('/stats');
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(id) {
    return this.request(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Revenue Data
  async getRevenueData() {
    return this.request('/revenue');
  }

  // Sales Data
  async getSalesData() {
    return this.request('/sales');
  }
}

// Mock data for fallback
export const mockData = {
  stats: {
    totalRevenue: 124592,
    activeUsers: 2849,
    totalOrders: 1247,
    conversionRate: '3.2%'
  },
  
  revenueData: [
    { month: 'Jan', revenue: 45000, users: 850, orders: 320 },
    { month: 'Feb', revenue: 52000, users: 920, orders: 380 },
    { month: 'Mar', revenue: 48000, users: 780, orders: 295 },
    { month: 'Apr', revenue: 65000, users: 1100, orders: 450 },
    { month: 'May', revenue: 58000, users: 980, orders: 385 },
    { month: 'Jun', revenue: 72000, users: 1250, orders: 520 },
    { month: 'Jul', revenue: 68000, users: 1180, orders: 485 },
    { month: 'Aug', revenue: 75000, users: 1350, orders: 550 },
    { month: 'Sep', revenue: 62000, users: 1050, orders: 420 },
    { month: 'Oct', revenue: 58000, users: 950, orders: 375 },
    { month: 'Nov', revenue: 70000, users: 1200, orders: 510 },
    { month: 'Dec', revenue: 85000, users: 1500, orders: 650 }
  ],

  salesData: [
    { name: 'Product A', sales: 8500, profit: 3200 },
    { name: 'Product B', sales: 6200, profit: 2800 },
    { name: 'Product C', sales: 9800, profit: 4100 },
    { name: 'Product D', sales: 5400, profit: 2200 },
    { name: 'Product E', sales: 7600, profit: 3500 }
  ],

  users: [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', lastLogin: '2024-08-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', lastLogin: '2024-08-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Admin', lastLogin: '2024-08-16' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@example.com', role: 'User', lastLogin: '2024-08-13' },
    { id: 5, name: 'David Brown', email: 'david.brown@example.com', role: 'User', lastLogin: '2024-08-12' },
    { id: 6, name: 'Lisa Anderson', email: 'lisa.anderson@example.com', role: 'Admin', lastLogin: '2024-08-17' }
  ],

  orders: [
    { id: 1, orderNumber: 'ORD-1001', customer: 'Customer A', amount: '299.99', status: 'COMPLETED', orderDate: '2024-08-15' },
    { id: 2, orderNumber: 'ORD-1002', customer: 'Customer B', amount: '599.50', status: 'ACTIVE', orderDate: '2024-08-16' },
    { id: 3, orderNumber: 'ORD-1003', customer: 'Customer C', amount: '899.00', status: 'PENDING', orderDate: '2024-08-14' },
    { id: 4, orderNumber: 'ORD-1004', customer: 'Customer D', amount: '150.75', status: 'COMPLETED', orderDate: '2024-08-13' },
    { id: 5, orderNumber: 'ORD-1005', customer: 'Customer E', amount: '1299.99', status: 'CANCELLED', orderDate: '2024-08-12' },
    { id: 6, orderNumber: 'ORD-1006', customer: 'Customer F', amount: '450.25', status: 'ACTIVE', orderDate: '2024-08-17' },
    { id: 7, orderNumber: 'ORD-1007', customer: 'Customer G', amount: '750.00', status: 'PENDING', orderDate: '2024-08-11' },
    { id: 8, orderNumber: 'ORD-1008', customer: 'Customer H', amount: '325.50', status: 'COMPLETED', orderDate: '2024-08-10' }
  ]
};

export default new ApiService();