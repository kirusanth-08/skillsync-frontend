import React from 'react';

const API_BASE_URL = 'http://localhost:8080';

const Avatar = ({ user = {}, size = 'md', className = '', customSize = null }) => {
  // Enhanced size styles for better consistency
  const sizeStyles = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-28 h-28 text-xl', // Increased for better profile display
    xl: 'w-32 h-32 text-2xl',
  };
  
  // If customSize is provided, use it instead of the predefined sizes
  const sizeClasses = customSize || sizeStyles[size];

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username?.slice(0, 2).toUpperCase() || 'U';
  };

  const resolvedImageUrl = user?.imageUrl?.startsWith('http')
    ? user.imageUrl
    : user?.imageUrl
    ? `${API_BASE_URL}/${user.imageUrl}`
    : null;

  // Generate a unique gradient based on the user's initials
  const generateGradient = () => {
    const initials = getInitials();
    const colorCombinations = [
      'from-indigo-600 to-purple-600',
      'from-blue-600 to-indigo-600',
      'from-emerald-600 to-teal-600',
      'from-purple-600 to-pink-600',
      'from-amber-600 to-red-600',
      'from-fuchsia-600 to-pink-600'
    ];
    
    // Use the character codes of initials to select a gradient
    const charSum = [...initials].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const colorIndex = charSum % colorCombinations.length;
    
    return colorCombinations[colorIndex];
  };

  return (
    <div className={`${className} relative ${sizeClasses}`}>
      {resolvedImageUrl ? (
        <div className="w-full h-full overflow-hidden rounded-full">
          <img
            src={resolvedImageUrl}
            alt={`${user.firstName || user.username}'s profile`}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
      ) : (
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${generateGradient()} text-white flex items-center justify-center font-bold`}>
          {getInitials()}
        </div>
      )}
      
      {/* Add subtle shine effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/20 to-transparent opacity-50 pointer-events-none"></div>
    </div>
  );
};

export default Avatar;