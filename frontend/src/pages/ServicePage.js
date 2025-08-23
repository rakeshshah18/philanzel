import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ServicePage = () => {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`/api/services/${serviceId}`)
            .then(res => {
                setService(res.data.data);
                setLoading(false);
            })
            .catch(() => {
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
