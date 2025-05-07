import { User, Skill } from '../types';

// Base URL for API calls
const API_BASE_URL = 'http://localhost:8080/api';

// Helper function for handling fetch responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }
  return response.json();
};

// User profile related API calls
export const getUserProfile = async (userId: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  return handleResponse(response);
};

export const updateUserProfile = async (userId: string, userData: Partial<User>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
    credentials: 'include',
  });
  return handleResponse(response);
};

// Skills related API calls
export const addUserSkill = async (userId: string, skill: Omit<Skill, 'id'>): Promise<Skill> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const updateUserSkill = async (userId: string, skillId: string, skill: Partial<Skill>): Promise<Skill> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/skills/${skillId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(skill),
    credentials: 'include',
  });
  return handleResponse(response);
};

export const deleteUserSkill = async (userId: string, skillId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/skills/${skillId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse(response);
};

// Profile image upload
export const uploadProfileImage = async (userId: string, imageFile: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-image`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  return handleResponse(response);
};

// Analytics and statistics API calls
export const getUsersCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/users/count`);
  const data = await handleResponse(response);
  return data || 0;
};

export const getExamsCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/exams/count`);
  const data = await handleResponse(response);
  return data || 0;
};

export const getCoursesCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/course/count`);
  const data = await handleResponse(response);
  return data || 0;
};

export const getPostsCount = async (): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/posts/count`);
  const data = await handleResponse(response);
  return data || 0;
};

export const getKeyStatistics = async (): Promise<{
  usersCount: number;
  examsCount: number;
  coursesCount: number;
  postsCount: number;
}> => {
  try {
    const [usersCount, examsCount, coursesCount, postsCount] = await Promise.all([
      getUsersCount(),
      getExamsCount(),
      getCoursesCount(),
      getPostsCount()
    ]);
    
    return {
      usersCount,
      examsCount,
      coursesCount,
      postsCount
    };
  } catch (error) {
    console.error('Error fetching key statistics:', error);
    return {
      usersCount: 0,
      examsCount: 0,
      coursesCount: 0,
      postsCount: 0
    };
  }
};

// Placeholder for getUserAnalytics function if it's not defined elsewhere
export const getUserAnalytics = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/analytics`);
  return handleResponse(response);
};