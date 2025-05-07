import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Swal from 'sweetalert2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CoursesDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [weeklyAdded, setWeeklyAdded] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    fetchCourses();
    fetchWeeklyAdded();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/course');
      setCourses(response.data);
      setTotalCourses(response.data.length);
    } catch (error) {
      console.error('Error fetching courses:', error);
      Swal.fire('Error', 'Failed to fetch courses', 'error');
    }
  };

  const fetchWeeklyAdded = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/course/weekly-added');
      setWeeklyAdded(response.data); // Assumes backend returns an array like [2, 4, 1, 3, 0, 5, 6]
    } catch (error) {
      console.error('Error fetching weekly added data:', error);
      Swal.fire('Error', 'Failed to fetch weekly data', 'error');
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Courses Added',
        data: weeklyAdded,
        borderColor: '#6366F1',
        backgroundColor: '#6366F1',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: {
        display: true,
        text: 'Courses Added This Week',
      },
    },
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-indigo-700 to-purple-600 text-white px-4 py-6 flex flex-col justify-between shadow-md">
        <div>
          <div className="text-2xl font-bold mb-6 text-center">Skill-Sync</div>
          <nav className="space-y-2">
            <a href="http://localhost:5173/dash" className="block py-2 px-3 rounded hover:bg-indigo-500 transition">Dashboard</a>
            <a href="http://localhost:5173/course" className="block py-2 px-3 rounded hover:bg-indigo-500 transition">Courses</a>
            <a href="http://localhost:5173/" className="block py-2 px-3 rounded hover:bg-indigo-500 transition">Exam Dashboard</a>
            <a href="http://localhost:5173/dash" className="block py-2 px-3 rounded hover:bg-indigo-500 transition">Exam Profile</a>
           
          </nav>
        </div>
        <button className="w-full mt-6 px-4 py-2 bg-indigo-800 hover:bg-indigo-900 rounded">Logout</button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center justify-between px-6">
          <div className="font-semibold text-lg">Welcome, John!</div>
          <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">Profile</button>
        </header>

        <main className="p-6 space-y-6">
          {/* Total Courses */}
          <section className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded shadow p-6">
              <div className="text-sm text-gray-500">Total Courses Added</div>
              <div className="text-3xl font-bold">{totalCourses}</div>
            </div>
          </section>

          {/* Chart */}
          <section className="bg-white rounded shadow p-6">
            <Line data={chartData} options={chartOptions} />
          </section>

          {/* Courses List */}
          <section className="bg-white rounded shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Courses List</h2>
            {courses.length === 0 ? (
              <p className="text-gray-600">No courses available.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <div key={course.id} className="bg-gray-50 p-4 rounded shadow border transition hover:scale-105">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">{course.name}</h3>
                    <p className="text-gray-600">{course.description?.slice(0, 60)}...</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default CoursesDashboard;
