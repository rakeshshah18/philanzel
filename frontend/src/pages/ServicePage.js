import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { servicesAPI } from '../services/api';
import axios from 'axios';

const ServicePage = () => {
    const { serviceName } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        servicesAPI.getAll()
            .then(res => {
                const found = res.data.data.find(s => s.name.replace(/\s+/g, '-').toLowerCase() === serviceName);
                setService(found || null);
                setLoading(false);
            })
            .catch(() => {
                setService(null);
                setLoading(false);
            });
    }, [serviceName]);

    if (loading) return <div>Loading...</div>;
    if (!service) return <div>Service not found.</div>;

    return (
        <div>
            <h1>{service.name}</h1>
            <p>{service.description}</p>
            {service.sections && service.sections.length > 0 && (
                <div>
                    <h2>Sections</h2>
                    {service.sections.map((section, idx) => (
                        <div key={idx} style={{ marginBottom: '1.5rem' }}>
                            <h3>{section.title}</h3>
                            <p>{section.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServicePage;
