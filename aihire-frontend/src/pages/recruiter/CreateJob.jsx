import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axiosClient from "../../api/axiosClient";
import RecruiterSidebar from "../../components/recruiter/RecruiterSidebar";

function CreateJob() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        employmentType: "FULL_TIME",
        experienceRequired: "",
        salary: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {

        event.preventDefault();

        setLoading(true);

        try {

            await axiosClient.post(
                "/api/recruiter/jobs",
                formData
            );

            toast.success("Job created successfully!");

            navigate("/recruiter/dashboard");

        } catch (error) {

            console.error("Failed to create job:", error);

            if (error.response) {

                toast.error(
                    error.response.data.message ||
                    "Failed to create job."
                );

            } else {

                toast.error(
                    "Unable to connect to the server."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="dashboard-layout">

            <RecruiterSidebar />

            <main className="dashboard-content">

                <div className="page-header">
                    <h1>Create Job</h1>
                    <p>
                        Create a new job opening for candidates.
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
                                placeholder="e.g. Java Backend Developer"
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
                                placeholder="Describe the role, responsibilities and requirements..."
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
                                    placeholder="e.g. Bangalore"
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
                                    placeholder="e.g. 1-3 years"
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
                                    placeholder="e.g. 6-10 LPA"
                                    required
                                />
                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate("/recruiter/dashboard")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Job"}
                            </button>

                        </div>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default CreateJob;