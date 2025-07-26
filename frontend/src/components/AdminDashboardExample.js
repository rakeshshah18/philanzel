import React, { useState } from 'react';
import { useProtectedAdminOperations } from '../hooks/useProtectedAdminOperations';
import ProtectedRoute from '../components/ProtectedRoute';
import Alert from '../components/Alert';

const AdminDashboardExample = () => {
    const {
        homepageOperations,
        newsOperations,
        canPerformOperation,
        getPermissionMessage
    } = useProtectedAdminOperations();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleCreateHomepage = async () => {
        if (!canPerformOperation()) {
            setMessage(getPermissionMessage());
            return;
        }

        setLoading(true);
        try {
            const result = await homepageOperations.create({
                title: 'Test Homepage',
                content: 'This is a test homepage content',
                isActive: true
            });

            if (result.success) {
                setMessage('Homepage created successfully!');
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNews = async () => {
        if (!canPerformOperation()) {
            setMessage(getPermissionMessage());
            return;
        }

        setLoading(true);
        try {
            const result = await newsOperations.create({
                title: 'Test News Article',
                content: 'This is a test news article content',
                category: 'General',
                isPublished: true
            });

            if (result.success) {
                setMessage('News article created successfully!');
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
            <div className="container mt-4">
                <h1>Admin Dashboard</h1>
                <p>This page demonstrates protected admin operations</p>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h5>Homepage Management</h5>
                            </div>
                            <div className="card-body">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleCreateHomepage}
                                    disabled={loading || !canPerformOperation()}
                                >
                                    {loading ? 'Creating...' : 'Create Homepage'}
                                </button>
                                {!canPerformOperation() && (
                                    <small className="text-danger d-block mt-2">
                                        {getPermissionMessage()}
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h5>News Management</h5>
                            </div>
                            <div className="card-body">
                                <button
                                    className="btn btn-success"
                                    onClick={handleCreateNews}
                                    disabled={loading || !canPerformOperation()}
                                >
                                    {loading ? 'Creating...' : 'Create News'}
                                </button>
                                {!canPerformOperation() && (
                                    <small className="text-danger d-block mt-2">
                                        {getPermissionMessage()}
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {message && (
                    <Alert
                        message={message}
                        type={message.includes('Error') ? 'danger' : 'success'}
                        onClose={() => setMessage('')}
                        className="mt-3"
                    />
                )}
            </div>
        </ProtectedRoute>
    );
};

export default AdminDashboardExample;
