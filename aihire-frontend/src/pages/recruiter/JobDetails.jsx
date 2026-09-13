import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import axiosClient from "../../api/axiosClient";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";

function JobDetails() {

    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJob();
    }, [jobId]);

    const fetchJob = async () => {

        try {

            const response = await axiosClient.get(
                `/api/recruiter/jobs/${jobId}`
            );

            setJob(response.data);

        } catch (error) {

            console.error("Failed to fetch job:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load job."
            );

        } finally {

            setLoading(false);

        }
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <RecruiterSidebar />

                <main className="dashboard-content">
                    <div className="empty-state">
                        <p>Loading job...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="dashboard-layout">
                <RecruiterSidebar />

                <main className="dashboard-content">
                    <div className="empty-state">
                        <p>Job not found.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">

            <RecruiterSidebar />

            <main className="dashboard-content">

                <div className="page-header">

                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate("/recruiter/jobs")}
                    >
                        ← Back to My Jobs
                    </button>

                </div>

                <div className="job-details-card">

                    <div className="job-details-header">

                        <div>
                            <h1>{job.title}</h1>
                            <p>{job.location}</p>
                        </div>

                        <span className="job-status">
                            {job.status}
                        </span>

                    </div>

                    <div className="job-details-grid">

                        <div>
                            <span className="detail-label">
                                Employment Type
                            </span>

                            <strong>
                                {job.employmentType}
                            </strong>
                        </div>

                        <div>
                            <span className="detail-label">
                                Experience
                            </span>

                            <strong>
                                {job.experienceRequired}
                            </strong>
                        </div>

                        <div>
                            <span className="detail-label">
                                Salary
                            </span>

                            <strong>
                                {job.salary}
                            </strong>
                        </div>

                        <div>
                            <span className="detail-label">
                                Created
                            </span>

                            <strong>
                                {new Date(
                                    job.createdAt
                                ).toLocaleDateString()}
                            </strong>
                        </div>

                    </div>

                    <div className="job-description">

                        <h2>Description</h2>

                        <p>
                            {job.description}
                        </p>

                    </div>

                    <div className="job-detail-actions">

                        <button
                            className="btn btn-secondary"
                        >
                            Edit Job
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default JobDetails;