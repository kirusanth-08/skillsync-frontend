import React from 'react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { UserCog } from 'lucide-react';

const ProfileHeader = ({ user, onEditProfile }) => {
  // Add a guard clause to check if user exists
  if (!user) {
    return <div>Loading user profile...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="mb-4 md:mb-0 md:mr-6">
            <Avatar 
              src={user.profileImageUrl} 
              alt={`${user.firstName} ${user.lastName}`} 
              size="lg"
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-600">
              @{user.username}
            </p>
            
            {user.bio && (
              <div className="mt-2 text-gray-700">
                {user.bio}
              </div>
            )}
            
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              {user.skills?.slice(0, 4).map(skill => (
                <span 
                  key={skill.id} 
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {skill.name}
                </span>
              ))}
              
              {(user.skills?.length || 0) > 4 && (
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                  +{(user.skills?.length || 0) - 4} more
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              variant="secondary" 
              onClick={onEditProfile}
              className="flex items-center gap-2"
            >
              <UserCog size={16} />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 text-sm text-gray-600 rounded-b-lg">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="block font-medium">Joined</span>
            <span>{new Date(user.joinedDate || Date.now()).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="block font-medium">Skills</span>
            <span>{user.skills?.length || 0}</span>
          </div>
          <div>
            <span className="block font-medium">Email</span>
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;