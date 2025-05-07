import React from 'react';

const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`backdrop-blur-md bg-white/60 border border-white/30 rounded-xl shadow-lg p-6 ${className}`}>
      {title && <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;
