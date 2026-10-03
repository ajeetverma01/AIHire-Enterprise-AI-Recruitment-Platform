
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";

function CandidateJobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    const fetchJobDetails = async () => {
        try {
            // Fetch open jobs and find the requested job.
            const response = await axiosClient.get("/api/candidate/jobs");

            const selectedJob = response.data.find(
                (item) => item.id === jobId
            );

            if (!selectedJob) {
                toast.error("Job not found or no longer available.");
                navigate("/candidate/dashboard");
                return;
            }

            setJob(selectedJob);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load job details."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <main className="dashboard-content">
            <p>Loading job details...</p>
        </main>;
    }

    if (!job) return null;

    const handleApply = async () => {
        try {
            await axiosClient.post("/api/candidate/applications", {
                jobId: job.id,
            });

            toast.success("Application submitted successfully!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to submit application."
            );
        }
    };

    return (
        <main className="dashboard-content">
            <button
                className="btn btn-secondary"
                onClick={() => navigate("/candidate/dashboard")}
            >
                Back to Jobs
            </button>

            <section className="form-card">
                <h1>{job.title}</h1>

                <div className="job-details">
                    <span>{job.location}</span>
                    <span>{job.employmentType}</span>
                    <span>{job.experienceRequired}</span>
                </div>

                <p>
                    <strong>Salary:</strong>{" "}
                    {job.salary || "Not specified"}
                </p>

                <h2>Job Description</h2>
                <p>{job.description}</p>

                <button
                    className="btn btn-primary"
                    onClick={handleApply}
                >
                    Apply for Job
                </button>
            </section>
        </main>
    );
}

export default CandidateJobDetails;
