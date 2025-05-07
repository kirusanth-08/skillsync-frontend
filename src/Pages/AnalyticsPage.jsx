import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useAuth } from '../hooks/useAuth';
import { getUserAnalytics } from '../services/api';


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend as RechartsLegend,
} from 'recharts';
import axios from 'axios';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [enrollmentData, setEnrollmentData] = useState([]);

  useEffect(() => {
    const loadEnrollmentData = async () => {
      try {
        const [enrollRes, courseRes] = await Promise.all([
          axios.get('http://localhost:8080/api/enroll/enrollments'),
          axios.get('http://localhost:8080/api/course') // adjust if your endpoint is different
        ]);
    
        const enrollments = enrollRes.data;
        const courses = courseRes.data;
    
        // Build a courseId -> courseName map
        const courseIdToName = {};
        courses.forEach(course => {
          courseIdToName[course._id] = course.title; // or course.name based on your schema
        });
    
        // Count enrollments per courseId
        const courseMap = {};
        enrollments.forEach(({ courseId }) => {
          const courseName = courseIdToName[courseId] || courseId;
          courseMap[courseName] = (courseMap[courseName] || 0) + 1;
        });
    
        // Format data
        const formatted = Object.entries(courseMap).map(([courseName, count]) => ({
          courseName,
          enrolledStudents: count,
        }));
    
        setEnrollmentData(formatted);
      } catch (error) {
        console.error('Error fetching enrollment or course data:', error);
      }
    };
    
  
    loadEnrollmentData();
  }, []);
  

  useEffect(() => {
    const loadAnalytics = async () => {
      if (user) {
        try {
          const data = await getUserAnalytics(user.uid);
          setAnalytics(data);
        } catch (error) {
          console.error('Error loading analytics:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadAnalytics();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to view your analytics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const progressData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Course Progress',
        data: analytics?.progressData || [10, 15, 40, 25, 55, 85],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
    ],
  };

  const categoryData = {
    labels: analytics?.categories.map(c => c.name) || [],
    datasets: [
      {
        data: analytics?.categories.map(c => c.count) || [],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Learning Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* User Info */}
  
                <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">registered users</p>
              <p className="text-2xl font-bold text-blue-700">{analytics?.completedCourses || 0}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">total courses</p>
              <p className="text-2xl font-bold text-green-700">{analytics?.streak || 0} days</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600">Exams</p>
              <p className="text-2xl font-bold text-yellow-700">{analytics?.hoursLearned || 0}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Skill Achievements</p>
              <p className="text-2xl font-bold text-red-700">{analytics?.achievements || 0}</p>
            </div>
          </div>
        </div>

        {/* Progress Over Time */}
<div className="bg-white rounded-lg shadow-md p-6">
  <h2 className="text-xl font-semibold mb-4">Enrollments Per Course</h2>
  <ResponsiveContainer width="100%" height={400}>
  <BarChart data={enrollmentData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="courseName" />
    <YAxis />
    <RechartsTooltip />
    <RechartsLegend />
    <Bar dataKey="enrolledStudents" fill="#1D4ED8" />
  </BarChart>
</ResponsiveContainer>

</div>


       

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Categories</h2>
          <Doughnut data={categoryData} options={{ responsive: true }} />
        </div>

        {/* Key Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Completed Courses</p>
              <p className="text-2xl font-bold text-blue-700">{analytics?.completedCourses || 0}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Active Streak</p>
              <p className="text-2xl font-bold text-green-700">{analytics?.streak || 0} days</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600">Hours Learned</p>
              <p className="text-2xl font-bold text-yellow-700">{analytics?.hoursLearned || 0}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Achievements</p>
              <p className="text-2xl font-bold text-red-700">{analytics?.achievements || 0}</p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Recommendations</h2>
          <ul className="space-y-4">
            {analytics?.recommendations?.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{rec.title}</p>
                  <p className="text-sm text-gray-500">{rec.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;