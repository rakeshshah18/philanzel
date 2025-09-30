
import React, { useState } from 'react';
import RegisterForm from '../components/admin-forms/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminRegisterPage = () => {
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [otpRequired, setOtpRequired] = useState(false);
    const [pendingOtpEmail, setPendingOtpEmail] = useState('');
    const [authMessage, setAuthMessage] = useState('');
    const navigate = useNavigate();
    const handleRegister = async (formData) => {
        setLoading(true);
        setAuthMessage('');
        const result = await register(formData);
        setLoading(false);
        if (result.success && result.admin) {
            setAuthMessage('Admin registered successfully!');
            navigate('/admin/login');
            setOtpRequired(false);
        } else if (result.success && !result.admin) {
            setPendingOtpEmail(formData.email);
            setOtpRequired(true);
            setAuthMessage('OTP sent to super admin. Please enter OTP to complete registration.');
        } else {
            setAuthMessage(`${result.error}`);
        }
        return { otpRequired: result.success && !result.admin };
    };

    const handleVerifyOtp = async ({ email, otp }) => {
        setLoading(true);
        setAuthMessage('');
        try {
            const API_BASE = process.env.NODE_ENV === 'production' ? 'https://philanzel-backend.vercel.app/api' : 'http://localhost:8000/api';
            const res = await fetch(`${API_BASE}/admin/auth/verify-admin-registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (data.success) {
                setAuthMessage('Admin registered successfully!');
                setOtpRequired(false);
                setPendingOtpEmail('');
                navigate('/admin/login');
            } else {
                setAuthMessage(`${data.message}`);
            }
        } catch (err) {
            setAuthMessage('OTP verification failed.');
        }
        setLoading(false);
    };

    return (
        <>
            {authMessage && (
                <div className={`alert ${authMessage.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {authMessage}
                </div>
            )}
            <RegisterForm
                show={true}
                onClose={() => navigate('/admin/login')}
                onRegister={handleRegister}
                onVerifyOtp={handleVerifyOtp}
                loading={loading}
                otpRequired={otpRequired}
                emailForOtp={pendingOtpEmail}
            />
        </>
    );
};

export default AdminRegisterPage;
