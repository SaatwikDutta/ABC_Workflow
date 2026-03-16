import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = "http://127.0.0.1:8000";

export default function Users() {
  const { divisionName } = useParams();
  const navigate         = useNavigate();
  const token            = localStorage.getItem("token");

  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(`${API}/users?division=${encodeURIComponent(divisionName)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { if (!res.ok) throw new Error("No users found for this division."); return res.json(); })
      .then(data => { setUsers(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [divisionName]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white p-10">
      <h1 className="text-4xl font-bold text-center mb-2 text-purple-700 drop-shadow-md">
        Users
      </h1>
      <p className="text-center text-gray-500 mb-8">{divisionName}</p>

      <div className="max-w-4xl mx-auto mb-4">
        <Button variant="outline" onClick={() => navigate(`/${divisionName}`)}>
          ← Back
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg rounded-2xl border border-purple-200">
          <CardContent className="p-0">

            {loading && <p className="text-center text-gray-400 py-10">Loading...</p>}
            {error   && <p className="text-center text-red-500 py-10">⚠ {error}</p>}

            {!loading && !error && users.length === 0 && (
              <p className="text-center text-gray-400 py-10">No users found for {divisionName}.</p>
            )}

            {!loading && !error && users.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-purple-50">
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Name</th>
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Employee ID</th>
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Email</th>
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Role</th>
                    <th className="text-left px-6 py-3 font-semibold text-purple-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`border-b border-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-purple-50 transition-colors`}
                    >
                      <td className="px-6 py-3 font-medium text-gray-700">{user.name}</td>
                      <td className="px-6 py-3 text-gray-600">{user.employee_id}</td>
                      <td className="px-6 py-3 text-gray-600">{user.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500 text-xs">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}