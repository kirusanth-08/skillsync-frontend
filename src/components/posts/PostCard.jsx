import React from 'react';
import { UserCircle } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-200">
      <div className="relative w-full h-48 overflow-hidden">
      <img
  src={post.imageUrl?.startsWith('http') ? post.imageUrl : '/placeholder.jpg'}
  alt={post.title}
  className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
/>

      </div>

      <div className="p-4 flex flex-col justify-between h-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {post.description.length > 100
            ? `${post.description.substring(0, 100)}...`
            : post.description}
        </p>

        <div className="flex items-center justify-end text-sm text-gray-500 mt-auto">
          <UserCircle className="h-4 w-4 mr-1" />
          <span className="italic">{post.userId || 'Unknown'}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
