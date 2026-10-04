import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";

function ResumeManagement() {
    const [file, setFile] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [analyses, setAnalyses] = useState({});
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [analyzingId, setAnalyzingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        fetchResumes();
        fetchSavedAnalyses();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await axiosClient.get(
                "/api/candidate/resumes"
            );
            setResumes(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load resumes."
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedAnalyses = async () => {
        try {
            const response = await axiosClient.get(
                "/api/resumes/my-analyses"
            );

            const analysisMap = {};

            response.data.forEach((analysis) => {
                analysisMap[analysis.resumeId] = analysis;
            });

            setAnalyses(analysisMap);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load saved resume analyses."
            );
        }
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            toast.error("Please select a PDF resume.");
            return;
        }

        if (
            file.type !== "application/pdf" &&
            !file.name.toLowerCase().endsWith(".pdf")
        ) {
            toast.error("Only PDF files are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("The PDF must be 5 MB or smaller.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);

        try {
            await axiosClient.post(
                "/api/candidate/resumes",
                formData
            );

            toast.success("Resume uploaded successfully!");
            setFile(null);
            event.target.reset();
            await fetchResumes();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Resume upload failed."
            );
        } finally {
            setUploading(false);
        }
    };

    const handleAnalyze = async (resumeId) => {
        setAnalyzingId(resumeId);

        try {
            const response = await axiosClient.post(
                `/api/resumes/${resumeId}/analysis`
            );

            setAnalyses((previous) => ({
                ...previous,
                [resumeId]: response.data,
            }));

            setExpandedId(resumeId);
            toast.success("Resume analysis completed!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Resume analysis failed."
            );
        } finally {
            setAnalyzingId(null);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

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

    return (
        <main className="dashboard-content">
            <header className="dashboard-header">
                <h1>Resume Management</h1>
                <p>
                    Upload your resume and use AI to understand your
                    strengths and areas for improvement.
                </p>
            </header>

            <section className="form-card">
                <h2>Upload Resume</h2>
                <p>Select a PDF file up to 5 MB.</p>

                <form onSubmit={handleUpload}>
                    <input
                        className="input"
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(event) =>
                            setFile(event.target.files?.[0] || null)
                        }
                    />

                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Upload Resume"}
                    </button>
                </form>
            </section>

            <section className="jobs-section">
                <div className="section-header">
                    <h2>My Resumes</h2>
                    <p>
                        Analyze a resume to get AI-powered career insights.
                    </p>
                </div>

                {loading ? (
                    <div className="empty-state">Loading resumes...</div>
                ) : resumes.length === 0 ? (
                    <div className="empty-state">
                        <h3>No resumes uploaded</h3>
                        <p>Upload your first PDF resume above.</p>
                    </div>
                ) : (
                    <div className="jobs-grid">
                        {resumes.map((resume) => {
                            const analysis = analyses[resume.id];
                            const isAnalyzing =
                                analyzingId === resume.id;
                            const isExpanded =
                                expandedId === resume.id;

                            return (
                                <article
                                    className="job-card resume-card"
                                    key={resume.id}
                                >
                                    <h3>{resume.fileName}</h3>

                                    <p>
                                        Uploaded on:{" "}
                                        {formatDate(resume.uploadedAt)}
                                    </p>

                                    <span className="status-badge status-hired">
                                        {analysis
                                            ? "Analysis available"
                                            : "Resume uploaded"}
                                    </span>

                                    <div className="resume-actions">
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            disabled={isAnalyzing}
                                            onClick={() =>
                                                handleAnalyze(resume.id)
                                            }
                                        >
                                            {isAnalyzing
                                                ? "Analyzing..."
                                                : analysis
                                                  ? "Analyze Again"
                                                  : "Analyze Resume"}
                                        </button>

                                        {analysis && (
                                            <button
                                                className="btn btn-secondary"
                                                type="button"
                                                onClick={() =>
                                                    setExpandedId(
                                                        isExpanded
                                                            ? null
                                                            : resume.id
                                                    )
                                                }
                                            >
                                                {isExpanded
                                                    ? "Hide Results"
                                                    : "View Results"}
                                            </button>
                                        )}
                                    </div>

                                    {analysis && isExpanded && (
                                        <div className="analysis-results">
                                            <h3>AI Resume Analysis</h3>

                                            <section>
                                                <h4>Summary</h4>
                                                <p>
                                                    {analysis.summary ||
                                                        "No summary available."}
                                                </p>
                                            </section>

                                            <section>
                                                <h4>Skills</h4>
                                                {renderList(
                                                    analysis.skills,
                                                    "No skills identified."
                                                )}
                                            </section>

                                            <section>
                                                <h4>Experience</h4>
                                                {renderList(
                                                    analysis.experience,
                                                    "No experience details identified."
                                                )}
                                            </section>

                                            <section>
                                                <h4>Strengths</h4>
                                                {renderList(
                                                    analysis.strengths,
                                                    "No strengths identified."
                                                )}
                                            </section>

                                            <section>
                                                <h4>Missing Skills</h4>
                                                {renderList(
                                                    analysis.missingSkills,
                                                    "No skill gaps identified."
                                                )}
                                            </section>

                                            <section>
                                                <h4>Suggestions</h4>
                                                {renderList(
                                                    analysis.suggestions,
                                                    "No suggestions available."
                                                )}
                                            </section>

                                            {analysis.analyzedAt && (
                                                <small>
                                                    Analyzed on:{" "}
                                                    {formatDate(
                                                        analysis.analyzedAt
                                                    )}
                                                </small>
                                            )}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

export default ResumeManagement;
