import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profiles';

export const userService = {
  // Get user by Username
  getUserByUserName: async (username) => {
    try {
      const response = await axios.get(`${API_URL}/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching User with username ${username}:`, error);
      throw error;
    }
  },

  // Update user profile by Username
  updateUserProfileByUsername: async (username, profileData) => {
    try {
      const response = await axios.put(`${API_URL}/${username}`, profileData);
      return response.data;
    } catch (error) {
      console.error(`Error updating User with username ${username}:`, error);
      throw error;
    }
  },

  // Upload profile image
  uploadProfileImage: async (username, formData) => {
    try {
      const response = await axios.post(`${API_URL}/${username}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
};

export default userService;