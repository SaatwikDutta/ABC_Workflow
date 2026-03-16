import React, { useState, useEffect } from "react";
import { DivisionTile } from "./Division/DivisionPage";

const API = "http://127.0.0.1:8000";

const divisions = [
  { id: 2,  division_name: "ABD" },
  { id: 10, division_name: "Corporate" },
  { id: 11, division_name: "CPO" },
  { id: 9,  division_name: "ESPB" },
  { id: 1,  division_name: "FBD" },
  { id: 4,  division_name: "ITD" },
  { id: 12, division_name: "LSTC" },
  { id: 5,  division_name: "MAB" },
  { id: 6,  division_name: "PCPB" },
  { id: 3,  division_name: "PPB" },
  { id: 7,  division_name: "PSPD" },
  { id: 8,  division_name: "TM&D" }
];

// ── Why a separate MasterPanel component? ────────────────────────────────────
// We keep it separate so Dashboard stays clean.
// MasterPanel owns its own state (levels, grades, which row is being edited).
// Dashboard just decides whether to show it based on role.
// ─────────────────────────────────────────────────────────────────────────────

const MasterPanel = () => {
  const token = localStorage.getItem("token");

  // levels and grades fetched from DB on mount
  const [levels, setLevels] = useState([]);
  const [grades, setGrades] = useState([]);

  // editingLevel / editingGrade tracks which row is currently being edited.
  // We store the full object { id, level_name } so we can show the current name
  // in the input and send the id to the PATCH endpoint.
  const [editingLevel, setEditingLevel] = useState(null);
  const [editingGrade, setEditingGrade] = useState(null);

  // newLevelName / newGradeName is what the admin types in the edit input
  const [newLevelName, setNewLevelName] = useState("");
  const [newGradeName, setNewGradeName] = useState("");

  // status messages per section
  const [levelMsg, setLevelMsg] = useState(null);
  const [gradeMsg, setGradeMsg] = useState(null);


  // ── Fetch levels and grades on mount ───────────────────────────────────────
  // We call GET /entitlement/levels and GET /entitlement/grades.
  // These endpoints already exist in entitlement.py.
  // useEffect with [] runs once when the component first appears on screen.
  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };

    fetch(`${API}/entitlement/levels`, { headers })
      .then(r => r.json())
      .then(data => setLevels(Array.isArray(data) ? data : []))
      .catch(() => {});

    fetch(`${API}/entitlement/grades`, { headers })
      .then(r => r.json())
      .then(data => setGrades(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);  // [] means "run once on mount, not on every render"


  return (
    <div className="w-64 shrink-0 bg-white border-r border-gray-100 shadow-sm px-4 py-6 flex flex-col gap-6 overflow-y-auto">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Master Data</p>

      {/* ── Levels ── */}
      <div>
        <p className="text-sm font-bold text-gray-600 mb-2">Levels</p>

        {levels.length === 0 && (
          <p className="text-xs text-gray-400">add the functionality bro</p>
        )}

        {levels.map(lvl => (
          <div key={lvl.id} className="mb-2">
            {editingLevel?.id === lvl.id ? (
              // ── Edit mode: show input + save/cancel buttons ──
              // editingLevel.id === lvl.id means THIS row is being edited
              <div className="flex gap-1">
                <input
                  value={newLevelName}
                  onChange={e => setNewLevelName(e.target.value)}
                  className="flex-1 text-xs p-1 border border-purple-300 rounded focus:outline-none"
                  autoFocus
                />
                <button onClick={saveLevel} className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-800">✓</button>
                <button onClick={() => { setEditingLevel(null); setNewLevelName(""); }} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">✕</button>
              </div>
            ) : (
              // ── View mode: show name + edit button ──
              <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50">
                <span className="text-sm text-gray-700">{lvl.level_name}</span>
                <button
                  onClick={() => { setEditingLevel(lvl); setNewLevelName(lvl.level_name); setLevelMsg(null); }}
                  className="text-xs text-purple-500 hover:text-purple-700"
                >✏</button>
              </div>
            )}
          </div>
        ))}

        {levelMsg && (
          <p className={`text-xs mt-1 ${levelMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {levelMsg.text}
          </p>
        )}
      </div>

      {/* ── Grades ── */}
      <div>
        <p className="text-sm font-bold text-gray-600 mb-2">Grades</p>

        {grades.length === 0 && (
          <p className="text-xs text-gray-400">add the functionality bro</p>
        )}

        {grades.map(grd => (
          <div key={grd.id} className="mb-2">
            {editingGrade?.id === grd.id ? (
              <div className="flex gap-1">
                <input
                  value={newGradeName}
                  onChange={e => setNewGradeName(e.target.value)}
                  className="flex-1 text-xs p-1 border border-purple-300 rounded focus:outline-none"
                  autoFocus
                />
                <button onClick={saveGrade} className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-800">✓</button>
                <button onClick={() => { setEditingGrade(null); setNewGradeName(""); }} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">✕</button>
              </div>
            ) : (
              <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50">
                <span className="text-sm text-gray-700">{grd.grade_name}</span>
                <button
                  onClick={() => { setEditingGrade(grd); setNewGradeName(grd.grade_name); setGradeMsg(null); }}
                  className="text-xs text-purple-500 hover:text-purple-700"
                >✏</button>
              </div>
            )}
          </div>
        ))}

        {gradeMsg && (
          <p className={`text-xs mt-1 ${gradeMsg.type === "success" ? "text-green-600" : "text-red-500"}`}>
            {gradeMsg.text}
          </p>
        )}
      </div>
    </div>
  );
};


// ── Dashboard ─────────────────────────────────────────────────────────────────
// role is read from localStorage — set during login.
// If role === "admin", we show the MasterPanel sidebar on the left.
// If role === "user", they just see the division grid.
const Dashboard = () => {
  const role = localStorage.getItem("role");

  return (
    <div className="w-full min-h-screen bg-gray-50 flex">

      {/* Left sidebar — admin only */}
      {role === "admin" && <MasterPanel />}

      {/* Main content — division grid */}
      <div className="flex-1 px-5 py-6">
        <div className="text-center mb-12">
          <h1 className="text-xl text-gray-400 mt-1 tracking-widest uppercase">All Divisions</h1>
          <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-indigo-500" />
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 max-w-5xl mx-auto">
          {divisions.map((division, index) => (
            <DivisionTile
              key={division.id}
              divisionName={division.division_name}
              index={index}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;