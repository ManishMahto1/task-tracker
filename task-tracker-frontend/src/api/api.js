import axios from 'axios';
import { useContext, useCallback } from 'react';
import AuthContext from '../context/AuthContext';

// Base API URL (configurable via environment variable)
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'https://task-tracker-nvdz.onrender.com/api';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hook to get API call functions with auth token
const useApi = () => {
  const { token } = useContext(AuthContext);

  // Add auth token to headers if available
  const getAuthHeaders = useCallback(() => {
    if (token) {
      return { 'x-auth-token': token };
    }
    return {};
  }, [token]);

  // Normalize error response to always return an array of messages
  const normalizeErrors = useCallback((error) => {
    if (error.response?.data?.errors) {
      return error.response.data.errors.map((err) => err.msg);
    }
    if (error.response?.data?.msg) {
      return [error.response.data.msg];
    }
    return [`Failed to process request: ${error.message}`];
  }, []);

  // GET request
  const get = useCallback(async (endpoint, params = {}) => {
    try {
      console.log(`GET Request: ${API_URL}${endpoint}`);
      const response = await api.get(endpoint, {
        headers: getAuthHeaders(),
        params,
      });
      return response.data;
    } catch (error) {
      throw normalizeErrors(error);
    }
  }, [getAuthHeaders, normalizeErrors]);

  // POST request
  const post = useCallback(async (endpoint, data = {}) => {
    try {
      console.log(`POST Request: ${API_URL}${endpoint}`);
      const response = await api.post(endpoint, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw normalizeErrors(error);
    }
  }, [getAuthHeaders, normalizeErrors]);

  // PUT request
  const put = useCallback(async (endpoint, data = {}) => {
    try {
      console.log(`PUT Request: ${API_URL}${endpoint}`);
      const response = await api.put(endpoint, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw normalizeErrors(error);
    }
  }, [getAuthHeaders, normalizeErrors]);

  // DELETE request
  const del = useCallback(async (endpoint) => {
    try {
      console.log(`DELETE Request: ${API_URL}${endpoint}`);
      const response = await api.delete(endpoint, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      throw normalizeErrors(error);
    }
  }, [getAuthHeaders, normalizeErrors]);

  return { get, post, put, del };
};

export default useApi;