import React from "react";
import { Link } from "react-router-dom";

const DIVISIONS = [
  "ABD", "Corporate", "CPO", "ESPB", "FBD",
  "ITD", "LSTC", "MAB", "PCPB", "PPB", "PSPD", "TM&D"
];

const COLORS = [
  { border: "border-l-blue-300",    bg: "bg-blue-50"    },
  { border: "border-l-indigo-300",  bg: "bg-indigo-50"  },
  { border: "border-l-violet-300",  bg: "bg-violet-50"  },
  { border: "border-l-teal-300",    bg: "bg-teal-50"    },
  { border: "border-l-cyan-300",    bg: "bg-cyan-50"    },
  { border: "border-l-sky-300",     bg: "bg-sky-50"     },
  { border: "border-l-emerald-300", bg: "bg-emerald-50" },
  { border: "border-l-slate-300",   bg: "bg-slate-50"   },
  { border: "border-l-purple-300",  bg: "bg-purple-50"  },
  { border: "border-l-blue-300",    bg: "bg-blue-50"    },
  { border: "border-l-teal-300",    bg: "bg-teal-50"    },
  { border: "border-l-indigo-300",  bg: "bg-indigo-50"  },
];

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 px-5">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-xl text-gray-400 mt-1 tracking-widest uppercase">
          All Divisions
        </h1>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-indigo-500" />
      </div>

      {/* Division Cards */}
      <div className="grid grid-cols-3 gap-10 max-w-5xl mx-auto">
        {DIVISIONS.map((division, index) => {
          const color = COLORS[index % 12];
          return (
            <Link to={`/${division}`} key={division}>
              <div className={`${color.bg} rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 p-8 flex items-center justify-center border-l-4 ${color.border} cursor-pointer`}>
                <span className="font-bold text-gray-700 text-base">
                  {division}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;