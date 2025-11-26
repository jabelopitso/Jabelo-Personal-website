import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, PerformanceTracker } from '../src/utils/api.js';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('request method', () => {
    it('should make successful API requests', async () => {
      const mockResponse = { success: true, data: 'test' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await api.request('/test');
      
      expect(global.fetch).toHaveBeenCalledWith('/api/test', {
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': expect.any(String)
        }
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' })
      });

      await expect(api.request('/nonexistent')).rejects.toThrow('Not found');
    });

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.request('/test')).rejects.toThrow('Network error');
    });
  });

  describe('projects API', () => {
    it('should fetch projects with parameters', async () => {
      const mockProjects = [{ id: 1, title: 'Test Project' }];
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      });

      const result = await api.getProjects({ category: 'web', limit: 10 });
      
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/projects?category=web&limit=10',
        expect.any(Object)
      );
      expect(result).toEqual(mockProjects);
    });

    it('should fetch single project', async () => {
      const mockProject = { id: 1, title: 'Test Project' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockProject)
      });

      const result = await api.getProject(1);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/projects/1', expect.any(Object));
      expect(result).toEqual(mockProject);
    });
  });

  describe('analytics API', () => {
    it('should track events', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });

      await api.trackEvent('page_view', '/home', { test: true });
      
      expect(global.fetch).toHaveBeenCalledWith('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': expect.any(String)
        },
        body: JSON.stringify({
          event_type: 'page_view',
          page_path: '/home',
          metadata: { test: true }
        })
      });
    });
  });

  describe('contact API', () => {
    it('should submit contact form', async () => {
      const formData = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Test message'
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true, id: 1 })
      });

      const result = await api.submitContactForm(formData);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': expect.any(String)
        },
        body: JSON.stringify(formData)
      });
      expect(result.success).toBe(true);
    });
  });
});

describe('PerformanceTracker', () => {
  let tracker;
  let mockApi;

  beforeEach(() => {
    mockApi = {
      trackEvent: vi.fn()
    };
    tracker = new PerformanceTracker(mockApi);
  });

  it('should initialize with start time', () => {
    expect(tracker.startTime).toBeTypeOf('number');
    expect(tracker.api).toBe(mockApi);
  });

  it('should estimate page size', () => {
    global.performance.getEntriesByType.mockReturnValueOnce([
      { transferSize: 1000 },
      { transferSize: 2000 },
      { transferSize: undefined }
    ]);

    const size = tracker.estimatePageSize();
    expect(size).toBe(3000);
  });

  it('should track user interactions', () => {
    const element = {
      tagName: 'BUTTON',
      id: 'test-btn',
      className: 'btn-primary'
    };

    tracker.trackUserInteraction(element, 'click');

    expect(mockApi.trackEvent).toHaveBeenCalledWith(
      'interaction',
      window.location.pathname,
      {
        element: 'button',
        action: 'click',
        elementId: 'test-btn',
        elementClass: 'btn-primary'
      }
    );
  });
});