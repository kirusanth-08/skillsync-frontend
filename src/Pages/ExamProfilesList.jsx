import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function ExamProfilesList() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/exams")
      .then(res => setExams(res.data))
      .catch(err => console.error("Failed to load exams", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-100">
        <div className="animate-pulse text-gray-400 text-xl">Loading exams…</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        Exam Profiles
      </h1>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <motion.div
            key={exam.id}
            className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/exam-profiles/${exam.id}`)}
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                {exam.name}
              </h2>
              <p className="text-sm text-gray-500 mb-1">
                Level: <span className="font-medium">{exam.level}</span>
              </p>
              <p className="text-sm text-gray-500">
                Status:{" "}
                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full ${
                    exam.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {exam.status}
                </span>
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
