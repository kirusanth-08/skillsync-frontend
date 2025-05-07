// src/ExamFormPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function ExamFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [formLink, setFormLink] = useState("");
  const [status, setStatus] = useState("Active");
  const [timeLimit, setTimeLimit] = useState("");
  const [saving, setSaving] = useState(false);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!id) return navigate("/");
    axios.get(`http://localhost:8080/api/exams/${id}`)
      .then(res => {
        const data = res.data;
        setExam(data);
        setFormLink(data.formLink || "");
        setStatus(data.status || "Active");
        setTimeLimit(data.timeLimit || "");
        const mins = parseInt(data.timeLimit, 10);
        if (!isNaN(mins) && mins > 0) setTimeLeft(mins * 60);
      })
      .catch(() => navigate("/"));
  }, [id, navigate]);

  useEffect(() => {
    if (timeLeft == null || expired) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, expired]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = { ...exam, formLink, status, timeLimit };
      await axios.put(`http://localhost:8080/api/exams/${id}`, updated);
      setExam(updated);
      const mins = parseInt(timeLimit, 10);
      if (!isNaN(mins) && mins > 0) {
        setExpired(false);
        setTimeLeft(mins * 60);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const fmtTime = sec => `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`;

  if (!exam) {
    return (
      <div className="min-h-screen grid place-items-center text-lg text-gray-600">
        Loading exam…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-lg">
      <AnimatePresence>
        <motion.div
          key="panel"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Edit Panel */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow-inner grid gap-6">
            <h2 className="text-2xl font-semibold text-indigo-700">Edit Exam Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-3">
                <label className="block mb-1 font-medium">Google Form URL</label>
                <input
                  type="url"
                  value={formLink}
                  onChange={e => setFormLink(e.target.value)}
                  placeholder="https://docs.google.com/forms/..."
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-300 transition"
                >
                  <option>Active</option>
                  <option>Hidden</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Time Limit (min)</label>
                <input
                  type="number"
                  min="0"
                  value={timeLimit}
                  onChange={e => setTimeLimit(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-300 transition"
                />
              </div>
            </div>
            <motion.button
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {saving ? "Saving…" : "Save Changes"}
            </motion.button>
          </div>

          {/* Header & Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 items-center gap-4"
          >
            <h1 className="text-3xl font-bold text-indigo-700">{exam.name}</h1>
            <div className="text-lg text-gray-700">
              {expired || status === "Hidden"
                ? <span className="text-red-600 font-semibold">Expired/Hidden</span>
                : timeLeft != null
                  ? <span>Time Left: <strong>{fmtTime(timeLeft)}</strong></span>
                  : <span>No timer set</span>
              }
            </div>
          </motion.div>

          {/* Form Embed or Placeholder */}
          <AnimatePresence>
            {status === "Active" && formLink ? (
              <motion.iframe
                key="iframe"
                src={formLink}
                title="Google Form"
                width="100%"
                height="700px"
                frameBorder="0"
                className="rounded-2xl shadow-lg border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div
                key="placeholder"
                className="p-12 border-2 border-dashed border-gray-300 rounded-2xl text-center text-gray-500 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {status === "Hidden"
                  ? "This exam is hidden."
                  : "Paste a form URL and save to display it here."}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back Button */}
          <motion.button
            onClick={() => navigate("/exam")}
            whileHover={{ x: -5 }}
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 shadow transition"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
