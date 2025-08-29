import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:26000/api/v1';

class AuthService {
  constructor() {
    this.refreshInterval = null;
  }

  async login(username, password) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      username,
      password
    });
    return response.data;
  }

  async logout() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken
    });
    
    return response.data.accessToken;
  }

  async createMasterUser(data) {
    const response = await axios.post(`${API_BASE_URL}/auth/master/create`, data);
    return response.data;
  }

  async registerUser(data, token) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  async listUsers(token) {
    const response = await axios.get(`${API_BASE_URL}/auth/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  async updateUserPermissions(userId, data, token) {
    const response = await axios.put(`${API_BASE_URL}/auth/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  async createTenant(data, token) {
    const response = await axios.post(`${API_BASE_URL}/auth/tenants`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  async listTenants(token) {
    const response = await axios.get(`${API_BASE_URL}/auth/tenants`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }

  setupTokenRefresh() {
    // Clear any existing interval
    this.clearTokenRefresh();

    // Refresh token every 10 minutes (access token expires in 15 minutes)
    this.refreshInterval = setInterval(async () => {
      try {
        const newToken = await this.refreshToken();
        localStorage.setItem('accessToken', newToken);
      } catch (error) {
        console.error('Auto token refresh failed:', error);
        // The auth context will handle logout
      }
    }, 10 * 60 * 1000); // 10 minutes
  }

  clearTokenRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();