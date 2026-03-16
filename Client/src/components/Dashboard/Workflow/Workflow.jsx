import React, { useState } from "react";
import { useNavigate } from "react-router-dom";



const divisionOptions = [
  { value: "", label: "--Select--" },
  { value: "corporate", label: "Corporate" },
  { value: "tmd", label: "TM&D" },
  { value: "cpo", label: "CPO" },
  { value: "espb", label: "ESPB" },
  { value: "pcpb", label: "PCPB" },
  { value: "ppb", label: "PPB" },
  { value: "fbd", label: "FBD" },
  { value: "lstc", label: "LSTC" },
  { value: "pspd", label: "PSPD" },
  { value: "itd", label: "ITD" },
  { value: "mab", label: "MAB" },
];

const Workflow = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: "",
    reportType: "",
    division: "",
    workflowType: "",
  });

  const handleBack = (e)=>{
    navigate("/")
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.division) {
      return;
    }
    navigate(
      `/${form.division}?type=${encodeURIComponent(form.type)}&reportType=${encodeURIComponent(form.reportType)}&workflowType=${encodeURIComponent(form.workflowType)}`
    );
    
  };

  return (
    <main className="min-h-screen flex items-center">
      <form
        className="max-w-2xl w-full mx-auto p-8 bg-white shadow-2xl rounded-2xl space-y-8 border border-gray-100"
        onSubmit={handleSubmit}
      >
        <header className="text-center space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-700">
            Workflow Submission
          </h1>
          <p className="text-gray-500 text-base">
            Fill out the form and submit your workflow preferences.
          </p>
        </header>

        {/* Select Type */}
        <div>
          <label
            className="block mb-1 text-md font-semibold text-gray-700"
            htmlFor="type"
          >
            Select Type <span className="text-purple-500 font-bold">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
          >
            <option value="">--Select--</option>
            <option value="Travel">Travel</option>
            <option value="Non-Travel">Non-Travel</option>
          </select>
        </div>

        {/* Report Type */}
        <div>
          <label
            className="block mb-1 text-md font-semibold text-gray-700"
            htmlFor="reportType"
          >
            Select Report Type{" "}
            <span className="text-purple-500 font-bold">*</span>
          </label>
          <select
            id="reportType"
            name="reportType"
            value={form.reportType}
            onChange={handleChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
          >
            <option value="">--Select--</option>
            <option value="Domestic Business Travel">Domestic Business Travel</option>
            <option value="Tranfer Travel">Tranfer Travel</option>
          </select>
        </div>

        {/* Division */}
        <div>
          <label
            className="block mb-1 text-md font-semibold text-gray-700"
            htmlFor="division"
          >
            Division <span className="text-purple-500 font-bold">*</span>
          </label>
          <select
            id="division"
            name="division"
            value={form.division}
            onChange={handleChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
          >
            {divisionOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Workflow Type */}
        <div>
          <label
            className="block mb-1 text-md font-semibold text-gray-700"
            htmlFor="workflowType"
          >
            Workflow Type <span className="text-purple-500 font-bold">*</span>
          </label>
          <select
            id="workflowType"
            name="workflowType"
            value={form.workflowType}
            onChange={handleChange}
            required
            className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
          >
            <option value="">--Select--</option>
            <option value="Self Approver - Level 2 and Above">
              Self Approver - Level 2 and Above
            </option>
            <option value="Normal - Level 3 and Below">Normal - Level 3 and Below</option>
            <option value="Deviation - Level 3 and Below">Deviation - Level 3 and Below</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            className="rounded bg-purple-600 px-8 py-3 font-bold text-white
                  transition-all duration-200 ease-in-out
                  hover:bg-purple-800 hover:scale-105 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
          back
          </button>
          <button
            type="submit"
            className="rounded bg-purple-600 px-8 py-3 font-bold text-white
                  transition-all duration-200 ease-in-out
                  hover:bg-purple-800 hover:scale-105 hover:shadow-lg
                  focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
};

export default Workflow;
