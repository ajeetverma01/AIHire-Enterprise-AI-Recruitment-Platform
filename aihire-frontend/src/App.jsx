import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import CreateJob from "./pages/recruiter/CreateJob";
import MyJobs from "./pages/recruiter/MyJobs";
import JobDetails from "./pages/recruiter/JobDetails";
import EditJob from "./pages/recruiter/EditJob";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/create"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <MyJobs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:jobId"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <JobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/jobs/:jobId/edit"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <EditJob />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;