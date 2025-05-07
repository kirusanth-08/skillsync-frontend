// src/CourseManagementDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';

const CourseManagementDashboard = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [courses, setCourses] = useState([]);

  const [editCourseId, setEditCourseId] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const editNameRef = useRef(null);

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (showEditModal && editNameRef.current) {
      editNameRef.current.focus();
    }
  }, [showEditModal]);

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/course');
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/course', { name, description });
      Swal.fire('Success', 'Course added successfully!', 'success');
      setName('');
      setDescription('');
      fetchAllCourses();
    } catch (error) {
      Swal.fire('Error', 'Failed to add course.', 'error');
    }
  };

  const handleViewCourse = (course) => {
    Swal.fire({
      title: course.name,
      text: course.description,
      icon: 'info',
      confirmButtonText: 'Close',
    });
  };

  const handleDeleteCourse = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/course/${id}`);
        Swal.fire('Deleted!', 'Course has been deleted.', 'success');
        fetchAllCourses();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete course.', 'error');
      }
    }
  };

  const handleEditCourse = (course) => {
    setEditCourseId(course.id);
    setEditName(course.name);
    setEditDescription(course.description);
    setShowEditModal(true);
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/course/${editCourseId}`, {
        name: editName,
        description: editDescription,
      });
      Swal.fire('Success', 'Course updated successfully!', 'success');
      setShowEditModal(false);
      fetchAllCourses();
    } catch (error) {
      Swal.fire('Error', 'Failed to update course.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white px-4 py-6 flex flex-col justify-between shadow-md">
        <div>
          <div className="text-2xl font-bold mb-6 text-center">Skill-Sync</div>
          <nav className="space-y-2">
            <a href="http://localhost:5173/dash" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Dashboard</a>
            <a href="http://localhost:5173/course" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Courses</a>
            <a href="http://localhost:5173/exam" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Exam Dashboard</a>
            <a href="http://localhost:5173/course" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Exam Profile</a>
          </nav>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full mt-6 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded"
        >
          Logout
        </motion.button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white shadow flex items-center px-6 justify-between">
          <div className="font-semibold text-gray-700 text-lg">Welcome, John!</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Profile
          </motion.button>
        </header>

        <main className="p-6 space-y-6">
          {/* Add New Course */}
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Course Title"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course Description"
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Course
              </motion.button>
            </form>
          </div>

          {/* Updated Search Bar with Icon */}
          <div className="relative mb-4 flex justify-end">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                {/* Search icon */}
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  border border-gray-300 rounded-lg 
                  pl-10 pr-4 py-2 w-64 
                  focus:outline-none focus:ring-2 focus:ring-indigo-300 
                  transition
                "
              />
            </div>
          </div>

          {/* Course List */}
          <div className="bg-white p-6 rounded shadow">
            {courses.length === 0 ? (
              <p className="text-gray-600">No courses available.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses
                  .filter(course =>
                    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    course.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="bg-gray-50 p-4 rounded shadow border"
                    >
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">{course.name}</h3>
                      <p className="text-gray-600 mb-4">{course.description.slice(0, 60)}...</p>
                      <div className="space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewCourse(course)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          View
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditCourse(course)}
                          className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded"
                        >
                          Update
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteCourse(course.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Slide-in Edit Modal */}
      {showEditModal && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded shadow-lg w-11/12 max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4">Update Course</h2>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <input
                ref={editNameRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
              <div className="space-x-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Update
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default CourseManagementDashboard;
