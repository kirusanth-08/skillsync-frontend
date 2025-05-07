// components/FeaturedSkills.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SkillCard from './SkillCard';

const FeaturedSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedSkills = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/skills/featured');
        setSkills(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured skills:', err);
        setLoading(false);
      }
    };
    fetchFeaturedSkills();
  }, []);

  if (loading) {
    return <div className="loading">Loading featured skills...</div>;
  }

  return (
    <section className="featured-skills">
      <div className="section-header">
        <h2>Featured Skills</h2>
        <Link to="/explore" className="view-all">View all skills</Link>
      </div>
      <div className="skills-grid">
        {skills.map(skill => (
          <SkillCard key={skill._id} skill={skill} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSkills;
