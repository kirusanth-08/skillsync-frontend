import React, { useState, useEffect } from 'react';
import { TrendingUp as Trending, Star, Clock, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedCourses, getRecommendedCourses } from '../services/api';
import { getAllPosts } from '../services/PostService'; // ✅ Correct import
import CourseCard from '../components/course/CourseCard';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/posts/PostCard';

function DashboardHomePage() {
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [firestorePosts, setFirestorePosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const posts = await getAllPosts();
        setFirestorePosts(posts);
        // console.log('Fetched Firestore posts:', posts); // ✅ Debug check

        const featured = await getFeaturedCourses();
        setFeaturedCourses(featured);

        if (user) {
          const recommended = await getRecommendedCourses(user.uid);
          setRecommendedCourses(recommended);
        }

      } catch (error) {
        console.error('Error loading Dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
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

      {/* Community Posts from Firestore */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🔥</span> Community Highlights
          </h2>
          <Link 
            to="/create-post" 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            <PlusCircle size={18} />
            <span>Create Post</span>
          </Link>
        </div>
        {firestorePosts.length === 0 ? (
          <p className="text-gray-600">No posts available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {firestorePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center mb-6">
          <Clock className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            {user ? (
              <p className="text-gray-600">Continue where you left off...</p>
            ) : (
              <p className="text-gray-600">
                Sign in to track your progress and get personalized recommendations!
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardHomePage;
