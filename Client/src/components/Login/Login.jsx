import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://127.0.0.1:8000";

const DIVISIONS = [
  "ABD", "Corporate", "CPO", "ESPB", "FBD",
  "ITD", "LSTC", "MAB", "PCPB", "PPB", "PSPD", "TM&D"
];

// ── Register Form ─────────────────────────────────────────────────────────────
const RegisterForm = ({ onBack }) => {
  const [form, setForm]       = useState({ name: "", email: "", employee_id: "", password: "", division: "" });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, role: "user" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Registration failed.");
      setSuccess(true);
      setTimeout(() => onBack(), 2000); // go back to login after 2 seconds
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="text-center space-y-3">
      <p className="text-4xl">✅</p>
      <p className="text-green-600 font-semibold">Account created successfully!</p>
      <p className="text-gray-400 text-sm">Redirecting to login...</p>
    </div>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-extrabold text-purple-700 text-center">Create Account</h2>
      <p className="text-gray-400 text-sm text-center">Fill in your details to register</p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">⚠ {error}</div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
        <input name="employee_id" value={form.employee_id} onChange={handleChange} placeholder="EMP001"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Division</label>
        <select name="division" value={form.division} onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm">
          <option value="">-- Select Division --</option>
          {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create a password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-800 transition-all disabled:opacity-50">
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <button onClick={onBack}
        className="w-full py-2 text-sm text-gray-500 hover:text-purple-600 transition-colors">
        ← Back to Login
      </button>
    </div>
  );
};


// ── Login Form ────────────────────────────────────────────────────────────────
const LoginForm = ({ onRegister }) => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ identifier: "", password: "" });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed.");
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role",  data.role);
      localStorage.setItem("name",  data.name);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-2">
        <h1 className="text-3xl font-extrabold text-purple-700">ITC</h1>
        <p className="text-gray-400 text-sm mt-1">Happay Support App</p>
        <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-purple-500" />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">⚠ {error}</div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email or Employee ID</label>
        <input type="text" name="identifier" value={form.identifier} onChange={handleChange}
          placeholder="Enter your email or employee ID"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange}
          placeholder="Enter your password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-800 transition-all disabled:opacity-50">
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button onClick={onRegister} className="text-purple-600 font-semibold hover:underline">
          Create one
        </button>
      </p>
    </div>
  );
};


// ── Main Login Page ───────────────────────────────────────────────────────────
const Login = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        {showRegister
          ? <RegisterForm onBack={() => setShowRegister(false)} />
          : <LoginForm    onRegister={() => setShowRegister(true)} />
        }
      </div>
    </div>
  );
};

export default Login;