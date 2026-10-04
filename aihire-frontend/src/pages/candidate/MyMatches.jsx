
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import CandidateSidebar from "../../components/candidate/CandidateSidebar";

function MyMatches() {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await axiosClient.get(
                "/api/resumes/my-matches"
            );

            setMatches(response.data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to load your saved matches."
            );
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "Not available";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
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

    return (
        <div className="dashboard-layout">
            <CandidateSidebar />

            <main className="dashboard-content">
                <header className="dashboard-header">
                    <h1>My Matches</h1>
                    <p>
                        Review your saved AI resume-to-job matching
                        results and discover where you can improve.
                    </p>
                </header>

                <section className="stats-grid">
                    <div className="stat-card">
                        <span>Total Matches</span>
                        <strong>{matches.length}</strong>
                    </div>
                </section>

                <section className="jobs-section">
                    <div className="section-header">
                        <h2>Your Resume Matches</h2>
                        <p>
                            These results are retrieved from your saved
                            matching history.
                        </p>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            Loading your matches...
                        </div>
                    ) : matches.length === 0 ? (
                        <div className="empty-state">
                            <h3>No matches yet</h3>
                            <p>
                                Open an available job and use AI Resume–Job
                                Matching to get started.
                            </p>

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate("/candidate/dashboard")
                                }
                            >
                                Explore Jobs
                            </button>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {matches.map((match) => {
                                const expanded =
                                    expandedId === match.id;

                                return (
                                    <article
                                        className="job-card match-card"
                                        key={match.id}
                                    >
                                        <div className="match-card-header">
                                            <div>
                                                <h3>
                                                    {match.jobTitle ||
                                                        "Job"}
                                                </h3>

                                                <p>
                                                    Matched on:{" "}
                                                    {formatDate(
                                                        match.matchedAt
                                                    )}
                                                </p>
                                            </div>

                                            <div className="match-score-badge">
                                                {match.matchScore}%
                                            </div>
                                        </div>

                                        <p>
                                            {match.overallAssessment}
                                        </p>

                                        <div className="match-card-actions">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    setExpandedId(
                                                        expanded
                                                            ? null
                                                            : match.id
                                                    )
                                                }
                                            >
                                                {expanded
                                                    ? "Hide Details"
                                                    : "View Details"}
                                            </button>

                                            <button
                                                className="btn btn-primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/candidate/jobs/${match.jobId}`
                                                    )
                                                }
                                            >
                                                View Job
                                            </button>
                                        </div>

                                        {expanded && (
                                            <div className="analysis-results">
                                                <section>
                                                    <h4>
                                                        Matching Skills
                                                    </h4>
                                                    {renderList(
                                                        match.matchingSkills,
                                                        "No matching skills identified."
                                                    )}
                                                </section>

                                                <section>
                                                    <h4>
                                                        Missing Skills
                                                    </h4>
                                                    {renderList(
                                                        match.missingSkills,
                                                        "No missing skills identified."
                                                    )}
                                                </section>

                                                <section>
                                                    <h4>
                                                        Relevant Experience
                                                    </h4>
                                                    {renderList(
                                                        match.matchingExperience,
                                                        "No relevant experience identified."
                                                    )}
                                                </section>

                                                <section>
                                                    <h4>Skill Gaps</h4>
                                                    {renderList(
                                                        match.skillGaps,
                                                        "No specific skill gaps identified."
                                                    )}
                                                </section>

                                                <section>
                                                    <h4>
                                                        Recommendations
                                                    </h4>
                                                    {renderList(
                                                        match.recommendations,
                                                        "No recommendations available."
                                                    )}
                                                </section>

                                                <p className="match-disclaimer">
                                                    This AI-generated score
                                                    estimates resume-to-job
                                                    alignment. It does not
                                                    guarantee interview
                                                    selection or employment.
                                                </p>
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default MyMatches;
