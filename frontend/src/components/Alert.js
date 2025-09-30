import React, { useState } from 'react';
const Alert = ({
    message,
    type = 'info',
    dismissible = true,
    onClose = null,
    className = '',
    show = true
}) => {
    const [isVisible, setIsVisible] = useState(show);
    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            onClose();
        }
    };
    if (!isVisible || !message) {
        return null;
    }
    const getAlertClass = () => {
        const baseClass = 'alert';
        const typeClass = `alert-${type}`;
        const dismissibleClass = dismissible ? 'alert-dismissible' : '';
        const fadeClass = 'fade show';
        return `${baseClass} ${typeClass} ${dismissibleClass} ${fadeClass} ${className}`.trim();
    };
    return (
        <div className={getAlertClass()} role="alert">
            {message}
            {dismissible && (
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={handleClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        lineHeight: 1,
                        color: 'inherit',
                        textShadow: '0 1px 0 #fff',
                        opacity: 0.5,
                        cursor: 'pointer',
                        float: 'right',
                        padding: '0.375rem 0.75rem',
                        margin: '-0.375rem -0.75rem -0.375rem 0'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = 0.75}
                    onMouseLeave={(e) => e.target.style.opacity = 0.5}
                >
                    ×
                </button>
            )}
        </div>
    );
};
export const SuccessAlert = ({ message, ...props }) => (
    <Alert message={message} type="success" {...props} />
);
export const ErrorAlert = ({ message, ...props }) => (
    <Alert message={message} type="danger" {...props} />
);
export const WarningAlert = ({ message, ...props }) => (
    <Alert message={message} type="warning" {...props} />
);
export const InfoAlert = ({ message, ...props }) => (
    <Alert message={message} type="info" {...props} />
);
export default Alert;
