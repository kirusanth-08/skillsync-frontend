import React from "react";
import axios from "axios";
import { jsPDF } from "jspdf";           // note the named import
import autoTable from "jspdf-autotable";
import { motion } from "framer-motion";

export default function Reports() {
  const generateCoursesPdf = async () => {
    try {
      const { data: courses } = await axios.get("http://localhost:8080/api/course");
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Courses Report", 14, 22);
      doc.setFontSize(12);

      // use the helper instead of doc.autoTable
      autoTable(doc, {
        startY: 30,
        head: [["ID", "Name", "Description"]],
        body: courses.map(c => [c.id, c.name, c.description]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [63, 81, 181], textColor: 255 },
      });

      doc.save("courses_report.pdf");
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const generateExamsPdf = async () => {
    try {
      const { data: exams } = await axios.get("http://localhost:8080/api/exams");
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Exams Report", 14, 22);
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
        headStyles: { fillColor: [63, 81, 181], textColor: 255 },
      });

      doc.save("exams_report.pdf");
    } catch (err) {
      console.error("Failed to fetch exams", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Reports</h1>

      <div className="space-y-4">
        <motion.button
          onClick={generateCoursesPdf}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-green-600 text-white py-3 rounded-lg shadow hover:bg-green-700 transition"
        >
          Generate Courses PDF
        </motion.button>

        <motion.button
          onClick={generateExamsPdf}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Generate Exams PDF
        </motion.button>
      </div>
    </div>
  );
}
