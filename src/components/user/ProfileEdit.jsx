import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import userService from '../../services/userService';

const API_BASE_URL = 'http://localhost:8080'; // change for production

const ProfileEdit = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
      });
      setPreviewImage(user.imageUrl || `${API_BASE_URL}/uploads/default-profile.jpg`);
    }
  }, [user]);

  const removeImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, image: 'Please select an image file' }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => setPreviewImage(event.target.result);
    reader.readAsDataURL(file);
    setImageFile(file);
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      let updatedProfile = { ...formData };

      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
          const res = await userService.uploadProfileImage(updatedProfile.username, formData);
          const fullImageUrl = res.imageUrl;  // or res.data.imageUrl if wrapped in `.data`

          setPreviewImage(fullImageUrl);
          updatedProfile.imageUrl = fullImageUrl;
        } catch (err) {
          console.error('Image upload failed', err);
        }
      } else if (!previewImage) {
        updatedProfile.imageUrl = null;
      } else {
        updatedProfile.imageUrl = previewImage;
      }

      await userService.updateUserProfileByUsername(updatedProfile.username, updatedProfile);
      onSave(updatedProfile);
    } catch (err) {
      console.error('Profile update error', err);
      setErrors({ api: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50/40 to-blue-100/30 backdrop-blur-lg rounded-xl shadow-xl border border-blue-100/30 p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-black">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.api && (
          <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            {errors.api}
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            {previewImage ? (
              <div className="relative">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white/50 shadow-lg hover:border-blue-400 transition-all duration-300 group-hover:scale-105">
                  <img src={previewImage} alt="Profile preview" className="w-full h-full object-cover" />
                </div>
                <button 
                  type="button" 
                  onClick={removeImage} 
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-300"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-50/60 to-blue-200/50 backdrop-blur-sm flex items-center justify-center text-blue-400 border-4 border-blue-100/40 shadow-lg">
                <Camera size={36} />
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} name="profileImage" />
          </div>
          <button 
            type="button" 
            onClick={triggerFileInput} 
            className="mt-4 px-4 py-2 bg-blue-500/80 hover:bg-blue-600/90 backdrop-blur-sm text-white rounded-full text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Change Photo
          </button>
          {errors.image && <p className="text-red-500 text-sm mt-2">{errors.image}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-black-700 dark:text-black-300">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleInputChange} 
              className="block w-full px-4 py-3 bg-blue-50/30 backdrop-blur-sm border border-blue-200/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-500 dark:text-black-400 placeholder-gray-400 transition-all duration-300" 
              required 
              placeholder="Enter your first name"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-black-300">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleInputChange} 
              className="block w-full px-4 py-3 bg-blue-50/30 backdrop-blur-sm border border-blue-200/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-500 dark:text-black-400 placeholder-gray-400 transition-all duration-300" 
              required 
              placeholder="Enter your last name"
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-black-300">Username</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={formData.username} 
            readOnly 
            disabled 
            className="block w-full px-4 py-3 bg-blue-100/10 backdrop-blur-sm border border-blue-100/20 rounded-lg shadow-inner text-gray-500 dark:text-gray-400 cursor-not-allowed" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-black-300">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
            className="block w-full px-4 py-3 bg-blue-50/30 backdrop-blur-sm border border-blue-200/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-500 dark:text-black-400 placeholder-gray-400 transition-all duration-300" 
            required 
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-black-300">Bio</label>
          <textarea 
            id="bio" 
            name="bio" 
            value={formData.bio} 
            onChange={handleInputChange} 
            rows={4} 
            className="block w-full px-4 py-3 bg-blue-50/30 backdrop-blur-sm border border-blue-200/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-gray-500 dark:text-black-400 placeholder-gray-400 transition-all duration-300" 
            placeholder="Tell us a bit about yourself..."
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gray-300/50 hover:bg-gray-400/60 backdrop-blur-sm text-gray-700 dark:text-black-200 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/90 hover:to-purple-600/90 backdrop-blur-sm text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;