
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";

import CandidateSidebar from "../../components/candidate/CandidateSidebar";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axiosClient.get(
                "/api/candidate/applications"
            );
            setApplications(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load your applications."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="dashboard-layout">
            <CandidateSidebar />

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <h1>My Applications</h1>
                    <p>Track the status of your job applications.</p>
                </header>

                <section className="jobs-section">
                    {loading ? (
                        <div className="empty-state">
                            Loading your applications...
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="empty-state">
                            <h3>No applications yet</h3>
                            <p>
                                Apply for a job to see it listed here.
                            </p>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {applications.map((application) => (
                                <article
                                    className="job-card"
                                    key={application.applicationId}
                                >
                                    <h3>{application.jobTitle}</h3>

                                    <p>
                                        Applied on:{" "}
                                        {formatDate(application.appliedAt)}
                                    </p>

                                    <div className="job-details">
                                        <span>
                                            Status: {application.status}
                                        </span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default MyApplications;
