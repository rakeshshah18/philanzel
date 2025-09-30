import React, { useState, useEffect } from 'react';
import { footerAPI } from '../services/api';
const OptimizeStrategy = () => {
    const [strategies, setStrategies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchStrategies();
    }, []);
    const fetchStrategies = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await footerAPI.getPublic();
            if (response.data.success && response.data.data.optimizeStrategy) {
                const visibleStrategies = response.data.data.optimizeStrategy.filter(strategy => strategy.isVisible);
                setStrategies(visibleStrategies);
            }
        } catch (error) {
            console.error('Error fetching strategies:', error);
            setError('Failed to load strategies');
        } finally {
            setLoading(false);
        }
    };
    if (loading || error || !strategies || strategies.length === 0) {
        return null;
    }
    return (
        <section className="optimize-strategy-section py-5 bg-light">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center mb-5">Optimize Strategy</h2>
                        <div className="row">
                            {strategies.map((strategy, index) => (
                                <div key={strategy._id || index} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{strategy.heading}</h5>
                                            <p className="card-text flex-grow-1">{strategy.description}</p>
                                            {strategy.buttonText && strategy.buttonUrl && (
                                                <div className="mt-auto">
                                                    <a
                                                        href={strategy.buttonUrl}
                                                        className="btn btn-primary"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {strategy.buttonText}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OptimizeStrategy;
