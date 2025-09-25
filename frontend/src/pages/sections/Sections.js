import React, { useState } from 'react';
import ReviewSections from './ReviewSections';
import Alert from '../../components/Alert';

const Sections = () => {
    const [activeTab, setActiveTab] = useState('review');
    const [message, setMessage] = useState('');

    const tabs = [
        { id: 'review', label: '⭐ Review Sections', icon: 'bi bi-star' },
        { id: 'ads', label: '📢 Advertisements', icon: 'bi bi-bullhorn' },
        { id: 'footer', label: '🦶 Footer', icon: 'bi bi-grip-horizontal' },
        { id: 'sidebar', label: '🔧 Sidebar Management', icon: 'bi bi-bars' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'review':
                return <ReviewSections setMessage={setMessage} />;
            case 'ads':
                return (
                    <div className="text-center py-5">
                        <i className="bi bi-bullhorn fa-3x text-muted mb-3"></i>
                        <h4 className="text-muted">Advertisements Section</h4>
                        <p className="text-muted">Coming soon...</p>
                    </div>
                );
            case 'footer':
                return (
                    <div className="text-center py-5">
                        <i className="bi bi-grip-horizontal fa-3x text-muted mb-3"></i>
                        <h4 className="text-muted">Footer Section</h4>
                        <p className="text-muted">Coming soon...</p>
                    </div>
                );
            case 'sidebar':
                return (
                    <div className="text-center py-5">
                        <i className="bi bi-bars fa-3x text-primary mb-3"></i>
                        <h4 className="text-primary">Sidebar Management</h4>
                        <p className="text-muted mb-4">Manage dynamic sidebar navigation items</p>
                        <a href="/sidebar-management" className="btn btn-primary">
                            <i className="bi bi-cogs me-2"></i>
                            Open Sidebar Manager
                        </a>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="bi bi-puzzle-piece me-2"></i>
                                Website Sections Management
                            </h4>
                        </div>
                        <div className="card-body p-0">
                            {message && (
                                <div className="p-3">
                                    <Alert
                                        message={message}
                                        type={message.startsWith('✅') ? 'success' : 'danger'}
                                        onClose={() => setMessage('')}
                                    />
                                </div>
                            )}

                            {/* Tabs Navigation */}
                            <div className="border-bottom">
                                <nav className="nav nav-tabs">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            className={`nav-link px-4 py-3 border-0 ${activeTab === tab.id
                                                ? 'active bg-light text-primary fw-bold'
                                                : 'text-secondary'
                                                }`}
                                            onClick={() => setActiveTab(tab.id)}
                                            style={{
                                                borderBottom: activeTab === tab.id ? '3px solid #0d6efd' : 'none'
                                            }}
                                        >
                                            <i className={`${tab.icon} me-2`}></i>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-4">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sections;
