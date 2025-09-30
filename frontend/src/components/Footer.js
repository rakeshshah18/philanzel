import React, { useState, useEffect } from 'react';
import { footerAPI } from '../services/api';
const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchFooterData();
    }, []);
    const fetchFooterData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await footerAPI.getPublic();
            if (response.data.success) {
                setFooterData(response.data.data);
            } else {
                setError('Failed to load footer data');
            }
        } catch (error) {
            console.error('Error fetching footer data:', error);
            setError('Failed to load footer data');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <footer className="py-4" style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                <div className="container">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading footer...</span>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
    if (error || !footerData) {
        return (
            <footer className="py-4" style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                <div className="container">
                    <div className="text-center">
                        <p>&copy; {new Date().getFullYear()} Company Name. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        );
    }
    const footerStyle = {
        backgroundColor: footerData.backgroundColor || '#2c3e50',
        color: footerData.textColor || '#ffffff'
    };
    const strategies = footerData.optimizeStrategy?.strategies || [];
    return (
        <>
            {strategies.length > 0 && (
                <section className="optimize-strategy-section py-5">
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
            )}
            <footer style={footerStyle} className="py-5 mt-auto">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 mb-4">
                            <h5 className="mb-3">About Us</h5>
                            <p className="small">{footerData.aboutUs.description}</p>
                            {footerData.aboutUs.readMoreButton && (
                                <a
                                    href={footerData.aboutUs.readMoreButton.url}
                                    className="btn btn-outline-light btn-sm"
                                >
                                    {footerData.aboutUs.readMoreButton.text}
                                </a>
                            )}
                        </div>
                        <div className="col-lg-2 col-md-6 mb-4">
                            <h5 className="mb-3">{footerData.quickLinks.title}</h5>
                            <ul className="list-unstyled">
                                {footerData.quickLinks.links.map((link, index) => (
                                    <li key={index} className="mb-2">
                                        <a
                                            href={link.url}
                                            className="text-decoration-none"
                                            style={{ color: 'inherit', opacity: 0.8 }}
                                            target={link.openInNewTab ? '_blank' : '_self'}
                                            rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
                                            onMouseOver={(e) => e.target.style.opacity = 1}
                                            onMouseOut={(e) => e.target.style.opacity = 0.8}
                                        >
                                            {link.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-4">
                            <h5 className="mb-3">{footerData.ourServices.title}</h5>
                            <ul className="list-unstyled">
                                {footerData.ourServices.services.map((service, index) => (
                                    <li key={index} className="mb-2">
                                        {service.url ? (
                                            <a
                                                href={service.url}
                                                className="text-decoration-none"
                                                style={{ color: 'inherit', opacity: 0.8 }}
                                                onMouseOver={(e) => e.target.style.opacity = 1}
                                                onMouseOut={(e) => e.target.style.opacity = 0.8}
                                                title={service.description}
                                            >
                                                {service.title}
                                            </a>
                                        ) : (
                                            <span style={{ opacity: 0.8 }} title={service.description}>
                                                {service.title}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-2 col-md-6 mb-4">
                            <h5 className="mb-3">{footerData.calculators.title}</h5>
                            <ul className="list-unstyled">
                                {footerData.calculators.calculatorList.map((calculator, index) => (
                                    <li key={index} className="mb-2">
                                        <a
                                            href={calculator.url}
                                            className="text-decoration-none d-flex align-items-center"
                                            style={{ color: 'inherit', opacity: 0.8 }}
                                            onMouseOver={(e) => e.target.style.opacity = 1}
                                            onMouseOut={(e) => e.target.style.opacity = 0.8}
                                            title={calculator.description}
                                        >
                                            {calculator.icon && (
                                                <i className={`${calculator.icon} me-2`}></i>
                                            )}
                                            {calculator.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4">
                            <h5 className="mb-3">{footerData.contactUs.title}</h5>
                            <div className="mb-3">
                                <i className="fas fa-map-marker-alt me-2"></i>
                                <small>{footerData.contactUs.address}</small>
                            </div>
                            <div className="mb-2">
                                <i className="fas fa-phone me-2"></i>
                                <small>
                                    <a
                                        href={`tel:${footerData.contactUs.phoneNumber.primary}`}
                                        className="text-decoration-none"
                                        style={{ color: 'inherit' }}
                                    >
                                        {footerData.contactUs.phoneNumber.primary}
                                    </a>
                                </small>
                            </div>
                            {footerData.contactUs.phoneNumber.secondary && (
                                <div className="mb-2">
                                    <i className="fas fa-phone me-2"></i>
                                    <small>
                                        <a
                                            href={`tel:${footerData.contactUs.phoneNumber.secondary}`}
                                            className="text-decoration-none"
                                            style={{ color: 'inherit' }}
                                        >
                                            {footerData.contactUs.phoneNumber.secondary}
                                        </a>
                                    </small>
                                </div>
                            )}
                            <div className="mb-3">
                                <i className="fas fa-envelope me-2"></i>
                                <small>
                                    <a
                                        href={`mailto:${footerData.contactUs.email.primary}`}
                                        className="text-decoration-none"
                                        style={{ color: 'inherit' }}
                                    >
                                        {footerData.contactUs.email.primary}
                                    </a>
                                </small>
                            </div>
                            <div>
                                <h6 className="mb-2">{footerData.contactUs.followUs.title}</h6>
                                <div className="d-flex gap-2">
                                    {footerData.contactUs.followUs.socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-decoration-none d-inline-flex align-items-center justify-content-center"
                                            style={{
                                                color: 'inherit',
                                                width: '35px',
                                                height: '35px',
                                                borderRadius: '50%',
                                                border: '1px solid rgba(255,255,255,0.3)',
                                                opacity: 0.8
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.opacity = 1;
                                                e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.opacity = 0.8;
                                                e.target.style.backgroundColor = 'transparent';
                                            }}
                                            title={social.platform}
                                        >
                                            {social.icon ? (
                                                <i className={social.icon}></i>
                                            ) : (
                                                <span className="small">{social.platform.charAt(0)}</span>
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <div className="col-md-6">
                            <p className="mb-0 small" style={{ opacity: 0.8 }}>
                                {footerData.copyrightText}
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                            <div className="d-flex flex-wrap justify-content-md-end gap-3">
                                <a
                                    href="/privacy-policy"
                                    className="text-decoration-none small"
                                    style={{ color: 'inherit', opacity: 0.8 }}
                                    onMouseOver={(e) => e.target.style.opacity = 1}
                                    onMouseOut={(e) => e.target.style.opacity = 0.8}
                                >
                                    {footerData.privacyPolicy.title}
                                </a>
                                <a
                                    href="/terms-of-service"
                                    className="text-decoration-none small"
                                    style={{ color: 'inherit', opacity: 0.8 }}
                                    onMouseOver={(e) => e.target.style.opacity = 1}
                                    onMouseOut={(e) => e.target.style.opacity = 0.8}
                                >
                                    {footerData.termsOfService.title}
                                </a>
                                <a
                                    href="/legal-disclaimer"
                                    className="text-decoration-none small"
                                    style={{ color: 'inherit', opacity: 0.8 }}
                                    onMouseOver={(e) => e.target.style.opacity = 1}
                                    onMouseOut={(e) => e.target.style.opacity = 0.8}
                                >
                                    {footerData.legalDisclaimer.title}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;