import React, { useState, useEffect } from 'react';
import { ourTrackAPI } from '../../services/api';
import Alert from '../../components/Alert';
import { useAuth } from '../../contexts/AuthContext';

const OurTrack = () => {
    const { isAuthenticated } = useAuth();
    const [trackData, setTrackData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        yearExp: '',
        totalExpert: '',
        planningDone: '',
        happyCustomers: ''
    });

    useEffect(() => {
        fetchTrackData();
    }, []);

    const fetchTrackData = async () => {
        setLoading(true);
        try {
            const response = await ourTrackAPI.get();
            if (response.data && response.data.data) {
                setTrackData(response.data.data);
                setIsEditing(true);
            } else {
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error fetching track data:', error);
            if (error.response?.status !== 404) {
                setMessage('❌ Failed to fetch track record.');
            }
            setIsEditing(false);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Convert strings to numbers
            const submitData = {
                yearExp: parseInt(formData.yearExp),
                totalExpert: parseInt(formData.totalExpert),
                planningDone: parseInt(formData.planningDone),
                happyCustomers: parseInt(formData.happyCustomers)
            };

            // Validate numbers
            for (const [key, value] of Object.entries(submitData)) {
                if (isNaN(value) || value < 0) {
                    setMessage(`❌ ${key} must be a valid positive number.`);
                    setLoading(false);
                    return;
                }
            }

            let response;
            if (isEditing) {
                response = await ourTrackAPI.update(submitData);
                setMessage('✅ Track record updated successfully!');
            } else {
                response = await ourTrackAPI.create(submitData);
                setMessage('✅ Track record created successfully!');
                setIsEditing(true);
            }

            setTrackData(response.data.data);
            setShowForm(false);
            resetForm();

        } catch (error) {
            console.error('Error saving track data:', error);
            setMessage(error.response?.data?.message || '❌ Failed to save track record.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        if (trackData) {
            setFormData({
                yearExp: trackData.yearExp.toString(),
                totalExpert: trackData.totalExpert.toString(),
                planningDone: trackData.planningDone.toString(),
                happyCustomers: trackData.happyCustomers.toString()
            });
        }
        setShowForm(true);
        setMessage('');
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete the track record?')) return;

        setLoading(true);
        try {
            await ourTrackAPI.delete();
            setMessage('✅ Track record deleted successfully!');
            setTrackData(null);
            setIsEditing(false);
            resetForm();
        } catch (error) {
            console.error('Error deleting track data:', error);
            setMessage('❌ Failed to delete track record.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            yearExp: '',
            totalExpert: '',
            planningDone: '',
            happyCustomers: ''
        });
        setShowForm(false);
        setMessage('');
    };

    const StatCard = ({ icon, value, label, color = "primary" }) => (
        <div className="col-md-3 mb-4">
            <div className={`card border-${color} h-100`}>
                <div className="card-body text-center">
                    <div className={`display-4 text-${color} mb-3`}>
                        <i className={icon}></i>
                    </div>
                    <h2 className={`display-5 fw-bold text-${color}`}>
                        {value ? value.toLocaleString() : '0'}
                    </h2>
                    <p className="card-text text-muted">{label}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h2 mb-0">Our Track Record</h1>
                        {isAuthenticated && (
                            <div className="btn-group">
                                {!showForm && (
                                    <>
                                        <button
                                            className="btn btn-primary"
                                            onClick={isEditing ? handleEdit : () => setShowForm(true)}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            {isEditing ? 'Edit Record' : 'Add Record'}
                                        </button>
                                        {isEditing && (
                                            <button
                                                className="btn btn-danger"
                                                onClick={handleDelete}
                                            >
                                                <i className="fas fa-trash me-2"></i>
                                                Delete
                                            </button>
                                        )}
                                    </>
                                )}
                                {showForm && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {message && (
                <div className="row mb-4">
                    <div className="col-12">
                        <Alert
                            message={message}
                            type={message.includes('✅') ? 'success' : 'danger'}
                            onClose={() => setMessage('')}
                        />
                    </div>
                </div>
            )}

            {loading && (
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Track Record Display */}
            {!showForm && (
                <div className="row">
                    <StatCard
                        icon="fas fa-calendar-alt"
                        value={trackData?.yearExp}
                        label="Years of Experience"
                        color="success"
                    />
                    <StatCard
                        icon="fas fa-users"
                        value={trackData?.totalExpert}
                        label="Total Experts"
                        color="info"
                    />
                    <StatCard
                        icon="fas fa-tasks"
                        value={trackData?.planningDone}
                        label="Projects Completed"
                        color="warning"
                    />
                    <StatCard
                        icon="fas fa-smile"
                        value={trackData?.happyCustomers}
                        label="Happy Customers"
                        color="danger"
                    />
                </div>
            )}

            {/* Form for Creating/Editing */}
            {showForm && (
                <div className="row">
                    <div className="col-lg-8 mx-auto">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0">
                                    <i className="fas fa-chart-line me-2"></i>
                                    {isEditing ? 'Edit Track Record' : 'Add Track Record'}
                                </h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="yearExp" className="form-label">
                                                <i className="fas fa-calendar-alt me-2"></i>
                                                Years of Experience *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="yearExp"
                                                name="yearExp"
                                                value={formData.yearExp}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                                placeholder="Enter years of experience"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="totalExpert" className="form-label">
                                                <i className="fas fa-users me-2"></i>
                                                Total Experts *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="totalExpert"
                                                name="totalExpert"
                                                value={formData.totalExpert}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                                placeholder="Enter total number of experts"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="planningDone" className="form-label">
                                                <i className="fas fa-tasks me-2"></i>
                                                Projects Completed *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="planningDone"
                                                name="planningDone"
                                                value={formData.planningDone}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                                placeholder="Enter projects completed"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="happyCustomers" className="form-label">
                                                <i className="fas fa-smile me-2"></i>
                                                Happy Customers *
                                            </label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="happyCustomers"
                                                name="happyCustomers"
                                                value={formData.happyCustomers}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                                placeholder="Enter number of happy customers"
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={resetForm}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    {isEditing ? 'Update' : 'Create'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!loading && !trackData && !showForm && (
                <div className="row">
                    <div className="col-12 text-center py-5">
                        <div className="text-muted">
                            <i className="fas fa-chart-line display-1 mb-3"></i>
                            <h3>No Track Record Found</h3>
                            <p>Add your company's track record to showcase your achievements.</p>
                            {isAuthenticated && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowForm(true)}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Add Track Record
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OurTrack;
