import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosClient from "../../api/axiosClient";

function ResumeManagement() {
    const [file, setFile] = useState(null);
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchResumes();
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

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!file) {
            toast.error("Please select a PDF resume.");
            return;
        }

        if (file.type !== "application/pdf" &&
            !file.name.toLowerCase().endsWith(".pdf")) {
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

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    return (
        <main className="dashboard-content">
            <header className="dashboard-header">
                <h1>Resume Management</h1>
                <p>Upload and manage your resumes.</p>
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
                        {resumes.map((resume) => (
                            <article className="job-card" key={resume.id}>
                                <h3>{resume.fileName}</h3>
                                <p>
                                    Uploaded on: {formatDate(resume.uploadedAt)}
                                </p>
                                <span className="status-badge status-hired">
                                    Text extracted
                                </span>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default ResumeManagement;
