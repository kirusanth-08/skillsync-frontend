import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Users, Star } from 'lucide-react';
import axios from 'axios';

function CourseCard({ course, userEmail }) {
  const handleEnroll = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('skill-sync-user'));
      const email = user?.email || userEmail;
  
      if (!email) {
        alert('User email not found.');
        return;
      }
  
      const response = await axios.post('http://localhost:8080/api/enroll/enrolled', null, {
        params: {
          userEmail: email,
          courseId: course.id,
        },
      });
  
      alert(`Enrolled successfully in "${course.name}"`);
      console.log('Enrollment response:', response.data);
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Failed to enroll. Please try again.');
    }
  };
  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <img
        src="https://securitygladiators.com/wp-content/uploads/30.Online-Course-Image-5.jpg"
        alt={course.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.enrollments}</span>
          </div>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 mr-1 fill-current" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleEnroll}
              className="bg-blue-800 text-white px-2 py-1 cursor-pointer hover:bg-black rounded"
            >
              Enroll now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    duration: PropTypes.string,
    enrollments: PropTypes.number,
    rating: PropTypes.number,
  }).isRequired,
  userEmail: PropTypes.string.isRequired,
};


export default CourseCard;