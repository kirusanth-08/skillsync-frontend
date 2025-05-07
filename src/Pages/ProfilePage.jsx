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
        setUserWithSkills(user);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchSkills();
    else setLoading(false);
  }, [user]);

  const handleProfileSave = (updatedUser) => {
    updateUser(updatedUser);
    setIsEditing(false);
  };

  const handleAddSkill = async (skill) => {
    try {
      const newSkill = await skillService.createSkill(skill, user.username);
      const updatedSkills = [...(userWithSkills.skills || []), newSkill];
      setUserWithSkills({ ...userWithSkills, skills: updatedSkills });
      setError(null);
    } catch (err) {
      console.error("Failed to add skill:", err);
      setError("Failed to add skill. Please try again.");
    }
  };

  const handleUpdateSkill = async (skillId, updatedSkill) => {
    try {
      const updated = await skillService.updateSkill(skillId, updatedSkill);
      const updatedSkills = userWithSkills.skills.map(skill => 
        skill.id === skillId ? updated : skill
      );
      setUserWithSkills({ ...userWithSkills, skills: updatedSkills });
      setError(null);
    } catch (err) {
      console.error(`Failed to update skill ${skillId}:`, err);
      setError("Failed to update skill. Please try again.");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await skillService.deleteSkill(skillId);
      const updatedSkills = userWithSkills.skills.filter(skill => skill.id !== skillId);
      setUserWithSkills({ ...userWithSkills, skills: updatedSkills });
      setError(null);
    } catch (err) {
      console.error(`Failed to delete skill ${skillId}:`, err);
      setError("Failed to delete skill. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="w-full max-w-4xl p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-60 bg-white/40 backdrop-blur rounded-xl shadow-md"></div>
            <div className="h-80 bg-white/40 backdrop-blur rounded-xl shadow-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-200 p-6 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md bg-white/40 backdrop-blur-md shadow-xl border border-white">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Not Authenticated</h2>
          <p className="text-gray-700 mb-6">You need to be logged in to view your profile.</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow-md">
            <p>{error}</p>
            <button 
              className="float-right font-bold"
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        )}

        <div className="rounded-xl bg-white/40 backdrop-blur-lg p-4 shadow-md border border-white">
          {isEditing ? (
            <ProfileEdit 
              user={userWithSkills} 
              onSave={handleProfileSave} 
              onCancel={() => setIsEditing(false)} 
            />
          ) : (
            <ProfileHeader user={userWithSkills} onEditProfile={() => setIsEditing(true)} />
          )}
        </div>

        {!isEditing && (
          <div className="rounded-xl bg-white/30 backdrop-blur-xl shadow-lg p-4 border border-white">
            <SkillsSection 
              user={userWithSkills}
              onAddSkill={handleAddSkill}
              onUpdateSkill={handleUpdateSkill}
              onDeleteSkill={handleDeleteSkill}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
