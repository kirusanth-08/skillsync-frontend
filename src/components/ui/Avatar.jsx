import React from 'react';

const Avatar = ({ user = {}, size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-lg',
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    } else if (user.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return '?';
  };

  return (
    <div className={`${className} relative`}>
      {user.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt={`${user.firstName || user.username}'s profile`}
          className={`${sizeStyles[size]} rounded-full object-cover border-2 border-white shadow`}
        />
      ) : (
        <div className={`${sizeStyles[size]} rounded-full flex items-center justify-center bg-blue-600 text-white font-medium`}>
          {getInitials()}
        </div>
      )}
    </div>
  );
};

export default Avatar;
