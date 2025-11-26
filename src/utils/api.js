class ApiClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': this.sessionId,
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Projects API
  async getProjects(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/projects${queryString ? '?' + queryString : ''}`);
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  async getProjectCategories() {
    return this.request('/projects/meta/categories');
  }

  async getProjectStats() {
    return this.request('/projects/meta/stats');
  }

  // Analytics API
  async trackEvent(eventType, pagePath, metadata = {}) {
    return this.request('/analytics/track', {
      method: 'POST',
      body: {
        event_type: eventType,
        page_path: pagePath,
        metadata
      }
    });
  }

  async getAnalyticsDashboard(days = 30) {
    return this.request(`/analytics/dashboard?days=${days}`);
  }

  async getPerformanceMetrics() {
    return this.request('/analytics/performance');
  }

  // Contact API
  async submitContactForm(formData) {
    return this.request('/contact', {
      method: 'POST',
      body: formData
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Performance tracking utilities
export class PerformanceTracker {
  constructor(apiClient) {
    this.api = apiClient;
    this.startTime = performance.now();
  }

  trackPageLoad() {
    window.addEventListener('load', () => {
      const loadTime = performance.now() - this.startTime;
      const pageSize = this.estimatePageSize();
      
      this.api.trackEvent('performance', window.location.pathname, {
        loadTime: loadTime.toFixed(2),
        pageSize,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      });
    });
  }

  estimatePageSize() {
    const resources = performance.getEntriesByType('resource');
    return resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0);
    }, 0);
  }

  trackUserInteraction(element, action) {
    this.api.trackEvent('interaction', window.location.pathname, {
      element: element.tagName.toLowerCase(),
      action,
      elementId: element.id,
      elementClass: element.className
    });
  }
}

// Create singleton instance
export const api = new ApiClient();
export const performanceTracker = new PerformanceTracker(api);