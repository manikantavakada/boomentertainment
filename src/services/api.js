import config from '../config';

// API service for making server requests
const api = {
  // Get list of videos
  getVideos: async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/videos`);
      if (!response.ok) {
        throw new Error('Failed to get videos');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Like a video
  likeVideo: async (videoId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/like/${videoId}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to like video');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // Upload a video
  uploadVideo: async (formData) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to upload video');
      }
      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default api;