// components/SkillCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const SkillCard = ({ skill }) => {
  return (
    <div className="skill-card">
      <div className="skill-image">
        {skill.image ? (
          <img src={skill.image} alt={skill.title} />
        ) : (
          <div className="placeholder-image">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
        )}
      </div>
      <div className="skill-content">
        <h3 className="skill-title">{skill.title}</h3>
        <div className="skill-user">
          <img 
            src={skill.user.avatar || '/default-avatar.png'} 
            alt={skill.user.name} 
            className="user-avatar" 
          />
          <span>{skill.user.name}</span>
        </div>
        <div className="skill-meta">
          <span className="skill-category">{skill.category.name}</span>
          <div className="skill-rating">
            <i className="fas fa-star"></i>
            {skill.rating ? skill.rating.toFixed(1) : 'New'}
          </div>
        </div>
        <p className="skill-description">{skill.description.slice(0, 100)}...</p>
        <Link to={`/skill/${skill._id}`} className="btn btn-outline btn-sm">Learn More</Link>
      </div>
    </div>
  );
};

export default SkillCard;