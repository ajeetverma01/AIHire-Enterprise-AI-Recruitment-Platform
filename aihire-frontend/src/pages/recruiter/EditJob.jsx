import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import axiosClient from "../../api/axiosClient";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";

function EditJob() {

    const { jobId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        employmentType: "FULL_TIME",
        experienceRequired: "",
        salary: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchJob();
    }, [jobId]);

    const fetchJob = async () => {

        try {

            const response = await axiosClient.get(
                `/api/recruiter/jobs/${jobId}`
            );

            const job = response.data;

            setFormData({
                title: job.title,
                description: job.description,
                location: job.location,
                employmentType: job.employmentType,
                experienceRequired: job.experienceRequired,
                salary: job.salary || "",
            });

        } catch (error) {

            console.error("Failed to fetch job:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load job."
            );

            navigate("/recruiter/jobs");

        } finally {

            setLoading(false);

        }
    };

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setSaving(true);

        try {

            await axiosClient.put(
                `/api/recruiter/jobs/${jobId}`,
                formData
            );

            toast.success("Job updated successfully!");

            navigate(`/recruiter/jobs/${jobId}`);

        } catch (error) {

            console.error("Failed to update job:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update job."
            );

        } finally {

            setSaving(false);

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

    return (
        <div className="dashboard-layout">

            <RecruiterSidebar />

            <main className="dashboard-content">

                <div className="page-header">

                    <h1>Edit Job</h1>

                    <p>
                        Update the details of your job posting.
                    </p>

                </div>

                <div className="form-card">

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>Job Title</label>

                            <input
                                className="input"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>Description</label>

                            <textarea
                                className="input textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="6"
                                required
                            />

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>Location</label>

                                <input
                                    className="input"
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Employment Type</label>

                                <select
                                    className="input"
                                    name="employmentType"
                                    value={formData.employmentType}
                                    onChange={handleChange}
                                >
                                    <option value="FULL_TIME">
                                        Full Time
                                    </option>

                                    <option value="PART_TIME">
                                        Part Time
                                    </option>

                                    <option value="CONTRACT">
                                        Contract
                                    </option>

                                    <option value="INTERNSHIP">
                                        Internship
                                    </option>
                                </select>

                            </div>

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>Experience Required</label>

                                <input
                                    className="input"
                                    type="text"
                                    name="experienceRequired"
                                    value={formData.experienceRequired}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>Salary</label>

                                <input
                                    className="input"
                                    type="text"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    value={formData.salary}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate(`/recruiter/jobs/${jobId}`)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default EditJob;