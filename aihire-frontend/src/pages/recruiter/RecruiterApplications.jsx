import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";

function RecruiterApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await axiosClient.get(
                "/api/recruiter/applications"
            );
            setApplications(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load applications."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (applicationId, status) => {
        setUpdatingId(applicationId);

        try {
            await axiosClient.patch(
                `/api/recruiter/applications/${applicationId}/status`,
                { status }
            );

            setApplications((previous) =>
                previous.map((application) =>
                    application.applicationId === applicationId
                        ? { ...application, status }
                        : application
                )
            );

            toast.success(`Application ${status.toLowerCase()} successfully.`);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to update application status."
            );
        } finally {
            setUpdatingId(null);
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

            <RecruiterSidebar />
            <main className="dashboard-content">
                <header className="dashboard-header">
                    <h1>Candidate Applications</h1>
                    <p>Review candidates and manage their application progress.</p>
                </header>

                {loading ? (
                    <div className="empty-state">Loading applications...</div>
                ) : applications.length === 0 ? (
                    <div className="empty-state">
                        <h3>No applications yet</h3>
                        <p>Applications for your jobs will appear here.</p>
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
                                    <strong>Candidate:</strong>{" "}
                                    {application.candidateEmail}
                                </p>

                                <p>
                                    <strong>Applied:</strong>{" "}
                                    {formatDate(application.appliedAt)}
                                </p>

                                <div className="job-details">
                                    <span className={`status-badge status-${application.status.toLowerCase()}`}>
                                        {application.status}
                                    </span>
                                </div>

                                <div className="application-actions">
                                    {application.status === "APPLIED" && (
                                        <>
                                            <button
                                                className="btn btn-primary"
                                                disabled={updatingId === application.applicationId}
                                                onClick={() =>
                                                    updateStatus(
                                                        application.applicationId,
                                                        "SHORTLISTED"
                                                    )
                                                }
                                            >
                                                Shortlist
                                            </button>

                                            <button
                                                className="btn btn-secondary"
                                                disabled={updatingId === application.applicationId}
                                                onClick={() =>
                                                    updateStatus(
                                                        application.applicationId,
                                                        "REJECTED"
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {application.status === "SHORTLISTED" && (
                                        <button
                                            className="btn btn-primary"
                                            disabled={updatingId === application.applicationId}
                                            onClick={() =>
                                                updateStatus(
                                                    application.applicationId,
                                                    "HIRED"
                                                )
                                            }
                                        >
                                            Mark as Hired
                                        </button>
                                    )}

                                    {application.status === "REJECTED" && (
                                        <p>This application was rejected.</p>
                                    )}

                                    {application.status === "HIRED" && (
                                        <p>Candidate has been hired.</p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default RecruiterApplications;