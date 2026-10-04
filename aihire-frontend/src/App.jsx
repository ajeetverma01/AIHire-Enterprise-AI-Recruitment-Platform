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
import GuestRoute from "./components/GuestRoute";


import CandidateJobDetails from "./pages/candidate/CandidateJobDetails";
import MyApplications from "./pages/candidate/MyApplications";

import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import ResumeManagement from "./pages/candidate/ResumeManagement";


import MyMatches from "./pages/candidate/MyMatches";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

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

        <Route
          path="/candidate/jobs/:jobId"
          element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <CandidateJobDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/applications"
          element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute allowedRole="RECRUITER">
              <RecruiterApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/resumes"
          element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <ResumeManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/matches"
          element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <MyMatches />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;