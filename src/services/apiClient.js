const API_BASE_URL = import.meta.env.VITE_API_URL_PROD || 'http://localhost:8001/api/v1';

// ============= Token Management =============
export class TokenManager {
  static ACCESS_TOKEN_KEY = 'access_token';
  static REFRESH_TOKEN_KEY = 'refresh_token';

  static getAccessToken() {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static hasValidToken() {
    return !!this.getAccessToken();
  }
}

// ============= API Error Handling =============
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// ============= Base API Client =============
class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  subscribeToRefresh(callback) {
    this.refreshSubscribers.push(callback);
  }

  onRefreshed(newToken) {
    this.refreshSubscribers.forEach(callback => callback(newToken));
    this.refreshSubscribers = [];
  }

  getHeaders(includeAuth = true, contentType = 'application/json') {
    const headers = {};
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    if (includeAuth) {
      const token = TokenManager.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  async parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        const message = data.detail || data.message || 'An error occurred';
        throw new ApiError(message, response.status, data);
      }
      
      return data;
    }
    
    if (!response.ok) {
      throw new ApiError('Request failed', response.status);
    }
    
    return response.text();
  }

  async refreshToken() {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new ApiError('No refresh token available', 401);
    }

    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      TokenManager.clearTokens();
      throw new ApiError('Token refresh failed', 401);
    }

    const result = await response.json();
    const { access_token, refresh_token } = result.data || result;
    TokenManager.setTokens(access_token, refresh_token);
    
    return access_token;
  }

  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      body = null,
      includeAuth = true,
      contentType = 'application/json',
      retry = true,
    } = options;

    const url = `${this.baseUrl}${endpoint}`;
    
    const fetchOptions = {
      method,
      headers: this.getHeaders(includeAuth, contentType),
    };

    if (body && contentType === 'application/json') {
      fetchOptions.body = JSON.stringify(body);
    } else if (body) {
      fetchOptions.body = body;
    }

    try {
      const response = await fetch(url, fetchOptions);
      
      if (response.status === 401 && includeAuth && retry) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          
          try {
            const newToken = await this.refreshToken();
            this.isRefreshing = false;
            this.onRefreshed(newToken);
            
            return this.request(endpoint, { ...options, retry: false });
          } catch (refreshError) {
            this.isRefreshing = false;
            throw refreshError;
          }
        } else {
          return new Promise((resolve, reject) => {
            this.subscribeToRefresh(async () => {
              try {
                const result = await this.request(endpoint, { ...options, retry: false });
                resolve(result);
              } catch (error) {
                reject(error);
              }
            });
          });
        }
      }
      
      return this.parseResponse(response);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message || 'Network error', 0);
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
