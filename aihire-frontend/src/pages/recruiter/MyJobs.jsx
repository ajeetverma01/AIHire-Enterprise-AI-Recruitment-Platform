import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import axiosClient from "../../api/axiosClient";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";

import { useNavigate } from "react-router-dom";

function MyJobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);
    const navigate = useNavigate();

    const fetchJobs = async () => {

        try {

            const response = await axiosClient.get(
                "/api/recruiter/jobs"
            );

            setJobs(response.data);

        } catch (error) {

            console.error("Failed to fetch jobs:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load jobs."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="dashboard-layout">

            <RecruiterSidebar />

            <main className="dashboard-content">

                <div className="page-header">
                    <h1>My Jobs</h1>

                    <p>
                        Manage the jobs you have created.
                    </p>
                </div>

                {loading ? (

                    <div className="empty-state">
                        <p>Loading jobs...</p>
                    </div>

                ) : jobs.length === 0 ? (

                    <div className="empty-state">
                        <p>You haven't created any jobs yet.</p>
                    </div>

                ) : (

                    <div className="jobs-management">

                        {jobs.map((job) => (

                            <div
                                className="job-management-card"
                                key={job.id}
                            >

                                <div className="job-main-info">

                                    <h3>{job.title}</h3>

                                    <p>
                                        {job.location}
                                    </p>

                                    <div className="job-meta">

                                        <span>
                                            {job.employmentType}
                                        </span>

                                        <span>
                                            {job.experienceRequired}
                                        </span>

                                        <span>
                                            {job.salary}
                                        </span>

                                    </div>

                                </div>

                                <div className="job-management-right">

                                    <span className="job-status">
                                        {job.status}
                                    </span>

                                    <div className="job-actions">

                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => navigate(`/recruiter/jobs/${job.id}`)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                navigate(`/recruiter/jobs/${job.id}/edit`)
                                            }
                                        >
                                            Edit
                                        </button>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default MyJobs;