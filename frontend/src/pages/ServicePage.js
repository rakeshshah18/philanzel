import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ServicePage = () => {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/services/slug/${serviceId}`)
            .then(res => {
                console.log('API response:', res.data);
                console.log('Service object:', res.data.data);
                setService(res.data.data || null);
                setLoading(false);
            })
            .catch((err) => {
                console.log('API error:', err);
                setService(null);
                setLoading(false);
            });
    }, [serviceId]);

    if (loading) return <div>Loading...</div>;
    if (!service) return <div>Service not found.</div>;

    return (
        <div>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            {/* <pre style={{ background: '#f8f9fa', padding: '10px', fontSize: '12px', border: '1px solid #eee', marginBottom: '1rem' }}>
                Debug: {JSON.stringify(service, null, 2)}
            </pre> */}
            {service.sections && service.sections.length > 0 && (
                <div>
                    <h2>Sections</h2>
                    {service.sections.map((section, idx) => (
                        <div key={section._id || idx} style={{ marginBottom: '1.5rem', border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                            <h3>{section.title}</h3>
                            <p>{section.content}</p>
                            {section.image && (
                                <img src={section.image} alt={section.title} style={{ maxWidth: 200, marginTop: 8 }} />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicePage;