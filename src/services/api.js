const API_BASE_URL = 'http://localhost:8080/api';

// Course related API calls
export const getFeaturedCourses = async () => {
  const response = await fetch(`${API_BASE_URL}/course/featured`);
  if (!response.ok) {
    throw new Error('Failed to fetch featured courses');
  }
  return response.json();
};

export const getRecommendedCourses = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/course/recommended/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recommended courses');
  }
  return response.json();
};

export const getUserAnalytics = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/analytics/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user analytics');
  }
  return response.json();
};

// User profile related API calls
export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  return response.json();
};

export const updateUserProfile = async (userId, userData) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Failed to update user profile');
  }
  return response.json();
};

export const uploadProfileImage = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-image`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload profile image');
  }
  return response.json();
};

import axios from "axios";

export const getAllPosts = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/posts"); // or hosted URL
    return response.data;
  } catch (error) {
    console.error("Failed to fetch MongoDB posts:", error);
    return [];
  }
};

