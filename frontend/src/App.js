import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Home from './pages/home/Home';
import AboutUs from './pages/about/AboutUs';
import ContactForm from './pages/ContactForm';
import CareerForm from './pages/CareerForm';
import AdminInquiries from './pages/AdminInquiries';
import AdminApplications from './pages/AdminApplications';
import HomePageForm from './pages/home/HomePageForm';
import AdminHomePage from './pages/home/AdminHomePage';
import { Service1, Service2, Service3, Service4, Service5, Service6, Service7, Service8 } from './pages/Services';
import ServicesOverview from './pages/ServicesOverview';
import LoginForm from './components/admin-forms/LoginForm';
import RegisterForm from './components/admin-forms/RegisterForm';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex">
                    <Sidebar />
                    <div className="app-content flex-fill">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/home" element={<Home />} />
                            <Route path="/about-us" element={<AboutUs />} />
                            <Route path="/services-overview" element={<ServicesOverview />} />
                            <Route path="/service-1" element={<Service1 />} />
                            <Route path="/service-2" element={<Service2 />} />
                            <Route path="/service-3" element={<Service3 />} />
                            <Route path="/service-4" element={<Service4 />} />
                            <Route path="/service-5" element={<Service5 />} />
                            <Route path="/service-6" element={<Service6 />} />
                            <Route path="/service-7" element={<Service7 />} />
                            <Route path="/service-8" element={<Service8 />} />
                            <Route path="/contact" element={<ContactForm />} />
                            <Route path="/careers" element={<CareerForm />} />
                            <Route path="/admin/inquiries" element={<AdminInquiries />} />
                            <Route path="/admin/applications" element={<AdminApplications />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                            <Route path="/admin/login" element={<LoginForm />} />
                            <Route path="/admin/register" element={<RegisterForm />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
