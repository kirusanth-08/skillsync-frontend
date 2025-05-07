import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProfileHeader from '../components/user/ProfileHeader';
import ProfileEdit from '../components/user/ProfileEdit';
import SkillsSection from '../components/user/SkillsSection';
import Card from '../components/ui/Card';
import skillService from '../services/skillService';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userWithSkills, setUserWithSkills] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await skillService.getAllSkillsByUser(user.username);
        //console.log(user.username);
        // Create a copy of the user with skills from the backend
        const updatedUser = {
          ...user,
          skills: skills.map(skill => ({
            id: skill.id,
            name: skill.skillName,
            level: skill.proficiency_level,
            yearsOfExperience: skill.experience
          }))
        };
        
        setUserWithSkills(updatedUser);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
        setError("Failed to load skills. Please try again later.");
        // Use the user without skills if we failed to fetch them
        setUserWithSkills(user);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSkills();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Not Authenticated</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </a>
        </Card>
      </div>
    );
  }

  const handleProfileSave = (updatedUser) => {
    // In a real app, you'd make an API call to update the user profile
    updateUser(updatedUser);
    setIsEditing(false);
  };

  const handleAddSkill = async (skill) => {
    try {
      // Connect to backend service to add the skill
      const newSkill = await skillService.createSkill(skill, user.username);
      
      // Update the local state
      const updatedSkills = [...(userWithSkills.skills || []), newSkill];
      setUserWithSkills({ ...userWithSkills, skills: updatedSkills });
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error("Failed to add skill:", err);
      setError("Failed to add skill. Please try again.");
    }
  };

  const handleUpdateSkill = async (skillId, updatedSkill) => {
    try {
      // Connect to backend service to update the skill
      const updated = await skillService.updateSkill(skillId, updatedSkill);
      
      // Update local state with the response from backend
      const updatedSkills = userWithSkills.skills.map(skill => 
        skill.id === skillId ? updated : skill
      );
      
      setUserWithSkills({ ...userWithSkills, skills: updatedSkills });
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error(`Failed to update skill ${skillId}:`, err);
      setError("Failed to update skill. Please try again.");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      // Connect to backend service to delete the skill
      await skillService.deleteSkill(skillId);
      
      // Update local state
      const updatedSkills = userWithSkills.skills.filter(skill => skill.id !== skillId);
      setUserWithSkills({ ...userWithSkills, skills: updatedSkills });
      
      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error(`Failed to delete skill ${skillId}:`, err);
      setError("Failed to delete skill. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
            <button 
              className="float-right font-bold"
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        )}
        
        {isEditing ? (
          <ProfileEdit 
            user={userWithSkills} 
            onSave={handleProfileSave} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <>
            <ProfileHeader user={userWithSkills} onEditProfile={() => setIsEditing(true)} />
            
            <SkillsSection 
              user={userWithSkills}
              onAddSkill={handleAddSkill}
              onUpdateSkill={handleUpdateSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;