// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// const API = "http://127.0.0.1:8000";

// // ── Edit Modal (admin only) ───────────────────────────────────────────────────
// const EditModal = ({ entitlement, onClose, onSaved }) => {
//   const token = localStorage.getItem("token");
//   const [amount,  setAmount]  = useState(entitlement.amount);
//   const [status,  setStatus]  = useState(null);
//   const [message, setMessage] = useState("");

//   const handleSave = async () => {
//     setStatus("loading");
//     try {
//       const res  = await fetch(`${API}/entitlement/sampling/${entitlement.id}`, {
//         method:  "PATCH",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body:    JSON.stringify({ amount }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || "Update failed.");
//       setStatus("success");
//       setMessage(data.message);
//       onSaved(amount);
//     } catch (err) {
//       setStatus("error");
//       setMessage(err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4" onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative" onClick={e => e.stopPropagation()}>
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
//         <h2 className="text-lg font-bold text-gray-700 mb-5">Edit Sampling Amount</h2>
//         <label className="block text-sm font-semibold text-gray-600 mb-1">Amount (₹)</label>
//         <input
//           type="text"
//           value={amount}
//           onChange={e => setAmount(e.target.value)}
//           className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
//         />
//         <Button onClick={handleSave} disabled={status === "loading"} className="w-full">
//           {status === "loading" ? "Saving..." : "Save"}
//         </Button>
//         {status === "success" && <p className="text-sm text-green-600 mt-3">✅ {message}</p>}
//         {status === "error"   && <p className="text-sm text-red-500  mt-3">⚠ {message}</p>}
//       </div>
//     </div>
//   );
// };


// // ── Upload Modal (admin only) ─────────────────────────────────────────────────
// const UploadModal = ({ division, onClose }) => {
//   const token = localStorage.getItem("token");
//   const [file,    setFile]    = useState(null);
//   const [status,  setStatus]  = useState(null);
//   const [message, setMessage] = useState("");

//   const handleUpload = async () => {
//     if (!file) { setStatus("error"); setMessage("Please select a file first."); return; }
//     setStatus("loading");
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       const res  = await fetch(`${API}/entitlement/sampling/upload?division=${encodeURIComponent(division)}`, {
//         method:  "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body:    formData,
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.detail || "Upload failed.");
//       setStatus("success");
//       setMessage(data.message || "Uploaded successfully.");
//     } catch (err) {
//       setStatus("error");
//       setMessage(err.message);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4" onClick={onClose}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
//         <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
//         <h2 className="text-lg font-bold text-gray-700 mb-1">Upload Sampling Data</h2>
//         <p className="text-xs text-gray-400 mb-1">Division: <span className="font-semibold text-gray-600">{division}</span></p>
//         <p className="text-xs text-gray-400 mb-1">Columns: Level | Grade | Amount</p>
//         <p className="text-xs text-red-400 mb-5">⚠ Replaces all existing data for {division}.</p>
//         <input
//           type="file" accept=".xlsx,.xls"
//           onChange={e => { setFile(e.target.files[0]); setStatus(null); }}
//           className="text-sm text-gray-600 mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100"
//         />
//         {file && <p className="text-xs text-gray-500 mb-4 truncate">📄 {file.name}</p>}
//         <Button onClick={handleUpload} disabled={status === "loading"} className="w-full">
//           {status === "loading" ? "Uploading..." : "Upload"}
//         </Button>
//         {status === "success" && <p className="text-sm text-green-600 mt-3">✅ {message}</p>}
//         {status === "error"   && <p className="text-sm text-red-500  mt-3">⚠ {message}</p>}
//       </div>
//     </div>
//   );
// };


// // ── Sampling Page ─────────────────────────────────────────────────────────────
// export default function Sampling() {
//   const { divisionName } = useParams();
//   const navigate         = useNavigate();
//   const role             = localStorage.getItem("role");
//   const token            = localStorage.getItem("token");

//   const [levels,        setLevels]        = useState([]);
//   const [grades,        setGrades]        = useState([]);
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const [loadingLevels, setLoadingLevels] = useState(true);
//   const [loadingGrades, setLoadingGrades] = useState(false);
//   const [levelsError,   setLevelsError]   = useState(null);

//   const [result,      setResult]      = useState(null);
//   const [submitting,  setSubmitting]  = useState(false);
//   const [submitError, setSubmitError] = useState(null);

//   const [showUpload, setShowUpload] = useState(false);
//   const [showEdit,   setShowEdit]   = useState(false);

//   // Fetch levels for this division on mount
//   useEffect(() => {
//     setLoadingLevels(true);
//     fetch(`${API}/entitlement/sampling/levels?division=${encodeURIComponent(divisionName)}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => { if (!res.ok) throw new Error("No entitlement data for this division."); return res.json(); })
//       .then(data => { setLevels(data); setLoadingLevels(false); })
//       .catch(err => { setLevelsError(err.message); setLoadingLevels(false); });
//   }, [divisionName]);

//   // Fetch grades when level changes
//   useEffect(() => {
//     if (!selectedLevel) return;
//     setGrades([]);
//     setSelectedGrade("");
//     setLoadingGrades(true);
//     fetch(
//       `${API}/entitlement/sampling/grades?division=${encodeURIComponent(divisionName)}&level=${encodeURIComponent(selectedLevel)}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     )
//       .then(res => { if (!res.ok) throw new Error("No grades found."); return res.json(); })
//       .then(data => { setGrades(data); setLoadingGrades(false); })
//       .catch(() => setLoadingGrades(false));
//   }, [selectedLevel]);

//   const handleSubmit = () => {
//     if (!selectedLevel || !selectedGrade) return;
//     setSubmitting(true);
//     setSubmitError(null);
//     setResult(null);
//     fetch(
//       `${API}/entitlement/sampling?division=${encodeURIComponent(divisionName)}&level=${encodeURIComponent(selectedLevel)}&grade=${encodeURIComponent(selectedGrade)}`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     )
//       .then(res => { if (!res.ok) throw new Error("No entitlement found for this combination."); return res.json(); })
//       .then(data => { 
//             console.log("Result:", data);  // ← add this
//             setResult(data); 
//             setSubmitting(false); 
//         })
//       .catch(err => { setSubmitError(err.message); setSubmitting(false); });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white p-10">
//       <h1 className="text-4xl font-bold text-center mb-2 text-purple-700 drop-shadow-md">
//         Sampling Entitlement
//       </h1>
//       <p className="text-center text-gray-500 mb-10">{divisionName}</p>

//       <div className="max-w-xl mx-auto space-y-6">

//         <Card className="shadow-lg rounded-2xl border border-purple-200">
//           <CardContent className="p-6 space-y-5">

//             {/* Level */}
//             <div>
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Select Level</label>
//               {loadingLevels && <p className="text-sm text-gray-400">Loading...</p>}
//               {levelsError   && <p className="text-sm text-red-500">⚠ {levelsError}</p>}
//               {!loadingLevels && !levelsError && (
//                 <select
//                   value={selectedLevel}
//                   onChange={e => { setSelectedLevel(e.target.value); setResult(null); setSubmitError(null); }}
//                   className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
//                 >
//                   <option value="">--Select--</option>
//                   {levels.map(l => <option key={l} value={l}>{l}</option>)}
//                 </select>
//               )}
//             </div>

//             {/* Grade — shown after level selected */}
//             {selectedLevel && (
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">Select Grade</label>
//                 {loadingGrades && <p className="text-sm text-gray-400">Loading...</p>}
//                 {!loadingGrades && (
//                   <select
//                     value={selectedGrade}
//                     onChange={e => { setSelectedGrade(e.target.value); setResult(null); setSubmitError(null); }}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
//                   >
//                     <option value="">--Select--</option>
//                     {grades.map(g => <option key={g} value={g}>{g}</option>)}
//                   </select>
//                 )}
//               </div>
//             )}

//             {/* Buttons */}
//             <div className="flex justify-between items-center pt-2">
//               <Button variant="outline" onClick={() => navigate(`/${divisionName}/entitlement`)}>
//                 ← Back
//               </Button>

//               {role === "admin" && (
//                 <Button variant="secondary" onClick={() => setShowUpload(true)}>
//                   {/* ⬆ Upload Data */}
//                   Upload Data
//                 </Button>
//               )}

//               <Button
//                 onClick={handleSubmit}
//                 disabled={submitting || !selectedLevel || !selectedGrade}
//               >
//                 {submitting ? "Loading..." : "Submit"}
//               </Button>
//             </div>

//           </CardContent>
//         </Card>

//         {/* Error */}
//         {submitError && (
//           <p className="text-center text-red-500 text-sm">⚠ {submitError}</p>
//         )}

//         {/* Result */}
//         {result && (
//           <Card className="shadow-lg rounded-2xl border border-purple-200">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between mb-3">
//                 <h2 className="text-lg font-bold text-gray-700">Entitlement Amount</h2>
//                 {role === "admin" && (
//                   <button
//                     onClick={() => setShowEdit(true)}
//                     className="text-xs font-semibold text-purple-600 border border-purple-200 px-3 py-1 rounded-lg hover:bg-purple-50 transition-all"
//                   >
//                     {/* ✏ Edit */}
//                     Edit
//                   </button>
//                 )}
//               </div>
//               <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
//                 <span className="text-xl font-bold text-gray-800">₹ {result.amount}</span>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//       </div>

//       {showUpload && <UploadModal division={divisionName} onClose={() => setShowUpload(false)} />}
//       {showEdit && result && (
//         <EditModal
//           entitlement={result}
//           onClose={() => setShowEdit(false)}
//           onSaved={(newAmount) => { setResult(prev => ({ ...prev, amount: newAmount })); setShowEdit(false); }}
//         />
//       )}
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = "http://127.0.0.1:8000";

// ── Upload Modal ──────────────────────────────────────────────────────────────
const UploadModal = ({ division, onClose, onUploaded }) => {
  const token = localStorage.getItem("token");
  const [file,    setFile]    = useState(null);
  const [status,  setStatus]  = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) { setStatus("error"); setMessage("Please select a file first."); return; }
    setStatus("loading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res  = await fetch(`${API}/entitlement/sampling/upload?division=${encodeURIComponent(division)}`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed.");
      setStatus("success");
      setMessage(data.message || "Uploaded successfully.");
      onUploaded(); // refresh table after upload
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
        <h2 className="text-lg font-bold text-gray-700 mb-1">Upload Sampling Data</h2>
        <p className="text-xs text-gray-400 mb-1">Division: <span className="font-semibold text-gray-600">{division}</span></p>
        <p className="text-xs text-gray-400 mb-1">Columns: Level | Grade | Amount</p>
        <p className="text-xs text-red-400 mb-5">⚠ Replaces all existing data for {division}.</p>
        <input
          type="file" accept=".xlsx,.xls"
          onChange={e => { setFile(e.target.files[0]); setStatus(null); }}
          className="text-sm text-gray-600 mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100"
        />
        {file && <p className="text-xs text-gray-500 mb-4 truncate">📄 {file.name}</p>}
        <Button onClick={handleUpload} disabled={status === "loading"} className="w-full">
          {status === "loading" ? "Uploading..." : "Upload"}
        </Button>
        {status === "success" && <p className="text-sm text-green-600 mt-3">✅ {message}</p>}
        {status === "error"   && <p className="text-sm text-red-500  mt-3">⚠ {message}</p>}
      </div>
    </div>
  );
};


// ── Sampling Page ─────────────────────────────────────────────────────────────
export default function Sampling() {
  const { divisionName } = useParams();
  const navigate         = useNavigate();
  const role             = localStorage.getItem("role");
  const token            = localStorage.getItem("token");

  // rows = full table data for this division
  // each row: { id, level, grade, amount }
  const [rows,       setRows]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // editingRow tracks which row is being edited inline
  const [editingRow, setEditingRow] = useState(null);  // { id, amount }
  const [newAmount,  setNewAmount]  = useState("");
  const [editMsg,    setEditMsg]    = useState(null);

  const [showUpload, setShowUpload] = useState(false);


  // ── Fetch all entitlements for this division ──────────────────────────────
  // We call a new endpoint GET /entitlement/sampling/all?division=Corporate
  // which returns all rows for that division in one shot.
  // This replaces the old dropdown-based flow entirely.
  const fetchRows = () => {
    setLoading(true);
    setError(null);
    fetch(`${API}/entitlement/sampling/all?division=${encodeURIComponent(divisionName)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error("No entitlement data for this division."); return res.json(); })
      .then(data => { setRows(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  useEffect(() => { fetchRows(); }, [divisionName]);


  // ── Save inline edit ──────────────────────────────────────────────────────
  // PATCH /entitlement/sampling/{id} with { amount: newAmount }
  // On success: update that row in local state so table re-renders instantly
  const saveEdit = async (id) => {
    if (!newAmount.trim()) return;
    try {
      const res  = await fetch(`${API}/entitlement/sampling/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ amount: newAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Update failed.");

      // Update just that row in local state — no full re-fetch needed
      setRows(prev => prev.map(r => r.id === id ? { ...r, amount: newAmount } : r));
      setEditingRow(null);
      setNewAmount("");
      setEditMsg({ type: "success", text: `Updated to ₹${newAmount}` });
      setTimeout(() => setEditMsg(null), 3000);
    } catch (err) {
      setEditMsg({ type: "error", text: err.message });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white p-10">
      <h1 className="text-4xl font-bold text-center mb-2 text-purple-700 drop-shadow-md">
        Sampling Entitlement
      </h1>
      <p className="text-center text-gray-500 mb-8">{divisionName}</p>

      {/* Top bar — back + upload */}
      <div className="max-w-3xl mx-auto flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => navigate(`/${divisionName}/entitlement`)}>
          ← Back
        </Button>

        {role === "admin" && (
          <Button variant="secondary" onClick={() => setShowUpload(true)}>
            ⬆ Upload Data
          </Button>
        )}
      </div>

      {/* Edit status message */}
      {editMsg && (
        <div className={`max-w-3xl mx-auto mb-3 text-sm px-4 py-2 rounded-lg ${editMsg.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
          {editMsg.type === "success" ? "✅" : "⚠"} {editMsg.text}
        </div>
      )}

      {/* Table */}
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg rounded-2xl border border-purple-200">
          <CardContent className="p-0">

            {loading && (
              <p className="text-center text-gray-400 py-10">Loading...</p>
            )}

            {error && (
              <p className="text-center text-red-500 py-10">⚠ {error}</p>
            )}

            {!loading && !error && rows.length === 0 && (
              <p className="text-center text-gray-400 py-10">
                No entitlement data for {divisionName}. Upload an Excel file to get started.
              </p>
            )}

            {!loading && !error && rows.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-purple-50">
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Level</th>
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Grade</th>
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Amount (₹)</th>
                    {role === "admin" && (
                      <th className="text-left px-6 py-3 font-semibold text-purple-700">Action</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-purple-50 transition-colors`}
                    >
                      <td className="px-6 py-3 text-gray-700 font-medium">{row.level}</td>
                      <td className="px-6 py-3 text-gray-700">{row.grade}</td>

                      {/* Amount cell — shows input if this row is being edited */}
                      <td className="px-6 py-3">
                        {editingRow === row.id ? (
                          <input
                            type="text"
                            value={newAmount}
                            onChange={e => setNewAmount(e.target.value)}
                            className="w-28 p-1 text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-400"
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold text-gray-800">₹ {row.amount}</span>
                        )}
                      </td>

                      {/* Action cell — admin only */}
                      {role === "admin" && (
                        <td className="px-6 py-3">
                          {editingRow === row.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEdit(row.id)}
                                className="text-xs px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition-all"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => { setEditingRow(null); setNewAmount(""); }}
                                className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditingRow(row.id); setNewAmount(row.amount); setEditMsg(null); }}
                              className="text-xs text-purple-500 hover:text-purple-700 font-semibold"
                            >
                              ✏ Edit
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </CardContent>
        </Card>
      </div>

      {showUpload && (
        <UploadModal
          division={divisionName}
          onClose={() => setShowUpload(false)}
          onUploaded={() => { setShowUpload(false); fetchRows(); }}
        />
      )}
    </div>
  );
}