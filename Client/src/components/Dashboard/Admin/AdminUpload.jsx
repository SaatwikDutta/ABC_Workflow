import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

// Each section = one upload card
const UPLOAD_SECTIONS = [
  {
    key:      "travel",
    label:    "Travel Workflow",
    endpoint: "/workflow/travel/upload",
    color:    "from-blue-400 to-indigo-500",
    note:     "Columns: Report Type, Division, Workflow Type, Initiator, Approver 1-4",
  },
  {
    key:      "nontravel",
    label:    "Non-Travel Workflow",
    endpoint: "/workflow/nontravel/upload",
    color:    "from-teal-400 to-cyan-500",
    note:     "Columns: Report Type, Division, Workflow Type, Initiator, Approver 1-4",
  },
  {
    key:      "advance",
    label:    "Advance Workflow",
    endpoint: "/workflow/advance/upload",
    color:    "from-purple-400 to-violet-500",
    note:     "Columns: Advance Type, Initiator, Approver 1-4",
  },
];

const AdminUpload = () => {
  const navigate  = useNavigate();
  const token     = localStorage.getItem("token");
  const role      = localStorage.getItem("role");

  // If not admin, redirect away
  if (role !== "admin") {
    navigate("/");
    return null;
  }

  // Track file + status per section independently
  const [files,    setFiles]    = useState({});   // { travel: File, nontravel: File, ... }
  const [statuses, setStatuses] = useState({});   // { travel: "success" | "error" | "loading" | null }
  const [messages, setMessages] = useState({});   // { travel: "message string" }

  const handleFileChange = (key, file) => {
    setFiles(prev    => ({ ...prev,    [key]: file }));
    setStatuses(prev => ({ ...prev,    [key]: null }));
    setMessages(prev => ({ ...prev,    [key]: ""   }));
  };

  const handleUpload = async (section) => {
    const file = files[section.key];
    if (!file) {
      setStatuses(prev => ({ ...prev, [section.key]: "error"   }));
      setMessages(prev => ({ ...prev, [section.key]: "Please select a file first." }));
      return;
    }

    setStatuses(prev => ({ ...prev, [section.key]: "loading" }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API}${section.endpoint}`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Upload failed.");

      setStatuses(prev => ({ ...prev, [section.key]: "success" }));
      setMessages(prev => ({ ...prev, [section.key]: data.message || "Uploaded successfully." }));

    } catch (err) {
      setStatuses(prev => ({ ...prev, [section.key]: "error"   }));
      setMessages(prev => ({ ...prev, [section.key]: err.message }));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 px-5 py-6">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-xl text-gray-400 tracking-widest uppercase">Admin — Upload Master Data</h1>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-purple-500" />
        <p className="text-sm text-gray-400 mt-2">
          Uploading a new file will replace all existing data for that section.
        </p>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {UPLOAD_SECTIONS.map(section => {
          const status  = statuses[section.key];
          const message = messages[section.key];
          const file    = files[section.key];

          return (
            <div
              key={section.key}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex flex-col gap-4"
            >
              {/* Title */}
              <div className={`bg-gradient-to-br ${section.color} text-white rounded-xl p-4 text-center`}>
                <p className="font-bold text-lg">{section.label}</p>
              </div>

              {/* Note */}
              <p className="text-xs text-gray-400">{section.note}</p>

              {/* File input */}
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={e => handleFileChange(section.key, e.target.files[0])}
                className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100"
              />

              {/* Selected file name */}
              {file && (
                <p className="text-xs text-gray-500 truncate">📄 {file.name}</p>
              )}

              {/* Upload button */}
              <button
                onClick={() => handleUpload(section)}
                disabled={status === "loading"}
                className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-800 transition-all disabled:opacity-50"
              >
                {status === "loading" ? "Uploading..." : "Upload"}
              </button>

              {/* Status message */}
              {status === "success" && (
                <p className="text-sm text-green-600 font-medium">✅ {message}</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-500 font-medium">⚠ {message}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Back button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminUpload;