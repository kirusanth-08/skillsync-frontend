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