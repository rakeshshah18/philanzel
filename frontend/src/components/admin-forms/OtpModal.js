import React, { useState } from 'react';
const OtpModal = ({ show, onClose, onVerify, loading, email }) => {
  const [otp, setOtp] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onVerify({ email, otp });
  };
  if (!show) return null;
  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Enter OTP</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="otpInput" className="form-label">OTP sent to super admin email</label>
                <input
                  type="text"
                  className="form-control"
                  id="otpInput"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
