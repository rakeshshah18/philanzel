import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import ContactForm from './pages/contactUs/ContactForm';
import CareerForm from './pages/career/CareerForm';
import AdminInquiries from './pages/AdminInquiries';
import AdminApplications from './pages/AdminApplications';
import ServicePage from './pages/service pages/ServicePage';
import ServicesOverview from './pages/service pages/ServicesOverview';
import Sections from './pages/sections/Sections';
import Reviews from './pages/sections/Reviews';
import Ads from './pages/sections/Ads';
import AdminFooter from './pages/sections/AdminFooter';
import LoginForm from './components/admin-forms/LoginForm';
import AdminRegisterPage from './pages/AdminRegisterPage';
import ServicesSections from './pages/service pages/ServicesSections';
import Calculators from './pages/calculators/Calculators';
import CalculatorPage from './pages/calculators/CalculatorPage';

// Component to handle layout with conditional sidebar and global sidebar toggle
const AppLayout = () => {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const { admin } = useAuth();

    // Pages that should not show the sidebar
    const noSidebarPages = ['/login', '/admin/login', '/admin/register', '/public-career'];
    const showSidebar = !noSidebarPages.includes(location.pathname);

    // Sidebar width (should match Sidebar.js)
    const sidebarWidth = isSidebarOpen && showSidebar ? 260 : showSidebar ? 60 : 0;

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="d-flex flex-fill">
                {showSidebar && <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />}
                <div
                    className={`app-content d-flex flex-column`}
                    style={{
                        marginLeft: showSidebar ? sidebarWidth : 0,
                        transition: 'margin-left 0.3s',
                        width: '100%'
                    }}
                >
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
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="pages">
                                    <Home />
                                </ProtectedRoute>
                            } />
                            <Route path="/about-us" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="pages">
                                    <AboutUs />
                                </ProtectedRoute>
                            } />
                            <Route path="/career" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="pages">
                                    <AdminCareer />
                                </ProtectedRoute>
                            } />
                            <Route path="/public-career" element={<PublicCareer />} />
                            <Route path="/partner" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="pages">
                                    <AdminPartner />
                                </ProtectedRoute>
                            } />
                            <Route path="/partner-faqs" element={<PartnerFAQs />} />
                            <Route path="/public-partner" element={<PublicPartner />} />
                            <Route path="/sections/*" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="sections">
                                    <Sections />
                                </ProtectedRoute>
                            } />
                            <Route path="/sections/reviews" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="sections">
                                    <Reviews />
                                </ProtectedRoute>
                            } />
                            <Route path="/sections/ads" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="sections">
                                    <Ads />
                                </ProtectedRoute>
                            } />
                            <Route path="/sections/footer" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="sections">
                                    <AdminFooter />
                                </ProtectedRoute>
                            } />
                            <Route path="/services/:serviceId" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="services">
                                    <ServicePage />
                                </ProtectedRoute>
                            } />
                            <Route path="/contact" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="pages">
                                    <ContactForm />
                                </ProtectedRoute>
                            } />
                            <Route path="/careers" element={<CareerForm />} />
                            <Route path="/admin/inquiries" element={<AdminInquiries />} />
                            <Route path="/admin/applications" element={<AdminApplications />} />
                            <Route path="/admin/dashboard" element={<Dashboard />} />
                            <Route path="/admin/login" element={<LoginForm />} />
                            <Route path="/login" element={<LoginForm />} />
                            <Route path="/admin/register" element={<AdminRegisterPage />} />
                            <Route path="/services-sections" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="services">
                                    <ServicesSections />
                                </ProtectedRoute>
                            } />
                            <Route path="/calculators" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="calculators">
                                    <Calculators />
                                </ProtectedRoute>
                            } />
                            <Route path="/calculators/:slug" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="calculators">
                                    <CalculatorPage />
                                </ProtectedRoute>
                            } />
                            <Route path="/services" element={
                                <ProtectedRoute allowedTabs={admin?.allowedTabs} tabKey="services">
                                    <ServicesOverview />
                                </ProtectedRoute>
                            } />
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
