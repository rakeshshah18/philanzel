"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

// Add reCAPTCHA script to head
if (typeof window !== 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
}

export default function JoinTeam() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        message: "",
        resume: null,
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [isNotificationFadingOut, setIsNotificationFadingOut] = useState(false)
    const [captchaToken, setCaptchaToken] = useState(null)
    const [careerData, setCareerData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Define the backend base URL
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

    // Fetch career data from API
    useEffect(() => {
        const fetchCareerData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${BASE_URL}/api/career-posts/public`)
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                
                const apiResponse = await response.json()
                
                if (apiResponse.status === 'success' && apiResponse.data.length > 0) {
                    setCareerData(apiResponse.data[0]) // Get the first career post
                    console.log('Career data loaded:', apiResponse.data[0]) // Debug log
                    if (apiResponse.data[0].image) {
                        console.log('Image path:', apiResponse.data[0].image.path) // Debug log
                        console.log('Image filename:', apiResponse.data[0].image.filename) // Debug log
                    }
                } else {
                    throw new Error('No career data found')
                }
                
                setError(null)
            } catch (err) {
                console.error('Error fetching career data:', err)
                setError(err instanceof Error ? err.message : 'Failed to fetch career data')
            } finally {
                setLoading(false)
            }
        }

        fetchCareerData()
    }, [])

    // Set up reCAPTCHA callback
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.setCaptchaToken = setCaptchaToken
        }
        
        return () => {
            if (typeof window !== 'undefined') {
                delete window.setCaptchaToken
            }
        }
    }, [])

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null
        setFormData((prev) => ({ ...prev, resume: file }))
    }

    const handleDismissNotification = () => {
        setIsNotificationFadingOut(true)
        setTimeout(() => {
            setShowSuccessMessage(false)
            setIsNotificationFadingOut(false)
        }, 300) // Wait for fade-out animation to complete
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Check if using placeholder reCAPTCHA key
        const isPlaceholderKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY === 'your_actual_site_key_here'
        
        // Check if captcha is completed (skip for placeholder keys)
        if (!isPlaceholderKey && !captchaToken) {
            alert('Please complete the reCAPTCHA verification.')
            return
        }
        
        try {
            setIsSubmitting(true)
            
            // Create FormData for file upload
            const formDataToSend = new FormData()
            formDataToSend.append('fullName', formData.fullName)
            formDataToSend.append('email', formData.email)
            formDataToSend.append('phone', formData.phone)
            formDataToSend.append('message', formData.message)
            
            // Only append captcha token if not using placeholder
            if (!isPlaceholderKey && captchaToken) {
                formDataToSend.append('captchaToken', captchaToken)
            }
            
            // Add resume file if selected
            if (formData.resume) {
                formDataToSend.append('resume', formData.resume)
            }

            console.log("Submitting career application:", formData)

            // Submit to backend API
            const response = await fetch(`${BASE_URL}/api/user/career-inquiry`, {
                method: 'POST',
                body: formDataToSend, // Don't set Content-Type header for FormData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log("Career application submitted successfully:", result)
            
            // Show success notification
            setShowSuccessMessage(true)
            
            // Reset form after successful submission
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                message: "",
                resume: null,
            })
            
            // Reset captcha (only if not using placeholder)
            if (!isPlaceholderKey) {
                setCaptchaToken(null)
                if (typeof window !== 'undefined' && window.grecaptcha) {
                    window.grecaptcha.reset()
                }
            }
            
            // Clear file input
            const fileInput = document.getElementById('resume')
            if (fileInput) {
                fileInput.value = ''
            }
            
            // Hide success message after 5 seconds with animation
            setTimeout(() => {
                setIsNotificationFadingOut(true)
                setTimeout(() => {
                    setShowSuccessMessage(false)
                    setIsNotificationFadingOut(false)
                }, 300) // Wait for fade-out animation to complete
            }, 5000)
            
        } catch (error) {
            console.error("Error submitting career application:", error)
            alert(`Failed to submit application: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes bounceOnce {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }
                
                @keyframes fadeOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .animate-slide-in-right {
                    animation: slideInRight 0.5s ease-out forwards;
                }
                
                .animate-bounce-once {
                    animation: bounceOnce 0.6s ease-in-out;
                }
                
                .animate-fade-out {
                    animation: fadeOut 0.3s ease-in forwards;
                }
            `}</style>
            
            {/* Success Toast Notification - Top Right */}
            {showSuccessMessage && (
                <div className={`fixed top-4 right-4 z-50 max-w-md w-full ${isNotificationFadingOut ? 'animate-fade-out' : 'animate-slide-in-right'}`}>
                    <div className="bg-white border border-green-200 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out hover:shadow-xl">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 animate-bounce-once">
                                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-sm font-medium text-green-800">
                                    Application Submitted Successfully!
                                </h3>
                                <div className="mt-1 text-sm text-green-700">
                                    We'll review your application and get back to you soon.
                                </div>
                            </div>
                            <div className="ml-3 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={handleDismissNotification}
                                    className="inline-flex rounded-md bg-white p-1.5 text-green-500 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    <span className="sr-only">Dismiss</span>
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Image */}
                    <div className="relative">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
                            {loading ? (
                                // Loading state
                                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
                                    <div className="text-gray-500">Loading...</div>
                                </div>
                            ) : error || !careerData?.image ? (
                                // Fallback to original design if no image or error
                                <div className="bg-gradient-to-br from-cyan-800 via-cyan-700 to-cyan-900 relative w-full h-full">
                                    {/* Background with bokeh effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-800/90 via-cyan-700/80 to-cyan-900/90"></div>

                                    {/* Bokeh circles */}
                                    <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full blur-sm"></div>
                                    <div className="absolute top-20 right-20 w-24 h-24 bg-white/15 rounded-full blur-md"></div>
                                    <div className="absolute bottom-20 left-20 w-20 h-20 bg-white/8 rounded-full blur-sm"></div>
                                    <div className="absolute top-32 left-32 w-12 h-12 bg-white/12 rounded-full blur-sm"></div>
                                    <div className="absolute bottom-32 right-16 w-18 h-18 bg-white/10 rounded-full blur-md"></div>

                                    {/* Central content */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            {/* Hand illustration */}
                                            <div className="relative w-48 h-48 flex items-center justify-center">
                                                {/* Hand silhouette */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-orange-400 rounded-3xl transform rotate-12 opacity-80"></div>

                                                {/* Growth arrow/stairs */}
                                                <div className="relative z-10">
                                                    <svg viewBox="0 0 120 120" className="w-32 h-32 text-white">
                                                        {/* Stair steps */}
                                                        <path
                                                            d="M20 100 L40 100 L40 80 L60 80 L60 60 L80 60 L80 40 L100 40 L100 20"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />

                                                        {/* Arrow elements */}
                                                        <path
                                                            d="M85 25 L100 20 L95 35"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />

                                                        {/* Small connecting lines */}
                                                        <line x1="25" y1="95" x2="35" y2="95" stroke="currentColor" strokeWidth="3" opacity="0.7" />
                                                        <line x1="45" y1="75" x2="55" y2="75" stroke="currentColor" strokeWidth="3" opacity="0.7" />
                                                        <line x1="65" y1="55" x2="75" y2="55" stroke="currentColor" strokeWidth="3" opacity="0.7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Display fetched image
                                <img
                                    src={`${BASE_URL}/${careerData.image.path.replace(/\\/g, '/').replace('src/', '')}`}
                                    alt={careerData.image.originalName || "Career Image"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error('Image failed to load, trying alternative path');
                                        // Try alternative paths if the first one fails
                                        if (e.target.src.includes('/uploads/')) {
                                            e.target.src = `${BASE_URL}/uploads/images/${careerData.image.filename}`;
                                        } else {
                                            // Final fallback - hide image and show original design
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `
                                                <div class="bg-gradient-to-br from-cyan-800 via-cyan-700 to-cyan-900 relative w-full h-full">
                                                    <div class="absolute inset-0 bg-gradient-to-br from-cyan-800/90 via-cyan-700/80 to-cyan-900/90"></div>
                                                    <div class="absolute inset-0 flex items-center justify-center text-white text-lg">
                                                        Career Image
                                                    </div>
                                                </div>
                                            `;
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                {loading ? (
                                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    careerData?.heading || "Join Our Team"
                                )}
                            </h2>
                            <div className="text-gray-600 text-md">
                                {loading ? (
                                    <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                ) : (
                                    <p className="text-gray-600 text-md">
                                        {careerData?.description || "Fill out the form below to apply for exciting career opportunities with us!"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                    Full Name
                                </Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            {/* Email Address */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                                    Message
                                </Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent min-h-[120px] resize-none"
                                    placeholder="Tell us about yourself and why you'd like to join our team"
                                    required
                                />
                            </div>

                            {/* Upload Resume */}
                            <div className="space-y-2">
                                <Label htmlFor="resume" className="text-sm font-medium text-gray-700">
                                    Upload Your Resume
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="resume"
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx"
                                        className="w-full px-2 border border-gray-400 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-transparent file:mr-5 file:py-0 file:px-5 file:rounded-lg file:border-0 file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                                    />
                                </div>
                                <p className="text-sm text-gray-500">
                                    Accepted formats: .pdf, .doc, .docx (Max: 5MB)
                                </p>
                            </div>

                            {/* reCAPTCHA */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Security Verification
                                </Label>
                                <div 
                                    className="g-recaptcha" 
                                    data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "your-site-key-here"}
                                    data-callback="onCaptchaSuccess"
                                    data-expired-callback="onCaptchaExpired"
                                ></div>
                                <p className="text-sm text-gray-500">
                                    Please complete the security verification above.
                                </p>
                            </div>

                            <script dangerouslySetInnerHTML={{
                                __html: `
                                    window.onCaptchaSuccess = function(token) {
                                        window.setCaptchaToken && window.setCaptchaToken(token);
                                    };
                                    window.onCaptchaExpired = function() {
                                        window.setCaptchaToken && window.setCaptchaToken(null);
                                    };
                                `
                            }} />

                            {/* Note */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    <strong>Note:</strong> If you were unable to submit your application, please feel free to email us your details and resume directly at{" "}
                                    <a href="mailto:coach@philanzel.com" className="text-cyan-600 hover:underline">
                                        coach@philanzel.com
                                    </a>
                                    .
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}
