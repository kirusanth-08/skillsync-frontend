// src/services/skillService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/skills';

export const skillService = {
  // Get all skills
  getAllSkills: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  getAllSkillsByUser: async (username) => {
    try {
      const response = await axios.get(`${API_URL}/user?user=${username}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skills:', error);
      throw error;
    }
  },

  // Get skill by ID
  getSkillById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skill with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new skill
  createSkill: async (skillData, username) => {
    try {
      // Transform the frontend skill format to backend DTO format
      const skillDTO = {
        skillName: skillData.name,
        proficiency_level: skillData.level,
        experience: skillData.yearsOfExperience,
        user: username
      };
      
      const response = await axios.post(API_URL, skillDTO);
      
      // Transform the response back to frontend format
      return {
        id: response.data.id,
        name: response.data.skillName,
        level: response.data.proficiency_level,
        yearsOfExperience: response.data.experience
      };
    } catch (error) {
      console.error('Error creating skill:', error);
      throw error;
    }
  },

  // Update skill
  updateSkill: async (id, skillData) => {
    try {
      // Transform the frontend skill format to backend DTO format
      const skillDTO = {
        skillName: skillData.name,
        proficiency_level: skillData.level,
        experience: skillData.yearsOfExperience
      };
      
      const response = await axios.put(`${API_URL}/${id}`, skillDTO);
      
      // Transform the response back to frontend format
      return {
        id: response.data.id,
        name: response.data.skillName,
        level: response.data.proficiency_level,
        yearsOfExperience: response.data.experience
      };
    } catch (error) {
      console.error(`Error updating skill with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete skill
  deleteSkill: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting skill with ID ${id}:`, error);
      throw error;
    }
  }
};

export default skillService;