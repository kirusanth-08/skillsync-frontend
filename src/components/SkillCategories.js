// components/SkillCategories.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SkillCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategories(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="loading">Loading categories...</div>;
  }

  return (
    <section className="categories-section">
      <h2>Browse by Category</h2>
      <div className="categories-grid">
        {categories.map(category => (
          <Link 
            to={`/explore?category=${category._id}`} 
            className="category-card" 
            key={category._id}
          >
            <div className="category-icon">
              <i className={`fas fa-${category.icon}`}></i>
            </div>
            <h3>{category.name}</h3>
            <p>{category.skillCount} skills available</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SkillCategories;
