import React from 'react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { Calendar, Award, Mail, ChevronRight, UserCog } from 'lucide-react';

const ProfileHeader = ({ user, onEditProfile }) => {
  if (!user) {
    return (
      <div className="p-6 text-center">
        <div className="animate-pulse h-8 w-40 bg-gray-200 rounded mx-auto mb-4"></div>
        <div className="animate-pulse h-32 w-32 bg-gray-200 rounded-full mx-auto"></div>
      </div>
    );
  }
  
  const formattedJoinDate = user.joinedDate 
    ? new Date(user.joinedDate).toLocaleDateString()
    : new Date().toLocaleDateString();

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6">
      {/* Top gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 opacity-90"></div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]" style={{ backgroundSize: '20px 20px' }}></div>
      
      {/* Content container with glass effect */}
      <div className="relative z-10">
        {/* Top section with avatar and name */}
        <div className="pt-12 pb-20 px-6 md:px-10 text-white">
          <div className="flex flex-col md:flex-row items-center">
            {/* Avatar with ring */}
            <div className="mb-6 md:mb-0 md:mr-8">
              <div className="relative">
                <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-white/30 to-white/10 backdrop-blur p-1.5 flex items-center justify-center">
                  <Avatar user={user} size="lg" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
              </div>
            </div>
            
            {/* User details */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-lg text-white/80 font-light">@{user.username}</p>
              
              {user.bio && (
                <div className="mt-3 text-white/90 max-w-xl">{user.bio}</div>
              )}
              
              {/* Featured skills pills */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                {user.skills?.slice(0, 4).map(skill => (
                  <span
                    key={skill.id}
                    className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
                
                {(user.skills?.length || 0) > 4 && (
                  <span className="bg-white/10 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    +{(user.skills?.length || 0) - 4} more
                    <ChevronRight size={14} />
                  </span>
                )}
              </div>
            </div>
            
            {/* Edit button */}
            <div className="mt-6 md:mt-0">
              <Button
                variant="secondary"
                onClick={onEditProfile}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
              >
                <UserCog size={16} />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom stats section with glass effect */}
        <div className="bg-white/10 backdrop-blur-md border-t border-white/20 py-6 px-8 text-white">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Calendar size={18} className="text-white" />
              </div>
              <div>
                <span className="block text-white/70 text-sm">Joined</span>
                <span className="font-medium">{formattedJoinDate}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Award size={18} className="text-white" />
              </div>
              <div>
                <span className="block text-white/70 text-sm">Skills</span>
                <span className="font-medium">{user.skills?.length || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                <Mail size={18} className="text-white" />
              </div>
              <div>
                <span className="block text-white/70 text-sm">Email</span>
                <span className="font-medium text-sm">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;