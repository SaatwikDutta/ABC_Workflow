import { FileTextIcon, ShieldCheckIcon, UserCheckIcon, UsersIcon, WorkflowIcon, UserCogIcon } from "lucide-react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const colors = [
  { border: "border-l-blue-500",    text: "text-blue-500",    bg: "bg-blue-50"    },
  { border: "border-l-indigo-500",  text: "text-indigo-500",  bg: "bg-indigo-50"  },
  { border: "border-l-violet-500",  text: "text-violet-500",  bg: "bg-violet-50"  },
  { border: "border-l-teal-500",    text: "text-teal-500",    bg: "bg-teal-50"    },
  { border: "border-l-cyan-500",    text: "text-cyan-500",    bg: "bg-cyan-50"    },
  { border: "border-l-sky-500",     text: "text-sky-500",     bg: "bg-sky-50"     },
  { border: "border-l-emerald-500", text: "text-emerald-500", bg: "bg-emerald-50" },
  { border: "border-l-slate-500",   text: "text-slate-500",   bg: "bg-slate-50"   },
  { border: "border-l-purple-500",  text: "text-purple-500",  bg: "bg-purple-50"  },
  { border: "border-l-blue-700",    text: "text-blue-700",    bg: "bg-blue-50"    },
  { border: "border-l-teal-700",    text: "text-teal-700",    bg: "bg-teal-50"    },
  { border: "border-l-indigo-700",  text: "text-indigo-700",  bg: "bg-indigo-50"  },
];


// Used by Dashboard.jsx as a tile
export const DivisionTile = ({ divisionName, index }) => {
  const navigate = useNavigate();
  const color = colors[typeof index === "number" ? index % colors.length : 0];
  return (
    <div onClick={() => navigate(`/${divisionName}`)}>
      <div className={`group relative ${color.bg} rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6 flex flex-col items-center justify-center gap-2 border ${color.border} cursor-pointer`}>
        <span className={`${color.text} group-hover:text-purple-700 font-bold text-lg transition-colors duration-300`}>
          {divisionName}
        </span>
      </div>
    </div>
  );
};

// Used by App.jsx as the route page at /:divisionName
const DivisionPage = () => {
  const { divisionName } = useParams();
  const role = localStorage.getItem("role");
  const cards = [
    { title: "Entitlement", icon: <ShieldCheckIcon size={36} />, color: "from-purple-400 to-indigo-500", path: `/${divisionName}/entitlement`},
    { title: "Policy",      icon: <FileTextIcon    size={36} />, color: "from-blue-400 to-cyan-500",     path: `/${divisionName}/policy`},
    { title: "Workflow",    icon: <WorkflowIcon    size={36} />, color: "from-green-400 to-emerald-500", path: `/${divisionName}/workflow`},
    { title: "Spocs",       icon: <UsersIcon       size={36} />, color: "from-pink-400 to-rose-500",     path: `/${divisionName}/spocs`},
    { title: "Approver",    icon: <UserCheckIcon   size={36} />, color: "from-yellow-400 to-orange-500", path: `/${divisionName}/approver`},
    { title: "Users",    icon: <UserCogIcon size={36} />, color: "from-slate-400 to-gray-500", path: `/${divisionName}/users`, adminOnly: true},
  ];

  const visibleCards = cards.filter(c => !c.adminOnly || role === "admin");

  return (
    <div className="w-full min-h-screen bg-gray-50 p-2">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-gray-700 uppercase tracking-widest">{divisionName}</h1>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-indigo-500" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
        {visibleCards.map((card, index) => (
          <Link to={card.path} key={index}>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-6 flex flex-col items-center gap-3 cursor-pointer hover:-translate-y-1 transition-all duration-200">
              <div className={`bg-gradient-to-br ${card.color} text-white rounded-full p-3`}>{card.icon}</div>
              <p className="text-gray-700 font-semibold text-sm">{card.title}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-end my-8">
        <Link to="/"><button className="bg-purple-500 rounded px-3 py-3 font-bold text-white hover:-translate-y-1 transition-all duration-200">Back to Previous</button></Link>
      </div>
    </div>
  );
};

export default DivisionPage;