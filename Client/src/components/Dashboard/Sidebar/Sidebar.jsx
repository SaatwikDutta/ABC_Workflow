import React, { useState } from 'react'

function Sidebar() {
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

    return (
        <div className="w-64 shrink-0 bg-white border-r border-gray-100 shadow-sm px-4 py-6 flex flex-col gap-6 overflow-y-auto">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Master Data</p>

        {/* ── Levels ── */}
        <div>
            <p className="text-sm font-bold text-gray-600 mb-2">Levels</p>

            <p className="text-xs text-gray-400">add the functionality</p>

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
            <p className="text-xs text-gray-400">add the functionality</p>

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
    )
}

export default Sidebar