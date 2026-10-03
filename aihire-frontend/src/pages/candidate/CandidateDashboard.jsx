
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CandidateSidebar from "../../components/candidate/CandidateSidebar";

function CandidateDashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");

  const [appliedJobIds, setAppliedJobIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (filters = {}) => {
    setLoading(true);

    try {
      const params = {};

      if (filters.location?.trim()) {
        params.location = filters.location.trim();
      }

      if (filters.employmentType) {
        params.employmentType = filters.employmentType;
      }

      const response = await axiosClient.get("/api/candidate/jobs", {
        params,
      });

      setJobs(response.data);

      const applicationsResponse = await axiosClient.get(
        "/api/candidate/applications"
      );

      setAppliedJobIds(
        applicationsResponse.data.map((application) => application.jobId)
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to load available jobs."
      );
    } finally {
      setLoading(false);
    }
  };
  return (

    <div className="dashboard-layout">
      <CandidateSidebar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Candidate Dashboard</h1>
          <p>
            Welcome back, {user?.email || "Candidate"}
          </p>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <span>Available Jobs</span>
            <strong>{jobs.length}</strong>
          </div>
        </section>

        <section className="jobs-section">
          <div className="section-header">
            <h2>Available Jobs</h2>
            <p>Explore opportunities that match your skills.</p>
          </div>

          <form
            className="job-filters"
            onSubmit={(event) => {
              event.preventDefault();
              fetchJobs({ location, employmentType });
            }}
          >
            <input
              className="input"
              type="text"
              placeholder="Search by location..."
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />

            <select
              className="input"
              value={employmentType}
              onChange={(event) => setEmploymentType(event.target.value)}
            >
              <option value="">All employment types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>

            <button className="btn btn-primary" type="submit">
              Search Jobs
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setLocation("");
                setEmploymentType("");
                fetchJobs();
              }}
            >
              Clear Filters
            </button>
          </form>



          {loading ? (
            <div className="empty-state">
              Loading available jobs...
            </div>
          ) : jobs.length === 0 ? (
            <div className="empty-state">
              <h3>No jobs available yet</h3>
              <p>
                Check back later for new opportunities.
              </p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map((job) => (
                <article
                  className="job-card"
                  key={job.id}
                >
                  <h3>{job.title}</h3>
                  <p>{job.location}</p>

                  <div className="job-details">
                    <span>{job.employmentType}</span>
                    <span>{job.experienceRequired}</span>
                  </div>

                  <p>
                    {job.salary || "Salary not specified"}
                  </p>

                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                  >
                    {appliedJobIds.includes(job.id) ? "View Application" : "View Job"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default CandidateDashboard;
