const API_BASE_URL = 'http://localhost:8080/api/posts'; // Base points to /api/posts already

// Fetch all posts
export const getAllPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/allPost`);
  if (!response.ok) {
    throw new Error('Allahuakbar! Failed to fetch posts');
  }
  return response.json();
};

// Create a new post
export const createPost = async (postData) => {
  const response = await fetch(`${API_BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
};

// Get post by ID
export const getPostById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
};

// Update post by ID
export const updatePost = async (id, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
  return response.json();
};

// Delete post by ID
export const deletePost = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
};
