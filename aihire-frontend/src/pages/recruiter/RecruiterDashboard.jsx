import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";

function RecruiterDashboard() {

    const { user } = useAuth();

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        try {

            const response = await axiosClient.get(
                "/api/recruiter/jobs"
            );

            setJobs(response.data);

        } catch (error) {

            console.error("Failed to fetch jobs:", error);

        }
    };

    const publishedJobs = jobs.filter(
        (job) => job.status === "PUBLISHED"
    ).length;

    const draftJobs = jobs.filter(
        (job) => job.status === "DRAFT"
    ).length;

    return (
        <div className="dashboard-layout">

            <RecruiterSidebar />

            <main className="dashboard-content">

                <header className="dashboard-header">

                    <div>
                        <h1>Recruiter Dashboard</h1>

                        <p>
                            Welcome back, {user?.email}
                        </p>
                    </div>

                </header>

                <section className="stats-grid">

                    <div className="stat-card">
                        <span>Total Jobs</span>
                        <strong>{jobs.length}</strong>
                    </div>

                    <div className="stat-card">
                        <span>Published</span>
                        <strong>{publishedJobs}</strong>
                    </div>

                    <div className="stat-card">
                        <span>Drafts</span>
                        <strong>{draftJobs}</strong>
                    </div>

                </section>

                <section className="jobs-section">

                    <div className="section-header">
                        <h2>Recent Jobs</h2>
                    </div>

                    {jobs.length === 0 ? (

                        <div className="empty-state">
                            <p>You haven't created any jobs yet.</p>
                        </div>

                    ) : (

                        <div className="jobs-grid">

                            {jobs.map((job) => (

                                <div
                                    className="job-card"
                                    key={job.id}
                                >

                                    <div>
                                        <h3>{job.title}</h3>

                                        <p>
                                            {job.location}
                                        </p>
                                    </div>

                                    <div className="job-details">

                                        <span>
                                            {job.employmentType}
                                        </span>

                                        <span>
                                            {job.status}
                                        </span>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default RecruiterDashboard;