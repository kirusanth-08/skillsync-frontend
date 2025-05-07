// User related types
export interface User {
  uid?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  skills?: Skill[];
  bio?: string;
  joinedDate?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Exam {
  id: string;
  name: string;
  level: string;
  dueDate: string;
  avgTime: number;
  timeLimit?: number;
  formLink?: string;
  status: 'Active' | 'Hidden';
}

// Authentication related types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}