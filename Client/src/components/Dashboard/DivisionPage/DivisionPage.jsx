import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  FileTextIcon, ShieldCheckIcon,
  UserCheckIcon, UsersIcon, WorkflowIcon,
} from "lucide-react";

const DivisionPage = () => {
  const { divisionName } = useParams();
  // divisionName = "Corporate" / "ABD" / "TM&D" etc.
  // It came from the URL when the user clicked the division tile.
  // We pass it into every route below so child pages always know which division they're in.

  const cards = [
    {
      title: "Entitlement",
      icon: <ShieldCheckIcon size={36} />,
      color: "from-purple-400 to-indigo-500",
      path: `/${divisionName}/entitlement`,   // ← division baked into the path
    },
    {
      title: "Policy",
      icon: <FileTextIcon size={36} />,
      color: "from-blue-400 to-cyan-500",
      path: `/${divisionName}/policy`,
    },
    {
      title: "Workflow",
      icon: <WorkflowIcon size={36} />,
      color: "from-green-400 to-emerald-500",
      path: `/${divisionName}/workflow`,      // ← Workflow.jsx reads divisionName from URL
    },
    {
      title: "Spocs",
      icon: <UsersIcon size={36} />,
      color: "from-pink-400 to-rose-500",
      path: `/${divisionName}/spocs`,
    },
    {
      title: "Approver",
      icon: <UserCheckIcon size={36} />,
      color: "from-yellow-400 to-orange-500",
      path: `/${divisionName}/approver`,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 p-2">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-700 uppercase tracking-widest">
          {divisionName}
        </h1>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-indigo-500" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {cards.map((card, index) => (
          <Link to={card.path} key={index}>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 flex flex-col items-center gap-3 cursor-pointer hover:-translate-y-1 transition-all duration-200">
              <div className={`bg-gradient-to-br ${card.color} text-white rounded-full p-3`}>
                {card.icon}
              </div>
              <p className="text-gray-700 font-semibold text-sm">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-end my-8">
        <Link to="/">
          <button className="bg-purple-500 rounded px-3 py-3 font-bold text-white hover:-translate-y-1 transition-all duration-200">
            Back to Previous
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DivisionPage;