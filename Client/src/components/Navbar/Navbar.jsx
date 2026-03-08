import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../img/ITC_logo.jpg";
import { LayoutDashboard, LogOut } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-blue-100 px-6 py-3 flex items-center justify-between">

      {/* Left — circular logo + ITC text */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src={logo}
          alt="ITC Logo"
          className="h-10 w-10 object-cover rounded-full border border-blue-200"
        />
        <span className="text-xl font-extrabold text-blue-700">ITC</span>
      </Link>

      {/* Right — Dashboard + Logout only */}
      <div className="flex items-center gap-6">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-blue-700 transition-colors"
        >
          <LayoutDashboard size={16} />
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;