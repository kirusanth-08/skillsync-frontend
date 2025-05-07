import React, { useState, useEffect } from 'react';
import { TrendingUp as Trending, Star, Clock } from 'lucide-react';
import { getFeaturedCourses, getRecommendedCourses } from '../services/api';
import CourseCard from '../components/course/CourseCard';
import { useAuth } from '../hooks/useAuth';

function DashboardHomePage() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const                                                                                                                   loadCourses = async () => {
      try {
        const featured = await getFeaturedCourses();
        setFeaturedCourses(featured);

        if (user) {
          const recommended = await getRecommendedCourses(user.uid);
          setRecommendedCourses(recommended);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Courses */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <Trending className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Recommended Courses */}
      {user && recommendedCourses.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Star className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section>
        <div className="flex items-center mb-6">
          <Clock className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {user ? (
              <>
                <p className="text-gray-600">Continue where you left off...</p>
                {/* Add recent activity items here */}
              </>
            ) : (
              <p className="text-gray-600">Sign in to track your progress and get personalized recommendations!</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardHomePage;