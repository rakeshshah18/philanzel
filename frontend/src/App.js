import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import ContactForm from './pages/ContactForm';
import CareerForm from './pages/CareerForm';
import AdminInquiries from './pages/AdminInquiries';
import AdminApplications from './pages/AdminApplications';
import HomePageForm from './pages/HomePageForm';
import AdminHomePage from './pages/AdminHomePage';
import AdminDashboardExample from './components/AdminDashboardExample';
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
                            <Route path="/contact" element={<ContactForm />} />
                            <Route path="/careers" element={<CareerForm />} />
                            <Route path="/admin/inquiries" element={<AdminInquiries />} />
                            <Route path="/admin/applications" element={<AdminApplications />} />
                            <Route path="/admin/dashboard" element={<AdminDashboardExample />} />
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
