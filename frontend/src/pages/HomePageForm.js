import React, { useState } from 'react';
import { homePageAPI } from '../services/api';
import Alert from '../components/Alert';

const HomePageForm = () => {
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        button: {
            text: '',
            link: ''
        },
        image: {
            url: '',
            altText: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('button.')) {
            const buttonField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                button: {
                    ...prev.button,
                    [buttonField]: value
                }
            }));
        } else if (name.startsWith('image.')) {
            const imageField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                image: {
                    ...prev.image,
                    [imageField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await homePageAPI.create(formData);

            setMessage('Homepage content created successfully!');
            setFormData({
                heading: '',
                description: '',
                button: {
                    text: '',
                    link: ''
                },
                image: {
                    url: '',
                    altText: ''
                }
            });
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to create homepage content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-md-10 mx-auto">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Create Homepage Content</h3>
                        </div>
                        <div className="card-body">
                            {message && (
                                <Alert
                                    message={message}
                                    type={message.includes('success') ? 'success' : 'danger'}
                                    onClose={() => setMessage('')}
                                />
                            )}

                            <form onSubmit={handleSubmit}>
                                {/* Heading */}
                                <div className="mb-3">
                                    <label htmlFor="heading" className="form-label">Heading *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="heading"
                                        name="heading"
                                        value={formData.heading}
                                        onChange={handleChange}
                                        placeholder="Enter main heading for homepage"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description *</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows="4"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter description for homepage"
                                        required
                                    ></textarea>
                                </div>

                                {/* Button Section */}
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Button Configuration</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="button.text" className="form-label">Button Text *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="button.text"
                                                    name="button.text"
                                                    value={formData.button.text}
                                                    onChange={handleChange}
                                                    placeholder="e.g., Get Started, Learn More"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="button.link" className="form-label">Button Link *</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    id="button.link"
                                                    name="button.link"
                                                    value={formData.button.link}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/page"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="card mb-3">
                                    <div className="card-header">
                                        <h5 className="card-title mb-0">Image Configuration</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-8 mb-3">
                                                <label htmlFor="image.url" className="form-label">Image URL *</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    id="image.url"
                                                    name="image.url"
                                                    value={formData.image.url}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/image.jpg"
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="image.altText" className="form-label">Alt Text *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="image.altText"
                                                    name="image.altText"
                                                    value={formData.image.altText}
                                                    onChange={handleChange}
                                                    placeholder="Image description"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {formData.image.url && (
                                            <div className="mt-3">
                                                <label className="form-label">Image Preview:</label>
                                                <div className="border rounded p-2">
                                                    <img
                                                        src={formData.image.url}
                                                        alt={formData.image.altText}
                                                        className="img-fluid"
                                                        style={{ maxHeight: '200px' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Homepage Content'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePageForm;
