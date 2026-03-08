import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./Layout";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import DivisionPage from "./components/Dashboard/DivisionPage/DivisionPage";
import Workflow from "./components/Dashboard/Workflow/Workflow";
import Entitlement from "./components/Dashboard/Entitlement/Entitlement";
import Policy from "./components/Dashboard/Policy/Policy";
import Spocs from "./components/Dashboard/Spocs/Spocs";
import Approver from "./components/Dashboard/Approver/Approver";

// If no token → send to /login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public — login has its own full screen layout */}
        <Route path="/login" element={<Login />} />

        {/* Protected — all share Navbar + Footer via Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index                             element={<Dashboard />}    />
          <Route path="/:divisionName"             element={<DivisionPage />} />
          <Route path="/:divisionName/workflow"    element={<Workflow />}     />
          <Route path="/:divisionName/entitlement" element={<Entitlement />}  />
          <Route path="/:divisionName/policy"      element={<Policy />}       />
          <Route path="/:divisionName/spocs"       element={<Spocs />}        />
          <Route path="/:divisionName/approver"    element={<Approver />}     />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;