import { UserProfile, InitDataResponse } from "../types/api";

class ApiService {
  private baseURL = 'https://backend-api.com'; // Заменить на реальный URL
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('jwt_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('jwt_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  }

  async initUser(initData: string): Promise<InitDataResponse> {
    const response = await this.request('/api/user/init', {
      method: 'POST',
      body: JSON.stringify({ initData }),
    });

    if (!response.ok) {
      throw new Error(`Failed to init user: ${response.statusText}`);
    }

    const data = await response.json();

    // Сохраняем токен если получили
    if (data.userStatus.token) {
      this.setToken(data.userStatus.token);
    }

    return data;
  }


  async updateUserData(userProfile: UserProfile): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const response = await this.request('/api/user/update', {
      method: 'POST',
      body: JSON.stringify(userProfile),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user data: ${response.statusText}`);
    }

    return response.json();
  }

  async submitApplication(applicationData: any): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const response = await this.request('/api/order/create', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit application: ${response.statusText}`);
    }

    return response.json();
  }

  async getCargoTypes(): Promise<any> {
    const response = await this.request('/api/cargo-types', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get cargo types: ${response.statusText}`);
    }

    return response.json();
  }

  async getUserOrders(): Promise<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token available');
    }

    const response = await this.request('/api/user/orders', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get user orders: ${response.statusText}`);
    }

    return response.json();
  }

  async getCities(): Promise<any> {
    const response = await this.request('/api/cities', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to get cities: ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
