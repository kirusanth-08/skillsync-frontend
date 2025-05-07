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
import { getUserAnalytics, getKeyStatistics } from '../services/api.ts';


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
  const [courseCompletionData, setCourseCompletionData] = useState([]);
  const [enrollmentTrends, setEnrollmentTrends] = useState([]);
  const [insights, setInsights] = useState([]);
  const [keyStats, setKeyStats] = useState({
    usersCount: 0,
    examsCount: 0,
    coursesCount: 0
  });

  // Add a new effect to fetch key statistics
  useEffect(() => {
    const loadKeyStatistics = async () => {
      try {
        const stats = await getKeyStatistics();
        setKeyStats(stats);
      } catch (error) {
        console.error('Error fetching key statistics:', error);
      }
    };
    
    loadKeyStatistics();
  }, []);

  useEffect(() => {
    const loadEnrollmentData = async () => {
      try {
        // Replace multiple API calls with single new endpoint
        const response = await axios.get('http://localhost:8080/api/course/with-enrollments');
        console.log("API Response:", response); // Debug the full response
        
        // Safely get the data and ensure it's an array
        let coursesWithEnrollments = response.data;
        console.log("Response data:", coursesWithEnrollments); // Debug the data structure
        
        // Check if data is directly in response.data or nested further
        if (!Array.isArray(coursesWithEnrollments)) {
          // If data is an object with a property containing the array
          if (coursesWithEnrollments && typeof coursesWithEnrollments === 'object') {
            // Try common API response patterns
            const possibleArrayKeys = ['data', 'courses', 'items', 'results'];
            for (const key of possibleArrayKeys) {
              if (Array.isArray(coursesWithEnrollments[key])) {
                coursesWithEnrollments = coursesWithEnrollments[key];
                break;
              }
            }
          }
          
          // If still not an array, create an empty one to prevent errors
          if (!Array.isArray(coursesWithEnrollments)) {
            console.error("Expected array but got:", typeof coursesWithEnrollments);
            coursesWithEnrollments = [];
          }
        }
        
        // Process the data format (now safely using an array)
        const formatted = coursesWithEnrollments.map(course => {
          const enrollmentCount = course.enrollments?.length || 0;
          
          // For now, we don't have completion data in the new API format
          const completions = 0; // Placeholder - replace with actual data when available
          
          return {
            courseName: course.courseName || 'Unknown Course',
            enrolledStudents: enrollmentCount,
            completions: completions,
            completionRate: completions ? Math.round((completions / enrollmentCount) * 100) : 0,
            createdAt: course.createdAt
          };
        });
        
        setEnrollmentData(formatted);
        
        // Generate insights
        generateInsights(formatted);

        // Generate enrollment trends from actual data
        const enrollmentsByMonth = {};
        const completionsByMonth = {}; // If you have completion data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Process all enrollments from all courses
        coursesWithEnrollments.forEach(course => {
          course.enrollments?.forEach(enrollment => {
            if (enrollment.enrolledAt) {
              // Extract month from enrollment date
              const date = new Date(enrollment.enrolledAt);
              const monthName = months[date.getMonth()];
              const yearMonth = `${monthName} ${date.getFullYear()}`;
              
              // Increment enrollment count for this month
              enrollmentsByMonth[yearMonth] = (enrollmentsByMonth[yearMonth] || 0) + 1;
            }
          });
        });
        
        // Convert to array format needed for chart
        const realTrends = Object.keys(enrollmentsByMonth).map(month => ({
          month,
          enrollments: enrollmentsByMonth[month],
          completions: completionsByMonth[month] || 0 // Use actual completion data if available
        }));
        
        // Sort by date (assuming format "MMM YYYY")
        realTrends.sort((a, b) => {
          const [aMonth, aYear] = a.month.split(' ');
          const [bMonth, bYear] = b.month.split(' ');
          
          // Compare years first
          if (aYear !== bYear) return Number(aYear) - Number(bYear);
          
          // If same year, compare months
          return months.indexOf(aMonth) - months.indexOf(bMonth);
        });
        
        // Limit to last 6 months if there are many data points
        const recentTrends = realTrends.slice(-6);
        setEnrollmentTrends(recentTrends.length > 0 ? recentTrends : [
          // Fallback to empty month data if no enrollments found
          { month: 'No Data', enrollments: 0, completions: 0 }
        ]);
      } catch (error) {
        console.error('Error fetching enrollment data:', error);
      }
    };
    
    // Generate insights from the data
    const generateInsights = (data) => {
      const newInsights = [];
      
      // Most popular course
      if (data.length > 0) {
        const mostPopular = [...data].sort((a, b) => b.enrolledStudents - a.enrolledStudents)[0];
        newInsights.push({
          type: 'success',
          title: 'Most Popular Course',
          message: `"${mostPopular.courseName}" has the highest enrollment with ${mostPopular.enrolledStudents} students.`,
        });
      }
      
      // Low completion rates
      const lowCompletionCourses = data.filter(c => 
        c.enrolledStudents > 10 && c.completionRate < 30
      );
      if (lowCompletionCourses.length > 0) {
        newInsights.push({
          type: 'warning',
          title: 'Completion Rate Alert',
          message: `${lowCompletionCourses.length} courses have completion rates below 30%. Consider reviewing course content.`,
        });
      }
      
      // Course growth opportunities
      const lowEnrollmentCourses = data.filter(c => c.enrolledStudents < 5);
      if (lowEnrollmentCourses.length > 0) {
        newInsights.push({
          type: 'info',
          title: 'Growth Opportunity',
          message: `${lowEnrollmentCourses.length} courses have fewer than 5 enrollments. Consider marketing or bundling these courses.`,
        });
      }
      
      setInsights(newInsights);
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 auto-rows-auto gap-6">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:col-span-2 xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Registered Users</p>
              <p className="text-2xl font-bold text-blue-700">{keyStats.usersCount}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Total Courses</p>
              <p className="text-2xl font-bold text-green-700">{keyStats.coursesCount}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-600">Exams</p>
              <p className="text-2xl font-bold text-yellow-700">{keyStats.examsCount}</p>
            </div>
            {/* <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Skill Achievements</p>
              <p className="text-2xl font-bold text-red-700">{analytics?.achievements || 0}</p>
            </div> */}
          </div>
        </div>

        {/* Progress Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:col-span-2">
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
          <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        {/* Enhanced Course Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Course Performance Analysis</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={enrollmentData} 
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="courseName" />
              <YAxis yAxisId="left" orientation="left" stroke="#1D4ED8" />
              <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
              <RechartsTooltip 
                formatter={(value, name) => {
                  if (name === 'completionRate') return [`${value}%`, 'Completion Rate'];
                  return [value, name === 'enrolledStudents' ? 'Enrollments' : 'Completions'];
                }}
              />
              <RechartsLegend />
              <Bar yAxisId="left" dataKey="enrolledStudents" name="Enrollments" fill="#1D4ED8" />
              <Bar yAxisId="left" dataKey="completions" name="Completions" fill="#10B981" />
              <Bar yAxisId="right" dataKey="completionRate" name="completionRate" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment Trends Over Time */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:col-span-2 xl:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Enrollment & Completion Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={enrollmentTrends}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <RechartsLegend />
              <Bar dataKey="enrollments" name="New Enrollments" fill="#1D4ED8" />
              <Bar dataKey="completions" name="Completions" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actionable Insights */}
        <div className="bg-white rounded-lg shadow-md p-6 xl:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Data Insights</h2>
          <div className="space-y-4">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  insight.type === 'success' ? 'bg-green-50 border border-green-200' :
                  insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}>
                  <h3 className={`text-lg font-medium ${
                    insight.type === 'success' ? 'text-green-700' :
                    insight.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>{insight.title}</h3>
                  <p className="text-sm mt-1">{insight.message}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No insights available. Add more data to generate insights.</p>
            )}
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