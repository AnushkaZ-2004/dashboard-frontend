import { useState, useEffect, useCallback } from 'react';
import apiService, { mockData } from '../services/api';

// Custom hook for API connection and data fetching
export const useApi = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check backend connection
  const checkConnection = useCallback(async () => {
    try {
      const connected = await apiService.checkConnection();
      setIsConnected(connected);
      setError(connected ? null : 'Backend server is not running');
      return connected;
    } catch (err) {
      setIsConnected(false);
      setError('Failed to connect to backend');
      return false;
    }
  }, []);

  // Generic data fetcher with fallback
  const fetchData = useCallback(async (apiCall, fallbackData) => {
    try {
      setIsLoading(true);
      
      // Try to fetch from API first
      const data = await apiCall();
      setError(null);
      return data;
    } catch (err) {
      console.warn('API call failed, using fallback data:', err.message);
      setError(`API Error: ${err.message}`);
      
      // Return fallback data if API fails
      return fallbackData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(() => {
    return fetchData(
      () => apiService.getDashboardStats(),
      mockData.stats
    );
  }, [fetchData]);

  // Fetch users
  const fetchUsers = useCallback(() => {
    return fetchData(
      () => apiService.getUsers(),
      mockData.users
    );
  }, [fetchData]);

  // Fetch orders
  const fetchOrders = useCallback(() => {
    return fetchData(
      () => apiService.getOrders(),
      mockData.orders
    );
  }, [fetchData]);

  // Fetch revenue data
  const fetchRevenueData = useCallback(() => {
    return fetchData(
      () => apiService.getRevenueData(),
      mockData.revenueData
    );
  }, [fetchData]);

  // Fetch sales data
  const fetchSalesData = useCallback(() => {
    return fetchData(
      () => apiService.getSalesData(),
      mockData.salesData
    );
  }, [fetchData]);

  // Create user with error handling
  const createUser = useCallback(async (userData) => {
    try {
      const result = await apiService.createUser(userData);
      return result;
    } catch (err) {
      throw new Error(`Failed to create user: ${err.message}`);
    }
  }, []);

  // Delete user with error handling
  const deleteUser = useCallback(async (id) => {
    try {
      await apiService.deleteUser(id);
      return true;
    } catch (err) {
      throw new Error(`Failed to delete user: ${err.message}`);
    }
  }, []);

  // Create order with error handling
  const createOrder = useCallback(async (orderData) => {
    try {
      const result = await apiService.createOrder(orderData);
      return result;
    } catch (err) {
      throw new Error(`Failed to create order: ${err.message}`);
    }
  }, []);

  // Delete order with error handling
  const deleteOrder = useCallback(async (id) => {
    try {
      await apiService.deleteOrder(id);
      return true;
    } catch (err) {
      throw new Error(`Failed to delete order: ${err.message}`);
    }
  }, []);

  // Check connection on mount
  useEffect(() => {
    checkConnection().finally(() => setIsLoading(false));
  }, [checkConnection]);

  return {
    // Connection status
    isConnected,
    isLoading,
    error,
    checkConnection,
    
    // Data fetching methods
    fetchDashboardStats,
    fetchUsers,
    fetchOrders,
    fetchRevenueData,
    fetchSalesData,
    
    // CRUD operations
    createUser,
    deleteUser,
    createOrder,
    deleteOrder,
    
    // Direct API access
    api: apiService
  };
};