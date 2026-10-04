
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";

function CandidateJobDetails() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState("");
    const [loadingResumes, setLoadingResumes] = useState(true);

    const [matchResult, setMatchResult] = useState(null);
    const [matching, setMatching] = useState(false);

    const [applying, setApplying] = useState(false);

    useEffect(() => {
        fetchJobDetails();
    }, [jobId]);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchJobDetails = async () => {
        setLoading(true);

        try {
            const response = await axiosClient.get(
                "/api/candidate/jobs"
            );

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

    const fetchResumes = async () => {
        try {
            const response = await axiosClient.get(
                "/api/candidate/resumes"
            );

            setResumes(response.data);

            if (response.data.length > 0) {
                setSelectedResumeId(response.data[0].id);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load your resumes."
            );
        } finally {
            setLoadingResumes(false);
        }
    };

    const handleMatchResume = async () => {
        if (!selectedResumeId) {
            toast.error("Please upload a resume before matching.");
            return;
        }

        setMatching(true);
        setMatchResult(null);

        try {
            const response = await axiosClient.post(
                `/api/resumes/${selectedResumeId}/match/${jobId}`
            );

            setMatchResult(response.data);
            toast.success("Resume matching completed!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to match your resume with this job."
            );
        } finally {
            setMatching(false);
        }
    };

    const handleApply = async () => {
        setApplying(true);

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
        } finally {
            setApplying(false);
        }
    };

    const renderList = (items, emptyMessage) => {
        if (!items?.length) {
            return <p>{emptyMessage}</p>;
        }

        return (
            <ul className="analysis-list">
                {items.map((item, index) => (
                    <li key={`${index}-${item}`}>{item}</li>
                ))}
            </ul>
        );
    };

    if (loading) {
        return (
            <main className="dashboard-content">
                <p>Loading job details...</p>
            </main>
        );
    }

    if (!job) return null;

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
                    disabled={applying}
                >
                    {applying ? "Applying..." : "Apply for Job"}
                </button>
            </section>

            <section className="form-card resume-matching-card">
                <h2>AI Resume–Job Matching</h2>

                <p>
                    Compare your resume with this job to understand how
                    your skills and experience align with its requirements.
                </p>

                {loadingResumes ? (
                    <p>Loading your resumes...</p>
                ) : resumes.length === 0 ? (
                    <div className="empty-state">
                        <p>You haven't uploaded a resume yet.</p>

                        <button
                            className="btn btn-primary"
                            onClick={() =>
                                navigate("/candidate/resumes")
                            }
                        >
                            Upload Resume
                        </button>
                    </div>
                ) : (
                    <>
                        <label htmlFor="resume-select">
                            Select a resume
                        </label>

                        <select
                            id="resume-select"
                            className="input"
                            value={selectedResumeId}
                            onChange={(event) => {
                                setSelectedResumeId(event.target.value);
                                setMatchResult(null);
                            }}
                        >
                            {resumes.map((resume) => (
                                <option
                                    key={resume.id}
                                    value={resume.id}
                                >
                                    {resume.fileName}
                                </option>
                            ))}
                        </select>

                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleMatchResume}
                            disabled={matching || !selectedResumeId}
                        >
                            {matching
                                ? "Analyzing Match..."
                                : "Match Resume to Job"}
                        </button>
                    </>
                )}

                {matchResult && (
                    <div className="analysis-results">
                        <h3>Match Results</h3>

                        <div className="match-score">
                            <span>Resume Match Score</span>
                            <strong>
                                {matchResult.matchScore}%
                            </strong>
                        </div>

                        <p>{matchResult.overallAssessment}</p>

                        <section>
                            <h4>Matching Skills</h4>
                            {renderList(
                                matchResult.matchingSkills,
                                "No matching skills identified."
                            )}
                        </section>

                        <section>
                            <h4>Missing Skills</h4>
                            {renderList(
                                matchResult.missingSkills,
                                "No missing skills identified."
                            )}
                        </section>

                        <section>
                            <h4>Relevant Experience</h4>
                            {renderList(
                                matchResult.matchingExperience,
                                "No directly relevant experience identified."
                            )}
                        </section>

                        <section>
                            <h4>Skill Gaps</h4>
                            {renderList(
                                matchResult.skillGaps,
                                "No specific skill gaps identified."
                            )}
                        </section>

                        <section>
                            <h4>Recommendations</h4>
                            {renderList(
                                matchResult.recommendations,
                                "No recommendations available."
                            )}
                        </section>

                        <p className="match-disclaimer">
                            This AI-generated score is an estimate of
                            resume-to-job alignment, not a guarantee of
                            interview selection or employment.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}

export default CandidateJobDetails;
