import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Workflow from "./components/Dashboard/Workflow/Workflow";
import Entitlement from "./components/Dashboard/Entitlement/Entitlement";
import Sampling from "./components/Dashboard/Entitlement/Sampling";
import Policy from "./components/Dashboard/Policy/Policy";
import Spocs from "./components/Dashboard/Spocs/Spocs";
import Approver from "./components/Dashboard/Approver/Approver";
import Users from "./components/Dashboard/Users/Users";
import DivisionPage from "./components/Dashboard/Division/DivisionPage";

// No token → redirect to /login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected — all share Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index                                       element={<Dashboard />}   />
          <Route path="/:divisionName"                      element={<DivisionPage />} />
          <Route path="/:divisionName/workflow"             element={<Workflow />}     />
          <Route path="/:divisionName/entitlement"          element={<Entitlement />}  />
          <Route path="/:divisionName/entitlement/sampling" element={<Sampling />}     />
          <Route path="/:divisionName/policy"               element={<Policy />}       />
          <Route path="/:divisionName/spocs"                element={<Spocs />}        />
          <Route path="/:divisionName/approver"             element={<Approver />}     />
          <Route path="/:divisionName/entitlement/sampling" element={<Sampling />} />
          <Route path="/:divisionName/users" element={<Users />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;