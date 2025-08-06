import axios from "axios";
import config from "../config/config.js";

const verifyCaptcha = async (req, res, next) => {
    // Skip reCAPTCHA verification in development mode
    if (process.env.NODE_ENV === 'development' || req.body.recaptchaToken === 'dummy-token-for-development') {
        console.log('⚠️  reCAPTCHA verification bypassed for development');
        return next();
    }

    const token = req.body['g-recaptcha-response'] || req.body.captcha || req.body.recaptchaToken;

    if (!token) {
        return res.status(400).json({
            status: 'error',
            message: 'reCAPTCHA token is required'
        });
    }

    try {
        // Create form data for the Google reCAPTCHA API
        const formData = new URLSearchParams();
        formData.append('secret', config.SECRET_CAPTCHA_KEY);
        formData.append('response', token);
        formData.append('remoteip', req.ip); // Optional: Include user's IP

        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        const data = response.data;
        
        if (!data.success) {
            const errorCodes = data['error-codes'] || [];
            let errorMessage = 'reCAPTCHA verification failed';
            
            // Provide specific error messages
            if (errorCodes.includes('missing-input-secret')) {
                errorMessage = 'reCAPTCHA secret key is missing';
            } else if (errorCodes.includes('invalid-input-secret')) {
                errorMessage = 'reCAPTCHA secret key is invalid';
            } else if (errorCodes.includes('missing-input-response')) {
                errorMessage = 'reCAPTCHA response is missing';
            } else if (errorCodes.includes('invalid-input-response')) {
                errorMessage = 'reCAPTCHA response is invalid or expired';
            } else if (errorCodes.includes('timeout-or-duplicate')) {
                errorMessage = 'reCAPTCHA response has timed out or was already used';
            }

            return res.status(403).json({
                status: 'error',
                message: errorMessage,
                errors: errorCodes
            });
        }

        // For reCAPTCHA v3, check the score (optional)
        if (data.score !== undefined) {
            const minScore = 0.5; // Adjust threshold as needed (0.0 = bot, 1.0 = human)
            if (data.score < minScore) {
                return res.status(403).json({
                    status: 'error',
                    message: 'reCAPTCHA score too low, request appears to be automated',
                    score: data.score,
                    threshold: minScore
                });
            }
            
            // Add score to request object for logging/analytics
            req.recaptchaScore = data.score;
        }

        // Add verification info to request object
        req.recaptchaVerified = true;
        req.recaptchaData = {
            success: data.success,
            challenge_ts: data.challenge_ts,
            hostname: data.hostname,
            score: data.score,
            action: data.action
        };

        console.log('✅ reCAPTCHA verified successfully', {
            ip: req.ip,
            score: data.score,
            action: data.action
        });

        next(); // reCAPTCHA verified successfully, proceed to next middleware/controller
        
    } catch (error) {
        console.error('❌ Error verifying reCAPTCHA:', error.message);
        
        // Handle specific axios errors
        if (error.code === 'ECONNABORTED') {
            return res.status(500).json({
                status: 'error',
                message: 'reCAPTCHA verification timed out'
            });
        }
        
        if (error.response) {
            return res.status(500).json({
                status: 'error',
                message: 'reCAPTCHA service temporarily unavailable',
                details: error.response.status
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Failed to verify reCAPTCHA',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
export default verifyCaptcha;