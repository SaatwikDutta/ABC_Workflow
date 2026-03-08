import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApproverChain from "./ApproverChain";

const TRAVEL_REPORT_TYPES = [
  "Domestic Business Travel",
  "International Business Travel",
  "Transfer Travel",
];

const NON_TRAVEL_REPORT_TYPES = [
  "Sampling Expense",
  "Car Related Expenses",
  "Business Expense",
];

const API = "http://127.0.0.1:8000";

const UploadModal = ({ type, onClose }) => {
  const token = localStorage.getItem("token");
  const section =
    type === "Travel"
      ? { label: "Travel Workflow",     endpoint: "/workflow/travel/upload",    note: "Columns: Report Type, Division, Workflow Type, Initiator, Approver 1-4" }
      : type === "Non-Travel"
      ? { label: "Non-Travel Workflow", endpoint: "/workflow/nontravel/upload", note: "Columns: Report Type, Division, Workflow Type, Initiator, Approver 1-4" }
      : { label: "Advance Workflow",    endpoint: "/workflow/advance/upload",   note: "Columns: Advance Type, Initiator, Approver 1-4" };

  const [file,    setFile]    = useState(null);
  const [status,  setStatus]  = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) { setStatus("error"); setMessage("Please select a file first."); return; }
    setStatus("loading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res  = await fetch(`${API}${section.endpoint}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed.");
      setStatus("success");
      setMessage(data.message || "Uploaded successfully.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>
        <h2 className="text-lg font-bold text-gray-700 mb-1">Upload {section.label}</h2>
        <p className="text-xs text-gray-400 mb-1">{section.note}</p>
        <p className="text-xs text-red-400 mb-5">⚠ This will replace all existing data.</p>
        <input
          type="file" accept=".xlsx,.xls"
          onChange={e => { setFile(e.target.files[0]); setStatus(null); }}
          className="text-sm text-gray-600 mb-4 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 file:font-semibold hover:file:bg-purple-100"
        />
        {file && <p className="text-xs text-gray-500 mb-4 truncate">📄 {file.name}</p>}
        <button onClick={handleUpload} disabled={status === "loading"}
          className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-800 transition-all disabled:opacity-50">
          {status === "loading" ? "Uploading..." : "Upload"}
        </button>
        {status === "success" && <p className="text-sm text-green-600 mt-3">✅ {message}</p>}
        {status === "error"   && <p className="text-sm text-red-500  mt-3">⚠ {message}</p>}
      </div>
    </div>
  );
};

const Workflow = () => {
  const { divisionName } = useParams();
  const navigate         = useNavigate();
  const role             = localStorage.getItem("role");
  const token            = localStorage.getItem("token");

  const [form, setForm] = useState({ type: "", reportType: "", workflowType: "" });
  const [workflowTypes, setWorkflowTypes] = useState([]);
  const [loadingTypes,  setLoadingTypes]  = useState(false);
  const [typesError,    setTypesError]    = useState(null);
  const [result,        setResult]        = useState(null);
  const [submitting,    setSubmitting]    = useState(false);
  const [submitError,   setSubmitError]   = useState(null);
  const [showUpload,    setShowUpload]    = useState(false);

  useEffect(() => {
    if (!form.type || !form.reportType || form.type === "Advance") return;
    const endpoint = form.type === "Travel" ? "travel/workflow-types" : "nontravel/workflow-types";
    setLoadingTypes(true);
    setTypesError(null);
    setWorkflowTypes([]);
    setForm(prev => ({ ...prev, workflowType: "" }));
    fetch(
      `${API}/workflow/${endpoint}?report_type=${encodeURIComponent(form.reportType)}&division=${encodeURIComponent(divisionName)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then(res => { if (!res.ok) throw new Error("No workflow types found."); return res.json(); })
      .then(data => { setWorkflowTypes(data); setLoadingTypes(false); })
      .catch(err => { setTypesError(err.message); setLoadingTypes(false); });
  }, [form.type, form.reportType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    setResult(null);
    let url = "";
    if (form.type === "Travel")
      url = `${API}/workflow/travel?report_type=${encodeURIComponent(form.reportType)}&division=${encodeURIComponent(divisionName)}&workflowType=${encodeURIComponent(form.workflowType)}`;
    else if (form.type === "Non-Travel")
      url = `${API}/workflow/nontravel?report_type=${encodeURIComponent(form.reportType)}&division=${encodeURIComponent(divisionName)}&workflowType=${encodeURIComponent(form.workflowType)}`;
    else if (form.type === "Advance")
      url = `${API}/workflow/advance?advance_type=${encodeURIComponent(form.reportType)}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (!res.ok) throw new Error("No matching workflow found."); return res.json(); })
      .then(data => { setResult(data); setSubmitting(false); })
      .catch(err => { setSubmitError(err.message); setSubmitting(false); });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const reportTypeOptions =
    form.type === "Travel"     ? TRAVEL_REPORT_TYPES :
    form.type === "Non-Travel" ? NON_TRAVEL_REPORT_TYPES :
    form.type === "Advance"    ? ["Advances (Corporate)", "Advances (LSTC)", "Advances FBD--Travel"] : [];

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="max-w-2xl w-full mx-auto p-8 bg-white shadow-2xl rounded-2xl space-y-8 border border-gray-100">

        <header className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700">Workflow</h1>
          <p className="text-gray-400 text-sm">Division: <span className="font-semibold text-gray-600">{divisionName}</span></p>
        </header>

        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700">Select Type <span className="text-purple-500">*</span></label>
          <select name="type" value={form.type} onChange={handleChange} required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
            <option value="">--Select--</option>
            <option value="Travel">Travel</option>
            <option value="Non-Travel">Non-Travel</option>
            <option value="Advance">Advance</option>
          </select>
        </div>

        {form.type && (
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Select Report Type <span className="text-purple-500">*</span></label>
            <select name="reportType" value={form.reportType} onChange={handleChange} required
              className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
              <option value="">--Select--</option>
              {reportTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )}

        {form.reportType && form.type !== "Advance" && (
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">Workflow Type <span className="text-purple-500">*</span></label>
            {loadingTypes && <p className="text-sm text-gray-400">Loading...</p>}
            {typesError   && <p className="text-sm text-red-500">⚠ {typesError}</p>}
            {!loadingTypes && !typesError && (
              <select name="workflowType" value={form.workflowType} onChange={handleChange} required
                className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400">
                <option value="">--Select--</option>
                {workflowTypes.map(wt => <option key={wt} value={wt}>{wt}</option>)}
              </select>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button type="button" onClick={() => navigate(`/${divisionName}`)}
            className="rounded bg-purple-600 px-8 py-3 font-bold text-white hover:bg-purple-800 hover:scale-105 transition-all">
            Back
          </button>

          {role === "admin" && form.type && (
            <button type="button" onClick={() => setShowUpload(true)}
              className="rounded border border-gray-300 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all">
              ⬆ Upload {form.type} Data
            </button>
          )}

          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="rounded bg-purple-600 px-8 py-3 font-bold text-white hover:bg-purple-800 hover:scale-105 transition-all disabled:opacity-50">
            {submitting ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="mt-6 max-w-2xl w-full bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
          ⚠ {submitError}
        </div>
      )}

      {/* Arrow flow approver chain */}
      <ApproverChain result={result} />

      {showUpload && <UploadModal type={form.type} onClose={() => setShowUpload(false)} />}
    </main>
  );
};

export default Workflow;