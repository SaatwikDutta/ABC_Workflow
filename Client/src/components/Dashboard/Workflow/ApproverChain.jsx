import React from "react";

const ApproverChain = ({ result }) => {
  if (!result || result.length === 0) return null;

  const row = result[0];
  const steps = [row.initiator, row.approver1, row.approver2, row.approver3, row.approver4].filter(Boolean);

  return (
    <div className="mt-6 max-w-2xl w-full mx-auto bg-white shadow rounded-xl p-5 border border-gray-100">
      <p className="text-sm font-semibold text-gray-400 uppercase mb-4 text-center">Approver Chain</p>
      <div className="flex items-center justify-center gap-2 flex-nowrap overflow-x-auto">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <span className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 text-sm font-medium text-purple-700 whitespace-nowrap">
              {step}
            </span>
            {index < steps.length - 1 && (
              <span className="text-purple-300 text-base shrink-0">→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ApproverChain;