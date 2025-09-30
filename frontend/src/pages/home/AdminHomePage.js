import React, { useState, useEffect } from 'react';
import { homePageAPI } from '../../services/api';
import { FaSyncAlt, FaTrashAlt, FaFileAlt, FaImage, FaRegCalendarPlus } from 'react-icons/fa';
const AdminHomePage = () => {
    const [homePages, setHomePages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchHomePages();
    }, []);
    const fetchHomePages = async () => {
        try {
            setLoading(true);
            const response = await homePageAPI.getAll();
            setHomePages(response.data.data || []);
        } catch (error) {
            setError('Failed to fetch homepage content');
            console.error('Error fetching homepage content:', error);
        } finally {
            setLoading(false);
        }
    };
    const deleteHomePage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this homepage content?')) {
            return;
        }
        try {
            await homePageAPI.delete(id);
            setHomePages(homePages.filter(page => page._id !== id));
        } catch (error) {
            setError('Failed to delete homepage content');
            console.error('Error deleting homepage content:', error);
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (loading) {
        return (
            <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
                <div className="spinner-border text-primary mb-3" style={{ width: 60, height: 60 }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-muted">Loading homepage content...</h5>
            </div>
        );
    }
    const summaryCards = [
        {
            icon: <FaFileAlt size={28} className="text-primary" />,
            label: 'Total Homepages',
            value: homePages.length,
            bg: 'bg-light',
        },
        {
            icon: <FaImage size={28} className="text-success" />,
            label: 'Images',
            value: homePages.filter(p => p.image && p.image.url).length,
            bg: 'bg-light',
        },
        {
            icon: <FaRegCalendarPlus size={28} className="text-info" />,
            label: 'Latest Created',
            value: homePages.length ? formatDate(homePages[0].createdAt) : 'N/A',
            bg: 'bg-light',
        },
    ];

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4 g-3">
                {summaryCards.map((card, idx) => (
                    <div className="col-12 col-md-4" key={idx}>
                        <div className={`dashboard-summary-card d-flex align-items-center p-3 rounded shadow-sm h-100 ${card.bg}`} style={{ minHeight: 90 }}>
                            <div className="me-3">{card.icon}</div>
                            <div>
                                <div className="fw-bold fs-4">{card.value}</div>
                                <div className="text-muted small">{card.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0">
                            <h3 className="card-title mb-0">Homepage Content Management</h3>
                            <button
                                className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                onClick={fetchHomePages}
                            >
                                <FaSyncAlt className="me-1" /> Refresh
                            </button>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}
                            {homePages.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No homepage content found</p>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {homePages.map((page) => (
                                        <div key={page._id} className="col-12 col-md-6 col-lg-4">
                                            <div className="card h-100 border-0 dashboard-content-card shadow-sm">
                                                <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pb-1">
                                                    <h6 className="card-title mb-0 text-truncate" title={page.heading} style={{ maxWidth: 180 }}>
                                                        {page.heading.length > 30
                                                            ? `${page.heading.substring(0, 30)}...`
                                                            : page.heading
                                                        }
                                                    </h6>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                                        onClick={() => deleteHomePage(page._id)}
                                                        title="Delete"
                                                    >
                                                        <FaTrashAlt className="me-1" /> Delete
                                                    </button>
                                                </div>
                                                <div className="card-body pt-2">
                                                    <h5 className="card-title fw-semibold">{page.heading}</h5>
                                                    <p className="card-text text-muted">
                                                        {page.description.length > 100
                                                            ? `${page.description.substring(0, 100)}...`
                                                            : page.description
                                                        }
                                                    </p>
                                                    <div className="mb-2">
                                                        <span className="fw-semibold">Button:</span>
                                                        <a
                                                            href={page.button.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary ms-2"
                                                        >
                                                            {page.button.text}
                                                        </a>
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="fw-semibold">Image:</span>
                                                        <div className="mt-1">
                                                            <img
                                                                src={page.image.url}
                                                                alt={page.image.altText}
                                                                className="img-fluid rounded border"
                                                                style={{ maxHeight: '120px', maxWidth: '100%', background: '#f8f9fa' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer bg-transparent border-0 text-muted small pt-0">
                                                    <FaRegCalendarPlus className="me-1" /> Created: {formatDate(page.createdAt)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
