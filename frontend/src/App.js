import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Home from './pages/home/Home';
import AboutUs from './pages/about/AboutUs';
import AdminCareer from './pages/career/AdminCareer';
import PublicCareer from './pages/career/PublicCareer';
import AdminPartner from './pages/partner/AdminPartner';
import PublicPartner from './pages/partner/BecomePartner';
import PartnerFAQs from './pages/partner/PartnerFAQs';
import ContactForm from './pages/ContactForm';
import CareerForm from './pages/career/CareerForm';
import AdminInquiries from './pages/AdminInquiries';
import AdminApplications from './pages/AdminApplications';
import HomePageForm from './pages/home/HomePageForm';
import AdminHomePage from './pages/home/AdminHomePage';
import { Service1, Service2, Service3, Service4, Service5, Service6, Service7, Service8 } from './pages/Services';
import ServicesOverview from './pages/ServicesOverview';
import Sections from './pages/sections/Sections';
import Reviews from './pages/sections/Reviews';
import Ads from './pages/sections/Ads';
import AdminFooter from './pages/sections/AdminFooter';
import LoginForm from './components/admin-forms/LoginForm';
import RegisterForm from './components/admin-forms/RegisterForm';

// Component to handle layout with conditional sidebar
const AppLayout = () => {
    const location = useLocation();

    // Pages that should not show the sidebar
    const noSidebarPages = ['/login', '/admin/login', '/admin/register', '/public-career'];
    const showSidebar = !noSidebarPages.includes(location.pathname);

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="d-flex flex-fill">
                {showSidebar && <Sidebar />}
                <div className={`app-content ${showSidebar ? 'flex-fill' : 'w-100'} d-flex flex-column`}>
                    <main className="flex-fill">
                        <Routes>
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/home" element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            } />
                            <Route path="/about-us" element={
                                <ProtectedRoute>
                                    <AboutUs />
                                </ProtectedRoute>
                            } />
                            <Route path="/career" element={
                                <ProtectedRoute>
                                    <AdminCareer />
                                </ProtectedRoute>
                            } />
                            <Route path="/public-career" element={<PublicCareer />} />
                            <Route path="/partner" element={
                                <ProtectedRoute>
                                    <AdminPartner />
                                </ProtectedRoute>
                            } />
                            <Route path="/partner-faqs" element={<PartnerFAQs />} />
                            <Route path="/public-partner" element={<PublicPartner />} />
                            <Route path="/sections" element={
                                <ProtectedRoute>
                                    <Sections />
                                </ProtectedRoute>
                            } />
                            <Route path="/sections/reviews" element={<Reviews />} />
                            <Route path="/sections/ads" element={<Ads />} />
                            <Route path="/sections/footer" element={<AdminFooter />} />
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
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/admin/register" element={<RegisterForm />} />
                        </Routes>
                    </main>
                    {/* Show footer (which includes OptimizeStrategy) only on footer admin page for preview */}
                    {location.pathname === '/sections/footer' && <Footer />}
                </div>
            </div>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppLayout />
            </Router>
        </AuthProvider>
    );
}

export default App;
