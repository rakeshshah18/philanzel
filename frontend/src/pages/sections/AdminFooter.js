import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { footerAPI } from '../../services/api';

const AdminFooter = () => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('about');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [editingItem, setEditingItem] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [showQuickLinkModal, setShowQuickLinkModal] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [showCalculatorModal, setShowCalculatorModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [showStrategyModal, setShowStrategyModal] = useState(false);
    const [showSocialModal, setShowSocialModal] = useState(false);
    const [editingQuickLink, setEditingQuickLink] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [editingCalculator, setEditingCalculator] = useState(null);
    const [editingStrategy, setEditingStrategy] = useState(null);
    const [editingSocial, setEditingSocial] = useState(null);
    const [strategies, setStrategies] = useState([]);
    const [strategyForm, setStrategyForm] = useState({
        heading: '',
        description: '',
        order: 1,
        isActive: true,
        isVisible: true
    });
    const [aboutForm, setAboutForm] = useState({
        description: '',
        readMoreButton: {
            text: '',
            url: '',
            isEnabled: true
        }
    });
    const [quickLinkForm, setQuickLinkForm] = useState({
        title: '',
        url: '',
        order: 1,
        isEnabled: true
    });
    const [serviceForm, setServiceForm] = useState({
        title: '',
        url: '',
        order: 1,
        isEnabled: true
    });
    const [calculatorForm, setCalculatorForm] = useState({
        title: '',
        url: '',
        order: 1,
        isEnabled: true
    });
    const [contactForm, setContactForm] = useState({
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        phoneNumber: {
            primary: '',
            secondary: ''
        },
        email: {
            primary: '',
            secondary: ''
        }
    });
    const [legalForm, setLegalForm] = useState({
        privacyPolicy: {
            title: 'Privacy Policy',
            description: ''
        },
        termsOfService: {
            title: 'Terms of Service',
            description: ''
        },
        legalDisclaimer: {
            title: 'Legal Disclaimer',
            description: ''
        }
    });
    const [socialForm, setSocialForm] = useState({
        platform: 'Facebook',
        url: '',
        icon: 'fab fa-facebook',
        isEnabled: true,
        order: 1
    });
    useEffect(() => {
        fetchFooterData();
        fetchStrategies();
    }, []);
    const fetchFooterData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await footerAPI.admin.get();
            if (response.data.success) {
                let footerData = response.data.data;
                if (!footerData.quickLinks || !footerData.quickLinks.links || footerData.quickLinks.links.length === 0) {
                    const defaultQuickLinks = [
                        {
                            title: 'Home',
                            url: '/',
                            order: 1,
                            isActive: true
                        },
                        {
                            title: 'About Us',
                            url: '/about-us',
                            order: 2,
                            isActive: true
                        }
                    ];
                    for (const link of defaultQuickLinks) {
                        try {
                            await footerAPI.admin.addQuickLink(link);
                        } catch (error) {
                        }
                    }
                    const updatedResponse = await footerAPI.admin.get();
                    if (updatedResponse.data.success) {
                        footerData = updatedResponse.data.data;
                    }
                }
                setFooterData(footerData);
                setLegalForm({
                    privacyPolicy: {
                        title: footerData.privacyPolicy?.title || 'Privacy Policy',
                        description: footerData.privacyPolicy?.description || ''
                    },
                    termsOfService: {
                        title: footerData.termsOfService?.title || 'Terms of Service',
                        description: footerData.termsOfService?.description || ''
                    },
                    legalDisclaimer: {
                        title: footerData.legalDisclaimer?.title || 'Legal Disclaimer',
                        description: footerData.legalDisclaimer?.description || ''
                    }
                });
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
    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };
    const handleSave = async (section, data) => {
        try {
            setSaving(true);
            const updateData = { [section]: data };
            const response = await footerAPI.admin.update(updateData);
            if (response.data.success) {
                setFooterData(response.data.data);
                if (section === 'legal') {
                    setLegalForm({
                        privacyPolicy: {
                            title: response.data.data.privacyPolicy?.title || 'Privacy Policy',
                            description: response.data.data.privacyPolicy?.description || ''
                        },
                        termsOfService: {
                            title: response.data.data.termsOfService?.title || 'Terms of Service',
                            description: response.data.data.termsOfService?.description || ''
                        },
                        legalDisclaimer: {
                            title: response.data.data.legalDisclaimer?.title || 'Legal Disclaimer',
                            description: response.data.data.legalDisclaimer?.description || ''
                        }
                    });
                }
                showMessage('success', 'Footer updated successfully!');
            } else {
                showMessage('error', 'Failed to update footer');
            }
        } catch (error) {
            console.error('Error updating footer:', error);
            showMessage('error', 'Failed to update footer');
        } finally {
            setSaving(false);
        }
    };
    const addQuickLink = async (linkData) => {
        try {
            const response = await footerAPI.admin.addQuickLink(linkData);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Quick link added successfully!');
                setShowAddModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to add quick link');
        }
    };
    const updateQuickLink = async (id, linkData) => {
        try {
            const response = await footerAPI.admin.updateQuickLink(id, linkData);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Quick link updated successfully!');
                setEditingQuickLink(null);
                setShowQuickLinkModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to update quick link');
        }
    };
    const deleteQuickLink = async (id) => {
        if (!window.confirm('Are you sure you want to delete this quick link?')) return;
        try {
            const response = await footerAPI.admin.deleteQuickLink(id);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Quick link deleted successfully!');
            }
        } catch (error) {
            showMessage('error', 'Failed to delete quick link');
        }
    };
    const addService = async (serviceData) => {
        try {
            const response = await footerAPI.admin.addService(serviceData);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Service added successfully!');
                setShowAddModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to add service');
        }
    };
    const addCalculator = async (calculatorData) => {
        try {
            const response = await footerAPI.admin.addCalculator(calculatorData);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Calculator added successfully!');
                setShowAddModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to add calculator');
        }
    };
    const addSocialLink = async (socialData) => {
        try {
            const response = await footerAPI.admin.addSocialLink(socialData);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Social link added successfully!');
                setShowAddModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to add social link');
        }
    };
    const handleInputChange = (section, field, value) => {
        setFooterData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };
    const handleNestedInputChange = (section, subSection, field, value) => {
        setFooterData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [subSection]: {
                    ...prev[section][subSection],
                    [field]: value
                }
            }
        }));
    };
    const deleteService = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            const response = await footerAPI.admin.deleteService(id);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Service deleted successfully!');
            }
        } catch (error) {
            showMessage('error', 'Failed to delete service');
        }
    };
    const deleteCalculator = async (id) => {
        if (!window.confirm('Are you sure you want to delete this calculator?')) return;
        try {
            const response = await footerAPI.admin.deleteCalculator(id);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Calculator deleted successfully!');
            }
        } catch (error) {
            showMessage('error', 'Failed to delete calculator');
        }
    };
    const updateService = async (id, serviceData) => {
        try {
            const response = await footerAPI.admin.updateService(id, serviceData);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Service updated successfully!');
                setEditingService(null);
                setShowServiceModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to update service');
        }
    };
    const updateCalculator = async (id, calculatorData) => {
        try {
            const response = await footerAPI.admin.updateCalculator(id, calculatorData);
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Calculator updated successfully!');
                setEditingCalculator(null);
                setShowCalculatorModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to update calculator');
        }
    };
    const handleAboutSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await footerAPI.admin.update({
                aboutUs: aboutForm
            });
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'About Us updated successfully!');
                setShowAboutModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to update About Us');
        } finally {
            setSaving(false);
        }
    };
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const response = await footerAPI.admin.update({
                contactUs: contactForm
            });
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', 'Contact information updated successfully!');
                setShowContactModal(false);
            }
        } catch (error) {
            showMessage('error', 'Failed to update contact information');
        } finally {
            setSaving(false);
        }
    };
    const handleSocialSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            let updatedSocialLinks = [...(footerData.contactUs?.followUs?.socialLinks || [])];
            if (editingSocial !== null) {
                updatedSocialLinks[editingSocial] = { ...socialForm };
            } else {
                updatedSocialLinks.push({ ...socialForm });
            }
            const response = await footerAPI.admin.update({
                contactUs: {
                    ...footerData.contactUs,
                    followUs: {
                        ...footerData.contactUs.followUs,
                        socialLinks: updatedSocialLinks
                    }
                }
            });
            if (response.data.success) {
                setFooterData(response.data.data);
                showMessage('success', editingSocial !== null ? 'Social link updated successfully!' : 'Social link added successfully!');
                setShowSocialModal(false);
                setEditingSocial(null);
            }
        } catch (error) {
            showMessage('error', 'Failed to save social link');
        } finally {
            setSaving(false);
        }
    };
    const openAboutModal = () => {
        setAboutForm({
            description: footerData?.aboutUs?.description || '',
            readMoreButton: {
                text: footerData?.aboutUs?.readMoreButton?.text || 'Read More',
                url: footerData?.aboutUs?.readMoreButton?.url || '/about',
                isEnabled: footerData?.aboutUs?.readMoreButton?.isEnabled !== false
            }
        });
        setShowAboutModal(true);
    };
    const openQuickLinkModal = (link = null, index = null) => {
        if (link) {
            setEditingQuickLink(index);
            setQuickLinkForm({
                title: link.title || '',
                url: link.url || '',
                order: link.order || 1,
                isEnabled: link.isEnabled !== false
            });
        } else {
            setEditingQuickLink(null);
            setQuickLinkForm({
                title: '',
                url: '',
                order: 1,
                isEnabled: true
            });
        }
        setShowQuickLinkModal(true);
    };
    const openServiceModal = (service = null, index = null) => {
        if (service) {
            setEditingService(index);
            setServiceForm({
                title: service.title || '',
                url: service.url || '',
                order: service.order || 1,
                isEnabled: service.isEnabled !== false
            });
        } else {
            setEditingService(null);
            setServiceForm({
                title: '',
                url: '',
                order: 1,
                isEnabled: true
            });
        }
        setShowServiceModal(true);
    };
    const openCalculatorModal = (calculator = null, index = null) => {
        if (calculator) {
            setEditingCalculator(index);
            setCalculatorForm({
                title: calculator.title || '',
                url: calculator.url || '',
                order: calculator.order || 1,
                isEnabled: calculator.isEnabled !== false
            });
        } else {
            setEditingCalculator(null);
            setCalculatorForm({
                title: '',
                url: '',
                order: 1,
                isEnabled: true
            });
        }
        setShowCalculatorModal(true);
    };
    const openContactModal = () => {
        setContactForm({
            address: {
                street: footerData?.contactUs?.address?.street || '',
                city: footerData?.contactUs?.address?.city || '',
                state: footerData?.contactUs?.address?.state || '',
                zipCode: footerData?.contactUs?.address?.zipCode || '',
                country: footerData?.contactUs?.address?.country || ''
            },
            phoneNumber: {
                primary: footerData?.contactUs?.phoneNumber?.primary || '',
                secondary: footerData?.contactUs?.phoneNumber?.secondary || ''
            },
            email: {
                primary: footerData?.contactUs?.email?.primary || '',
                secondary: footerData?.contactUs?.email?.secondary || ''
            }
        });
        setShowContactModal(true);
    };
    const openSocialModal = (index = null) => {
        if (index !== null) {
            const link = footerData.contactUs.followUs.socialLinks[index];
            setEditingSocial(index);
            setSocialForm({
                platform: link.platform || 'Facebook',
                url: link.url || '',
                icon: link.icon || 'fab fa-facebook',
                isEnabled: link.isEnabled || true,
                order: link.order || 1
            });
        } else {
            setEditingSocial(null);
            setSocialForm({
                platform: 'Facebook',
                url: '',
                icon: 'fab fa-facebook',
                isEnabled: true,
                order: 1
            });
        }
        setShowSocialModal(true);
    };
    const deleteSocialLink = async (index) => {
        if (window.confirm('Are you sure you want to delete this social link?')) {
            try {
                setSaving(true);
                const updatedSocialLinks = [...footerData.contactUs.followUs.socialLinks];
                updatedSocialLinks.splice(index, 1);
                const response = await footerAPI.admin.update({
                    contactUs: {
                        ...footerData.contactUs,
                        followUs: {
                            ...footerData.contactUs.followUs,
                            socialLinks: updatedSocialLinks
                        }
                    }
                });
                if (response.data.success) {
                    setFooterData(response.data.data);
                    showMessage('success', 'Social link deleted successfully!');
                }
            } catch (error) {
                showMessage('error', 'Failed to delete social link');
            } finally {
                setSaving(false);
            }
        }
    };
    const handleQuickLinkSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (editingQuickLink !== null) {
                await updateQuickLink(editingQuickLink, quickLinkForm);
            } else {
                const response = await footerAPI.admin.addQuickLink(quickLinkForm);
                if (response.data.success) {
                    await fetchFooterData();
                    showMessage('success', 'Quick link added successfully!');
                    setShowQuickLinkModal(false);
                    setEditingQuickLink(null);
                }
            }
        } catch (error) {
            showMessage('error', 'Failed to save quick link');
        } finally {
            setSaving(false);
        }
    };
    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (editingService !== null) {
                await updateService(editingService, serviceForm);
            } else {
                const response = await footerAPI.admin.addService(serviceForm);
                if (response.data.success) {
                    await fetchFooterData();
                    showMessage('success', 'Service added successfully!');
                    setShowServiceModal(false);
                    setEditingService(null);
                }
            }
        } catch (error) {
            showMessage('error', 'Failed to save service');
        } finally {
            setSaving(false);
        }
    };
    const handleCalculatorSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (editingCalculator !== null) {
                await updateCalculator(editingCalculator, calculatorForm);
            } else {
                const response = await footerAPI.admin.addCalculator(calculatorForm);
                if (response.data.success) {
                    await fetchFooterData();
                    showMessage('success', 'Calculator added successfully!');
                    setShowCalculatorModal(false);
                    setEditingCalculator(null);
                }
            }
        } catch (error) {
            showMessage('error', 'Failed to save calculator');
        } finally {
            setSaving(false);
        }
    };
    const closeQuickLinkModal = () => {
        setShowQuickLinkModal(false);
        setEditingQuickLink(null);
        setQuickLinkForm({
            title: '',
            url: '',
            order: 1,
            isEnabled: true
        });
    };
    const closeServiceModal = () => {
        setShowServiceModal(false);
        setEditingService(null);
        setServiceForm({
            title: '',
            url: '',
            order: 1,
            isEnabled: true
        });
    };
    const closeCalculatorModal = () => {
        setShowCalculatorModal(false);
        setEditingCalculator(null);
        setCalculatorForm({
            title: '',
            url: '',
            order: 1,
            isEnabled: true
        });
    };
    const closeAboutModal = () => {
        setShowAboutModal(false);
        setAboutForm({
            description: '',
            readMoreButton: {
                text: '',
                url: '',
                isEnabled: true
            }
        });
    };
    const closeContactModal = () => {
        setShowContactModal(false);
        setContactForm({
            address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
            },
            phoneNumber: {
                primary: '',
                secondary: ''
            },
            email: {
                primary: '',
                secondary: ''
            }
        });
    };
    const fetchStrategies = async () => {
        try {
            const response = await footerAPI.admin.optimizeStrategy.getAll();
            if (response.data.success) {
                setStrategies(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching strategies:', error);
            showMessage('error', 'Failed to load strategies');
        }
    };
    const openStrategyModal = (strategy = null, index = null) => {
        if (strategy) {
            setEditingStrategy(index);
            setStrategyForm({
                heading: strategy.heading || '',
                description: strategy.description || '',
                order: strategy.order || 1,
                isActive: strategy.isActive !== false,
                isVisible: strategy.isVisible !== false
            });
        } else {
            setEditingStrategy(null);
            setStrategyForm({
                heading: '',
                description: '',
                order: strategies.length + 1,
                isActive: true,
                isVisible: true
            });
        }
        setShowStrategyModal(true);
    };
    const closeStrategyModal = () => {
        setShowStrategyModal(false);
        setEditingStrategy(null);
        setStrategyForm({
            heading: '',
            description: '',
            order: 1,
            isActive: true,
            isVisible: true
        });
    };
    const closeSocialModal = () => {
        setShowSocialModal(false);
        setEditingSocial(null);
        setSocialForm({
            platform: 'Facebook',
            url: '',
            icon: 'fab fa-facebook',
            isEnabled: true,
            order: 1
        });
    };
    const handleStrategySubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (editingStrategy !== null) {
                const strategyId = strategies[editingStrategy]._id;
                await footerAPI.admin.optimizeStrategy.update(strategyId, strategyForm);
                showMessage('success', 'Strategy updated successfully!');
            } else {
                await footerAPI.admin.optimizeStrategy.create(strategyForm);
                showMessage('success', 'Strategy added successfully!');
            }
            await fetchStrategies();
            setShowStrategyModal(false);
            setEditingStrategy(null);
        } catch (error) {
            showMessage('error', 'Failed to save strategy');
        } finally {
            setSaving(false);
        }
    };
    const deleteStrategy = async (index) => {
        if (window.confirm('Are you sure you want to delete this strategy?')) {
            try {
                setSaving(true);
                const strategyId = strategies[index]._id;
                await footerAPI.admin.optimizeStrategy.delete(strategyId);
                showMessage('success', 'Strategy deleted successfully!');
                await fetchStrategies();
            } catch (error) {
                showMessage('error', 'Failed to delete strategy');
            } finally {
                setSaving(false);
            }
        }
    };
    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body text-center py-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading footer data...</span>
                                </div>
                                <p className="mt-3">Loading footer data...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (error || !footerData) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-danger">
                            <h4>Error</h4>
                            <p>{error || 'Failed to load footer data'}</p>
                            <button className="btn btn-primary" onClick={fetchFooterData}>
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0">
                                <i className="fas fa-window-minimize me-2"></i>
                                Footer Management
                            </h4>
                        </div>
                        <div className="card-body">
                            {message.text && (
                                <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
                                    {message.text}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setMessage({ type: '', text: '' })}
                                    ></button>
                                </div>
                            )}
                            <ul className="nav nav-tabs mb-4 ">
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('about')}
                                        style={{
                                            color: activeTab === 'about' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'about' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        About Us
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'quickLinks' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('quickLinks')}
                                        style={{
                                            color: activeTab === 'quickLinks' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'quickLinks' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        Quick Links
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('services')}
                                        style={{
                                            color: activeTab === 'services' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'services' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        Our Services
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'calculators' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('calculators')}
                                        style={{
                                            color: activeTab === 'calculators' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'calculators' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        Calculators
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('contact')}
                                        style={{
                                            color: activeTab === 'contact' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'contact' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        Contact Us
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'legal' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('legal')}
                                        style={{
                                            color: activeTab === 'legal' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'legal' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        Legal
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'strategy' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('strategy')}
                                        style={{
                                            color: activeTab === 'strategy' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'strategy' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        Optimize Strategy
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className={`nav-link ${activeTab === 'copyright' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('copyright')}
                                        style={{
                                            color: activeTab === 'copyright' ? '#fff' : 'black',
                                            backgroundColor: activeTab === 'copyright' ? '#373D4D' : 'transparent'
                                        }}
                                    >
                                        Copyright
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content">
                                {activeTab === 'about' && (
                                    <div className="tab-pane active">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">About Us Section</h5>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={openAboutModal}
                                            >
                                                <i className="fas fa-edit me-1"></i>Edit About Us
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Field</th>
                                                        <th>Content</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><strong>Description</strong></td>
                                                        <td>
                                                            <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                                {footerData.aboutUs?.description || 'No description set'}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${footerData.aboutUs?.description ? 'bg-success' : 'bg-warning'}`}>
                                                                {footerData.aboutUs?.description ? 'Set' : 'Not Set'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Read More Button</strong></td>
                                                        <td>
                                                            {footerData.aboutUs?.readMoreButton?.text || 'Not configured'}
                                                            {footerData.aboutUs?.readMoreButton?.url && (
                                                                <><br /><small className="text-muted">{footerData.aboutUs.readMoreButton.url}</small></>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${footerData.aboutUs?.readMoreButton?.isEnabled ? 'bg-success' : 'bg-secondary'}`}>
                                                                {footerData.aboutUs?.readMoreButton?.isEnabled ? 'Enabled' : 'Disabled'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'contact' && (
                                    <div className="tab-pane active">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">Contact Information</h5>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={openContactModal}
                                            >
                                                <i className="fas fa-edit me-1"></i>Edit Contact Info
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Category</th>
                                                        <th>Details</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td><strong>Address</strong></td>
                                                        <td>
                                                            {footerData.contactUs?.address?.street && (
                                                                <>
                                                                    {footerData.contactUs.address.street}<br />
                                                                    {footerData.contactUs.address.city}, {footerData.contactUs.address.state} {footerData.contactUs.address.zipCode}<br />
                                                                    {footerData.contactUs.address.country}
                                                                </>
                                                            )}
                                                            {!footerData.contactUs?.address?.street && 'No address set'}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${footerData.contactUs?.address?.street ? 'bg-success' : 'bg-warning'}`}>
                                                                {footerData.contactUs?.address?.street ? 'Set' : 'Not Set'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Phone Numbers</strong></td>
                                                        <td>
                                                            {footerData.contactUs?.phoneNumber?.primary && (
                                                                <>Primary: {footerData.contactUs.phoneNumber.primary}<br /></>
                                                            )}
                                                            {footerData.contactUs?.phoneNumber?.secondary && (
                                                                <>Secondary: {footerData.contactUs.phoneNumber.secondary}</>
                                                            )}
                                                            {!footerData.contactUs?.phoneNumber?.primary && 'No phone number set'}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${footerData.contactUs?.phoneNumber?.primary ? 'bg-success' : 'bg-warning'}`}>
                                                                {footerData.contactUs?.phoneNumber?.primary ? 'Set' : 'Not Set'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td><strong>Email Addresses</strong></td>
                                                        <td>
                                                            {footerData.contactUs?.email?.primary && (
                                                                <>Primary: {footerData.contactUs.email.primary}<br /></>
                                                            )}
                                                            {footerData.contactUs?.email?.secondary && (
                                                                <>Secondary: {footerData.contactUs.email.secondary}</>
                                                            )}
                                                            {!footerData.contactUs?.email?.primary && 'No email address set'}
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${footerData.contactUs?.email?.primary ? 'bg-success' : 'bg-warning'}`}>
                                                                {footerData.contactUs?.email?.primary ? 'Set' : 'Not Set'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-4">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="mb-0">Social Media Links</h6>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => setShowSocialModal(true)}
                                                >
                                                    <i className="fas fa-plus me-1"></i>Add Social Link
                                                </button>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table table-striped table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Platform</th>
                                                            <th>URL</th>
                                                            <th>Status</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {footerData.contactUs?.followUs?.socialLinks?.length > 0 ? (
                                                            footerData.contactUs.followUs.socialLinks.map((link, index) => (
                                                                <tr key={link._id || index}>
                                                                    <td>
                                                                        <i className={link.icon || 'fas fa-link'}></i>
                                                                        <span className="ms-2">{link.platform}</span>
                                                                    </td>
                                                                    <td>
                                                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                                            {link.url}
                                                                        </a>
                                                                    </td>
                                                                    <td>
                                                                        <span className={`badge ${link.isEnabled ? 'bg-success' : 'bg-secondary'}`}>
                                                                            {link.isEnabled ? 'Active' : 'Inactive'}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-outline-primary btn-sm me-1"
                                                                            onClick={() => openSocialModal(index)}
                                                                        >
                                                                            <i className="fas fa-edit"></i>
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-outline-danger btn-sm"
                                                                            onClick={() => deleteSocialLink(index)}
                                                                        >
                                                                            <i className="fas fa-trash"></i>
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="text-center text-muted py-3">
                                                                    No social links added yet. Click "Add Social Link" to get started.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'copyright' && (
                                    <div className="tab-pane active">
                                        <h5 className="mb-3">Copyright Settings</h5>
                                        <div className="row">
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Copyright Text</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={footerData.copyrightText || ''}
                                                    onChange={(e) => setFooterData(prev => ({ ...prev, copyrightText: e.target.value }))}
                                                    placeholder="© {year} Company Name. All rights reserved."
                                                />
                                                <small className="text-muted">Use {'{year}'} to automatically insert the current year</small>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-check mb-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={footerData.isActive || false}
                                                        onChange={(e) => setFooterData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                    />
                                                    <label className="form-check-label">
                                                        Footer Active
                                                    </label>
                                                </div>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handleSave('general', {
                                                        copyrightText: footerData.copyrightText,
                                                        isActive: footerData.isActive
                                                    })}
                                                    disabled={saving}
                                                >
                                                    {saving ? 'Saving...' : 'Save Copyright'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'legal' && (
                                    <div className="tab-pane active">
                                        <h5 className="mb-4">Legal Pages Management</h5>
                                        <div className="mb-4 border rounded p-3">
                                            <h6 className="text-primary mb-3">Privacy Policy</h6>
                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={legalForm.privacyPolicy.title}
                                                    onChange={(e) => setLegalForm(prev => ({
                                                        ...prev,
                                                        privacyPolicy: {
                                                            ...prev.privacyPolicy,
                                                            title: e.target.value
                                                        }
                                                    }))}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Description</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={legalForm.privacyPolicy.description}
                                                    onChange={(value) => setLegalForm(prev => ({
                                                        ...prev,
                                                        privacyPolicy: {
                                                            ...prev.privacyPolicy,
                                                            description: value
                                                        }
                                                    }))}
                                                    placeholder="Enter your privacy policy content here..."
                                                    style={{ height: '200px', marginBottom: '50px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4 border rounded p-3">
                                            <h6 className="text-primary mb-3">Terms of Service</h6>
                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={legalForm.termsOfService.title}
                                                    onChange={(e) => setLegalForm(prev => ({
                                                        ...prev,
                                                        termsOfService: {
                                                            ...prev.termsOfService,
                                                            title: e.target.value
                                                        }
                                                    }))}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Description</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={legalForm.termsOfService.description}
                                                    onChange={(value) => setLegalForm(prev => ({
                                                        ...prev,
                                                        termsOfService: {
                                                            ...prev.termsOfService,
                                                            description: value
                                                        }
                                                    }))}
                                                    placeholder="Enter your terms of service content here..."
                                                    style={{ height: '200px', marginBottom: '50px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4 border rounded p-3">
                                            <h6 className="text-primary mb-3">Legal Disclaimer</h6>
                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={legalForm.legalDisclaimer.title}
                                                    onChange={(e) => setLegalForm(prev => ({
                                                        ...prev,
                                                        legalDisclaimer: {
                                                            ...prev.legalDisclaimer,
                                                            title: e.target.value
                                                        }
                                                    }))}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Description</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={legalForm.legalDisclaimer.description}
                                                    onChange={(value) => setLegalForm(prev => ({
                                                        ...prev,
                                                        legalDisclaimer: {
                                                            ...prev.legalDisclaimer,
                                                            description: value
                                                        }
                                                    }))}
                                                    placeholder="Enter your legal disclaimer content here..."
                                                    style={{ height: '200px', marginBottom: '50px' }}
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleSave('legal', legalForm)}
                                                disabled={saving}
                                            >
                                                {saving ? 'Saving...' : 'Save Legal Pages'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'strategy' && (
                                    <div className="tab-pane active">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">Optimize Strategy Management</h5>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => openStrategyModal()}
                                            >
                                                <i className="fas fa-plus me-2"></i>
                                                Add Strategy
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Description</th>
                                                        <th>Order</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {strategies.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className="text-center text-muted py-4">
                                                                No strategies found. Add your first strategy to get started.
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        strategies.map((strategy, index) => (
                                                            <tr key={strategy._id || index}>
                                                                <td>{strategy.heading}</td>
                                                                <td>
                                                                    <div className="text-truncate" style={{ maxWidth: '300px' }}>
                                                                        {strategy.description}
                                                                    </div>
                                                                </td>
                                                                <td>{strategy.order}</td>
                                                                <td>
                                                                    <span className={`badge ${strategy.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                                                        {strategy.isActive ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary me-1"
                                                                        onClick={() => openStrategyModal(strategy, index)}
                                                                    >
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => deleteStrategy(index)}
                                                                        disabled={saving}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'quickLinks' && (
                                    <div className="tab-pane active">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">Quick Links Management</h5>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => openQuickLinkModal()}
                                            >
                                                <i className="fas fa-plus me-2"></i>
                                                Add Quick Link
                                            </button>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>URL</th>
                                                        <th>Order</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {footerData.quickLinks?.links?.map((link, index) => (
                                                        <tr key={link._id || index}>
                                                            <td>{link.title}</td>
                                                            <td>{link.url}</td>
                                                            <td>{link.order}</td>
                                                            <td>
                                                                <span className={`badge bg-${link.isEnabled ? 'success' : 'secondary'}`}>
                                                                    {link.isEnabled ? 'Enabled' : 'Disabled'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    onClick={() => openQuickLinkModal(link, index)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => deleteQuickLink(index)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {(!footerData.quickLinks?.links || footerData.quickLinks.links.length === 0) && (
                                                <div className="text-center py-4">
                                                    <p className="text-muted">No quick links added yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'services' && (
                                    <div className="tab-pane active">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">Our Services Management</h5>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => openServiceModal()}
                                            >
                                                <i className="fas fa-plus me-2"></i>
                                                Add Service
                                            </button>
                                        </div>
                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Description</th>
                                                        <th>URL</th>
                                                        <th>Order</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {footerData.ourServices?.services?.map((service, index) => (
                                                        <tr key={service._id || index}>
                                                            <td>{service.title}</td>
                                                            <td>{service.description?.substring(0, 50)}...</td>
                                                            <td>{service.url}</td>
                                                            <td>{service.order}</td>
                                                            <td>
                                                                <span className={`badge bg-${service.isEnabled ? 'success' : 'secondary'}`}>
                                                                    {service.isEnabled ? 'Enabled' : 'Disabled'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    onClick={() => openServiceModal(service, index)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => deleteService(index)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {(!footerData.ourServices?.services || footerData.ourServices.services.length === 0) && (
                                                <div className="text-center py-4">
                                                    <p className="text-muted">No services added yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'calculators' && (
                                    <div className="tab-pane active">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="mb-0">Calculators Management</h5>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => openCalculatorModal()}
                                            >
                                                <i className="fas fa-plus me-2"></i>
                                                Add Calculator
                                            </button>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Title</th>
                                                        <th>Description</th>
                                                        <th>URL</th>
                                                        <th>Icon</th>
                                                        <th>Order</th>
                                                        <th>Status</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {footerData.calculators?.calculatorList?.map((calc, index) => (
                                                        <tr key={calc._id || index}>
                                                            <td>{calc.title}</td>
                                                            <td>{calc.description?.substring(0, 30)}...</td>
                                                            <td>{calc.url}</td>
                                                            <td>
                                                                {calc.icon && <i className={calc.icon}></i>}
                                                                {calc.icon}
                                                            </td>
                                                            <td>{calc.order}</td>
                                                            <td>
                                                                <span className={`badge bg-${calc.isEnabled ? 'success' : 'secondary'}`}>
                                                                    {calc.isEnabled ? 'Enabled' : 'Disabled'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary me-2"
                                                                    onClick={() => openCalculatorModal(calc, index)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => deleteCalculator(index)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {(!footerData.calculators?.calculatorList || footerData.calculators.calculatorList.length === 0) && (
                                                <div className="text-center py-4">
                                                    <p className="text-muted">No calculators added yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showAboutModal ? 'show' : ''}`} style={{ display: showAboutModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit About Us</h5>
                            <button type="button" className="btn-close" onClick={closeAboutModal}></button>
                        </div>
                        <form onSubmit={handleAboutSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        name="description"
                                        value={aboutForm.description}
                                        onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <h6 className="mb-3">Read More Button</h6>
                                <div className="mb-3">
                                    <label className="form-label">Button Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="buttonText"
                                        value={aboutForm.readMoreButton.text}
                                        onChange={(e) => setAboutForm({
                                            ...aboutForm,
                                            readMoreButton: { ...aboutForm.readMoreButton, text: e.target.value }
                                        })}
                                        placeholder="Read More"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Button URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="buttonUrl"
                                        value={aboutForm.readMoreButton.url}
                                        onChange={(e) => setAboutForm({
                                            ...aboutForm,
                                            readMoreButton: { ...aboutForm.readMoreButton, url: e.target.value }
                                        })}
                                        placeholder="/about, /about-us, https://example.com"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="aboutButtonEnabled"
                                            checked={aboutForm.readMoreButton.isEnabled}
                                            onChange={(e) => setAboutForm({
                                                ...aboutForm,
                                                readMoreButton: { ...aboutForm.readMoreButton, isEnabled: e.target.checked }
                                            })}
                                        />
                                        <label className="form-check-label" htmlFor="aboutButtonEnabled">
                                            Enable Read More Button
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeAboutModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showQuickLinkModal ? 'show' : ''}`} style={{ display: showQuickLinkModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingQuickLink !== null ? 'Edit Quick Link' : 'Add Quick Link'}</h5>
                            <button type="button" className="btn-close" onClick={closeQuickLinkModal}></button>
                        </div>
                        <form onSubmit={handleQuickLinkSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={quickLinkForm.title}
                                        onChange={(e) => setQuickLinkForm({ ...quickLinkForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="url"
                                        value={quickLinkForm.url}
                                        onChange={(e) => setQuickLinkForm({ ...quickLinkForm, url: e.target.value })}
                                        placeholder="/home, /about-us, https://example.com"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Order</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="order"
                                        value={quickLinkForm.order}
                                        onChange={(e) => setQuickLinkForm({ ...quickLinkForm, order: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="isActive"
                                            checked={quickLinkForm.isEnabled}
                                            onChange={(e) => setQuickLinkForm({ ...quickLinkForm, isEnabled: e.target.checked })}
                                        />
                                        <label className="form-check-label">Active</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeQuickLinkModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingQuickLink !== null ? 'Update' : 'Add'} Quick Link</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showServiceModal ? 'show' : ''}`} style={{ display: showServiceModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingService !== null ? 'Edit Service' : 'Add Service'}</h5>
                            <button type="button" className="btn-close" onClick={closeServiceModal}></button>
                        </div>
                        <form onSubmit={handleServiceSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={serviceForm.title}
                                        onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="url"
                                        value={serviceForm.url}
                                        onChange={(e) => setServiceForm({ ...serviceForm, url: e.target.value })}
                                        placeholder="/services, /contact, https://example.com"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Order</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="order"
                                        value={serviceForm.order}
                                        onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="isActive"
                                            checked={serviceForm.isEnabled}
                                            onChange={(e) => setServiceForm({ ...serviceForm, isEnabled: e.target.checked })}
                                        />
                                        <label className="form-check-label">Active</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeServiceModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingService !== null ? 'Update' : 'Add'} Service</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showCalculatorModal ? 'show' : ''}`} style={{ display: showCalculatorModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingCalculator !== null ? 'Edit Calculator' : 'Add Calculator'}</h5>
                            <button type="button" className="btn-close" onClick={closeCalculatorModal}></button>
                        </div>
                        <form onSubmit={handleCalculatorSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={calculatorForm.title}
                                        onChange={(e) => setCalculatorForm({ ...calculatorForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">URL</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="url"
                                        value={calculatorForm.url}
                                        onChange={(e) => setCalculatorForm({ ...calculatorForm, url: e.target.value })}
                                        placeholder="/calculator, /tools, https://example.com"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Order</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="order"
                                        value={calculatorForm.order}
                                        onChange={(e) => setCalculatorForm({ ...calculatorForm, order: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            name="isActive"
                                            checked={calculatorForm.isEnabled}
                                            onChange={(e) => setCalculatorForm({ ...calculatorForm, isEnabled: e.target.checked })}
                                        />
                                        <label className="form-check-label">Active</label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeCalculatorModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">{editingCalculator !== null ? 'Update' : 'Add'} Calculator</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showContactModal ? 'show' : ''}`} style={{ display: showContactModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Contact Information</h5>
                            <button type="button" className="btn-close" onClick={closeContactModal}></button>
                        </div>
                        <form onSubmit={handleContactSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Street Address</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="street"
                                        value={contactForm.address.street}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            address: { ...contactForm.address, street: e.target.value }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="city"
                                        value={contactForm.address.city}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            address: { ...contactForm.address, city: e.target.value }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">State</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="state"
                                        value={contactForm.address.state}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            address: { ...contactForm.address, state: e.target.value }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">ZIP Code</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="zipCode"
                                        value={contactForm.address.zipCode}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            address: { ...contactForm.address, zipCode: e.target.value }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Country</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="country"
                                        value={contactForm.address.country}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            address: { ...contactForm.address, country: e.target.value }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Primary Phone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="primaryPhone"
                                        value={contactForm.phoneNumber.primary}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            phoneNumber: { ...contactForm.phoneNumber, primary: e.target.value }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Secondary Phone (Optional)</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="secondaryPhone"
                                        value={contactForm.phoneNumber.secondary}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            phoneNumber: { ...contactForm.phoneNumber, secondary: e.target.value }
                                        })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Primary Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="primaryEmail"
                                        value={contactForm.email.primary}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            email: { ...contactForm.email, primary: e.target.value }
                                        })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Secondary Email (Optional)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="secondaryEmail"
                                        value={contactForm.email.secondary}
                                        onChange={(e) => setContactForm({
                                            ...contactForm,
                                            email: { ...contactForm.email, secondary: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeContactModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showStrategyModal ? 'show' : ''}`} style={{ display: showStrategyModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingStrategy !== null ? 'Edit' : 'Add'} Strategy</h5>
                            <button type="button" className="btn-close" onClick={closeStrategyModal}></button>
                        </div>
                        <form onSubmit={handleStrategySubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="heading"
                                        value={strategyForm.heading}
                                        onChange={(e) => setStrategyForm({ ...strategyForm, heading: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="description"
                                        value={strategyForm.description}
                                        onChange={(e) => setStrategyForm({ ...strategyForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Order</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="order"
                                        value={strategyForm.order}
                                        onChange={(e) => setStrategyForm({ ...strategyForm, order: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="strategyActive"
                                            checked={strategyForm.isActive}
                                            onChange={(e) => setStrategyForm({ ...strategyForm, isActive: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="strategyActive">
                                            Active Strategy
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="strategyVisible"
                                            checked={strategyForm.isVisible}
                                            onChange={(e) => setStrategyForm({ ...strategyForm, isVisible: e.target.checked })}
                                        />
                                        <label className="form-check-label" htmlFor="strategyVisible">
                                            Visible in Footer
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeStrategyModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingStrategy !== null ? 'Update' : 'Add')} Strategy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={`modal fade ${showSocialModal ? 'show' : ''}`} style={{ display: showSocialModal ? 'block' : 'none' }} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{editingSocial !== null ? 'Edit' : 'Add'} Social Link</h5>
                            <button type="button" className="btn-close" onClick={closeSocialModal}></button>
                        </div>
                        <form onSubmit={handleSocialSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Platform</label>
                                    <select
                                        className="form-control"
                                        value={socialForm.platform}
                                        onChange={(e) => {
                                            const platform = e.target.value;
                                            let icon;
                                            switch (platform) {
                                                case 'Facebook': icon = 'fab fa-facebook'; break;
                                                case 'Instagram': icon = 'fab fa-instagram'; break;
                                                case 'LinkedIn': icon = 'fab fa-linkedin'; break;
                                                case 'YouTube': icon = 'fab fa-youtube'; break;
                                                case 'Twitter': icon = 'fab fa-twitter'; break;
                                                default: icon = 'fas fa-link';
                                            }
                                            setSocialForm({ ...socialForm, platform, icon });
                                        }}
                                        required
                                    >
                                        <option value="Facebook">Facebook</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="YouTube">YouTube</option>
                                        <option value="Twitter">Twitter</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">URL</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={socialForm.url}
                                        onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                                        placeholder="https://..."
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Icon Class</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={socialForm.icon}
                                        onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                                        placeholder="fab fa-facebook"
                                        required
                                    />
                                    <small className="text-muted">FontAwesome icon class (e.g., fab fa-facebook)</small>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Order</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={socialForm.order}
                                                onChange={(e) => setSocialForm({ ...socialForm, order: parseInt(e.target.value) })}
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check mt-4">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={socialForm.isEnabled}
                                                onChange={(e) => setSocialForm({ ...socialForm, isEnabled: e.target.checked })}
                                            />
                                            <label className="form-check-label">
                                                Active
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeSocialModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? 'Saving...' : (editingSocial !== null ? 'Update' : 'Add')} Social Link
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {(showAboutModal || showQuickLinkModal || showServiceModal || showCalculatorModal || showContactModal || showStrategyModal || showSocialModal) &&
                <div className="modal-backdrop fade show"></div>
            }
        </div>
    );
};

export default AdminFooter;
