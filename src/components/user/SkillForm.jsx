import React, { useState } from 'react';
import Button from '../ui/Button';

const SkillForm = ({ skill, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: skill?.id || '',
    name: skill?.name || '',
    level: skill?.level || 'Beginner',
    yearsOfExperience: skill?.yearsOfExperience || 0,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required';
    }

    if (formData.yearsOfExperience < 0) {
      newErrors.yearsOfExperience = 'Years of experience cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 rounded-lg p-4 mb-4">
      <h3 className="font-medium">{skill ? 'Edit Skill' : 'Add New Skill'}</h3>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Skill Name*
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleInputChange}
          className={`block w-full px-3 py-2 border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          placeholder="e.g., JavaScript, Project Management, etc."
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
          Proficiency Level
        </label>
        <select
          id="level"
          name="level"
          value={formData.level}
          onChange={handleInputChange}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>

      <div>
        <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Experience
        </label>
        <input
          id="yearsOfExperience"
          name="yearsOfExperience"
          type="number"
          min="0"
          step="1"
          value={formData.yearsOfExperience}
          onChange={handleInputChange}
          className={`block w-full px-3 py-2 border ${
            errors.yearsOfExperience ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
        {errors.yearsOfExperience && (
          <p className="mt-1 text-sm text-red-500">{errors.yearsOfExperience}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button variant="primary" type="submit" size="sm">
          {skill ? 'Update' : 'Add'} Skill
        </Button>
      </div>
    </form>
  );
};

export default SkillForm;
