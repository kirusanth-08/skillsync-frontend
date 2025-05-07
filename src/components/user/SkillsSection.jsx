import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import SkillForm from './SkillForm';
import ConfirmDialog from '../ui/ConfirmDialog';

const SkillsSection = ({ user, onAddSkill, onUpdateSkill, onDeleteSkill }) => {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [deleteSkill, setDeleteSkill] = useState(null);

  const skillLevelColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-blue-100 text-blue-800',
    Advanced: 'bg-purple-100 text-purple-800',
    Expert: 'bg-red-100 text-red-800',
  };

  const handleAddSkill = (newSkill) => {
    onAddSkill(newSkill);
    setIsAddingSkill(false);
  };

  const handleUpdateSkill = (updatedSkill) => {
    onUpdateSkill(updatedSkill.id, updatedSkill);
    setEditingSkill(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteSkill) {
      onDeleteSkill(deleteSkill.id);
      setDeleteSkill(null);
    }
  };

  // Safeguard in case user is null or user.skills is not available
  if (!user || !user.skills) {
    return (
      <Card title="Skills" className="mb-6">
        <p className="text-gray-500 text-center py-4">Loading skills...</p>
      </Card>
    );
  }

  const sortedSkills = [...user.skills].sort((a, b) => {
    const levelOrder = { Expert: 0, Advanced: 1, Intermediate: 2, Beginner: 3 };
    return levelOrder[a.level] - levelOrder[b.level];
  });

  return (
    <Card title="Skills" className="mb-6">
      {!isAddingSkill && !editingSkill && (
        <div className="mb-4">
          <Button variant="primary" size="sm" onClick={() => setIsAddingSkill(true)}>
            <Plus size={16} className="mr-1" /> Add Skill
          </Button>
        </div>
      )}

      {isAddingSkill && (
        <SkillForm
          onSubmit={handleAddSkill}
          onCancel={() => setIsAddingSkill(false)}
        />
      )}

      {editingSkill && (
        <SkillForm
          skill={editingSkill}
          onSubmit={handleUpdateSkill}
          onCancel={() => setEditingSkill(null)}
        />
      )}

      {!isAddingSkill && !editingSkill && (
        <div className="space-y-3">
          {sortedSkills.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No skills added yet. Add your first skill!
            </p>
          ) : (
            sortedSkills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow flex justify-between items-center"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{skill.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${skillLevelColors[skill.level]}`}>
                      {skill.level}
                    </span>
                    {skill.yearsOfExperience !== undefined && (
                      <span className="text-sm text-gray-500 ml-2">
                        {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="p-1 rounded hover:bg-gray-100 text-gray-600"
                    onClick={() => setEditingSkill(skill)}
                    aria-label="Edit skill"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-100 text-red-600"
                    onClick={() => setDeleteSkill(skill)}
                    aria-label="Delete skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteSkill}
        title="Delete Skill"
        message={`Are you sure you want to delete ${deleteSkill?.name}? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteSkill(null)}
      />
    </Card>
  );
};

export default SkillsSection;
