// src/ExamManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

export default function ExamManager() {
  const [exams, setExams] = useState([]);
  const [exam, setExam] = useState({
    name: "",
    level: "Intro",
    dueDate: "",
    status: "Active",
    avgTime: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/exams");
      setExams(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load exams", "error");
    }
  };

  // — PDF generation for exams —
  const generateExamsPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Exam Report", 14, 22);
    doc.setFontSize(12);

    autoTable(doc, {
      startY: 30,
      head: [["ID", "Name", "Level", "Due Date", "Status", "Avg Time"]],
      body: exams.map(e => [
        e.id,
        e.name,
        e.level,
        e.dueDate,
        e.status,
        e.avgTime || ""
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [79, 70, 229], textColor: 255 }
    });

    doc.save("exams_report.pdf");
    Swal.fire("Success", "Exam report generated!", "success");
  };

  const handleChange = e =>
    setExam({ ...exam, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/exams/${editingId}`, exam);
        Swal.fire("Success", "Exam updated successfully!", "success");
      } else {
        await axios.post("http://localhost:8080/api/exams", exam);
        Swal.fire("Success", "Exam added successfully!", "success");
      }
      resetForm();
      fetchExams();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Operation failed", "error");
    }
  };

  const handleDelete = async id => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the exam.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/exams/${id}`);
        fetchExams();
        Swal.fire("Deleted!", "Exam has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete exam", "error");
      }
    }
  };

  const handleUpdate = ex => {
    setExam(ex);
    setEditingId(ex.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setExam({
      name: "",
      level: "Intro",
      dueDate: "",
      status: "Active",
      avgTime: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filtered = exams.filter(ex =>
    `${ex.name} ${ex.level} ${ex.status}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white flex flex-col justify-between p-6 shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Skill‑Sync</h1>
        <nav className="space-y-2">
          <NavLink to="/dash" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Dashboard</NavLink>
          <NavLink to="/course" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Courses</NavLink>
          <NavLink to="/exam" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Exam Dashboard</NavLink>
          <NavLink to="/exam-profiles" className="block py-2 px-3 rounded hover:bg-blue-500 transition">Exam Profiles</NavLink>
        </nav>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full mt-6 px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded">
          Logout
        </motion.button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto">
          {/* Header + Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 items-center">
            <motion.h1 className="text-4xl font-bold text-indigo-700" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              Exam Dashboard
            </motion.h1>

            {/* Search */}
            <div className="relative md:col-span-1">
              <input type="text" placeholder="Search exams..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition" />
              <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">🔍</span>
            </div>

            {/* Add/Cancel */}
            <motion.button onClick={() => { setShowForm(v => !v); if (showForm) resetForm(); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="justify-self-end bg-indigo-600 text-white px-6 py-3 rounded-xl shadow hover:bg-indigo-700 transition">
              {showForm ? "Cancel" : "Add Exam"}
            </motion.button>

            {/* Export PDF */}
            <motion.button onClick={generateExamsPdf} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="justify-self-end bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700 transition">
              Export Exam Report
            </motion.button>
          </div>

          {/* Add/Edit Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div key="form" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 100, damping: 20 }} className="bg-white p-6 mb-8 rounded-2xl shadow">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">{editingId ? "Update Exam" : "Add New Exam"}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" placeholder="Exam Name" value={exam.name} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 transition" />
                  <select name="level" value={exam.level} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 transition">
                    <option>Intro</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <input name="dueDate" type="date" value={exam.dueDate} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 transition" />
                  <select name="status" value={exam.status} onChange={handleChange} className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 transition">
                    <option>Active</option>
                    <option>Hidden</option>
                  </select>
                  <input name="avgTime" placeholder="Avg Time (e.g. 5h)" value={exam.avgTime} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-200 transition" />
                  <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-xl shadow hover:bg-indigo-700 transition">
                    {editingId ? "Save Changes" : "Create Exam"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Exam List */}
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name","Level","Due Date","Status","Avg Time","Actions"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.length > 0 ? (
                    filtered.map(ex => (
                      <motion.tr key={ex.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }} className="cursor-pointer" onClick={() => navigate(`/form/${ex.id}`)}>
                        <td className="px-6 py-4 whitespace-nowrap">{ex.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{ex.level}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{ex.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ex.status==="Active"?"bg-green-100 text-green-800":"bg-gray-200 text-gray-600"}`}>{ex.status}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap">{ex.avgTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-3">
                          <motion.button onClick={e => { e.stopPropagation(); handleUpdate(ex); }} whileTap={{ scale: 0.9 }} className="text-indigo-600 hover:text-indigo-900">Edit</motion.button>
                          <motion.button onClick={e => { e.stopPropagation(); handleDelete(ex.id); }} whileTap={{ scale: 0.9 }} className="text-red-600 hover:text-red-900">Delete</motion.button>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">No exams found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
