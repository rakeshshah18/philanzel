"use client"

import { useState, useRef, useEffect } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, CheckCircle } from "lucide-react"

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const [captchaValue, setCaptchaValue] = useState(null)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [contactInfo, setContactInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [services, setServices] = useState([])
    const [servicesLoading, setServicesLoading] = useState(false)
    const [servicesError, setServicesError] = useState(null)
    const recaptchaRef = useRef(null)

    // Define the backend base URL
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

    // Function to fetch services (separated for reusability)
    const fetchServices = async () => {
        try {
            setServicesLoading(true)
            setServicesError(null)
            
            console.log('Fetching services from API...')
            
            const response = await fetch('http://localhost:8000/api/services/public', {
                method: 'GET',
                cache: 'no-store'
            })
            
            console.log('API response status:', response.status)
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const result = await response.json()
            console.log('API response:', result)
            
            if (result.status === 'success' && result.data && Array.isArray(result.data)) {
                // Map tabTitle to dropdown options
                const serviceOptions = result.data
                    .filter(service => service.isActive)
                    .map(service => ({
                        value: service.slug,
                        label: service.tabTitle,
                        id: service._id
                    }))
                
                console.log('Service options created:', serviceOptions)
                setServices(serviceOptions)
                
            } else {
                console.error('Invalid API response:', result)
                setServicesError('Invalid response format')
            }
        } catch (error) {
            console.error('Error fetching services:', error)
            setServicesError(error.message)
        } finally {
            setServicesLoading(false)
        }
    }

    // Fetch contact information from API
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/contact-us/info`)
                if (response.ok) {
                    const data = await response.json()
                    if (data && data.length > 0) {
                        setContactInfo(data[0])
                    }
                } else {
                    console.error('Failed to fetch contact info')
                }
            } catch (error) {
                console.error('Error fetching contact info:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchContactInfo()
    }, [])

    // Fetch services for dropdown
    useEffect(() => {
        fetchServices()
    }, [])

    // Function to clean HTML tags and decode HTML entities
    const cleanHtmlContent = (htmlString) => {
        if (!htmlString) return ''
        
        // Create a temporary div to decode HTML entities and strip tags
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = htmlString
        return tempDiv.textContent || tempDiv.innerText || ''
    }

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Validate reCAPTCHA
        if (!captchaValue) {
            setSubmitStatus('captcha-error')
            setTimeout(() => {
                setSubmitStatus(null)
            }, 5000)
            return
        }

        // Validate terms acceptance
        if (!termsAccepted) {
            setSubmitStatus('terms-error')
            setTimeout(() => {
                setSubmitStatus(null)
            }, 5000)
            return
        }

        setIsSubmitting(true)

        try {
            // Prepare form data for API submission
            const submitData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                servicesType: formData.service, // Map frontend 'service' to backend 'servicesType'
                message: formData.message,
                captchaToken: captchaValue
            }

            console.log("Submitting contact form:", submitData)

            // Submit to backend API
            const response = await fetch(`${BASE_URL}/api/contact-us/forms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log("Contact form submitted successfully:", result)

            setSubmitStatus('success')

            // Reset form after successful submission
            setFormData({
                name: "",
                email: "",
                phone: "",
                service: "",
                message: "",
            })
            setCaptchaValue(null)
            setTermsAccepted(false)
            recaptchaRef.current?.reset()

            setTimeout(() => {
                setSubmitStatus(null)
            }, 5000)

        } catch (error) {
            console.error("Form submission error:", error)
            setSubmitStatus('error')

            setTimeout(() => {
                setSubmitStatus(null)
            }, 5000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Side - Contact Info */}
                    <div className="space-y-8">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600">Loading contact information...</span>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                                        CONTACT US
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                        {contactInfo?.heading || "Get in Touch with Us"}
                                    </h2>
                                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                        {cleanHtmlContent(contactInfo?.description) || 
                                        "Reach out today to explore how we can help you meet your financial goals. Our advisors are available to provide expert support tailored to your needs."}
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {contactInfo?.points && contactInfo.points.length > 0 ? (
                                        contactInfo.points.map((point, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                                <span className="text-gray-700 font-medium">
                                                    {cleanHtmlContent(point)}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        // Fallback static points
                                        <>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                                <span className="text-gray-700 font-medium">24/7 Expert Support</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                                <span className="text-gray-700 font-medium">Business-Focused Financial Guidance</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                                <span className="text-gray-700 font-medium">Free Consultation Before You Commit</span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                </div>
                                                <span className="text-gray-700 font-medium">Trusted and Qualified Advisors</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Contact Information */}
                                <div className="space-y-6 pt-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <MapPin className="h-5 w-5 text-gray-600 mr-2" />
                                            Address
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {contactInfo?.address || "Unit no. 223, Vardhman Sunrise Plaza, Vasundhara Enclave, New Delhi-110096"}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <Phone className="h-5 w-5 text-gray-600 mr-2" />
                                            Contact Us
                                        </h3>
                                        <p className="text-gray-600">{contactInfo?.contact || "+91- 96 25 11 64 58"}</p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <Mail className="h-5 w-5 text-gray-600 mr-2" />
                                            Email
                                        </h3>
                                        <p className="text-gray-600">{contactInfo?.email || "coach@philanzel.com"}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Side - Contact Form */}
                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h3>
                        </div>

                        {/* Success/Error Messages */}
                        {submitStatus && (
                            <div className={`mb-6 p-4 rounded-lg ${
                                submitStatus === 'success'
                                    ? 'bg-green-50 border border-green-200 text-green-800'
                                    : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                <div className="flex items-center">
                                    {submitStatus === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
                                    <span>
                                        {submitStatus === 'success'
                                            ? 'Thank you! Your message has been sent successfully.'
                                            : submitStatus === 'captcha-error'
                                            ? 'Please complete the reCAPTCHA verification.'
                                            : submitStatus === 'terms-error'
                                            ? 'Please accept the terms and conditions to continue.'
                                            : 'Sorry, there was an error sending your message. Please try again.'
                                        }
                                    </span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-700 font-medium">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        required
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Enter full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        required
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Email id"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        required
                                        className="h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                        placeholder="Phone number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="service" className="text-gray-700 font-medium">
                                        Select Service
                                    </Label>
                                    <Select 
                                        
                                        onValueChange={(value) => {
                                            if (value !== 'loading' && value !== 'error' && value !== 'no-services') {
                                                handleInputChange("service", value)
                                            }
                                        }} 
                                        value={formData.service}
                                    >
                                        <SelectTrigger className="h-12 w-62 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                                            <SelectValue placeholder={servicesLoading ? "Loading services..." : "Select a Service"} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg border-gray-200 shadow-lg">
                                            {servicesLoading ? (
                                                <SelectItem value="loading" disabled className="rounded-md">Loading services...</SelectItem>
                                            ) : servicesError ? (
                                                <SelectItem value="error" disabled className="rounded-md">Error loading services</SelectItem>
                                            ) : services.length > 0 ? (
                                                services.map((service) => (
                                                    <SelectItem key={service.id} value={service.value} className="rounded-md hover:bg-gray-100 focus:bg-blue-50">
                                                        {service.label}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-services" disabled className="rounded-md">No services available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {servicesError && (
                                        <p className="text-xs text-red-500">Error: {servicesError}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-gray-700 font-medium">Message</Label>
                                <Textarea
                                    id="message"
                                    value={formData.message}
                                    onChange={(e) => handleInputChange("message", e.target.value)}
                                    required
                                    rows={6}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none"
                                    placeholder="write a message..."
                                />
                            </div>

                            {/* reCAPTCHA */}
                            <div className="space-y-2">
                                <Label className="text-gray-700 font-medium">Please verify you're human</Label>
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                                    onChange={handleCaptchaChange}
                                    onExpired={() => setCaptchaValue(null)}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500">
                                    This is using Google's test reCAPTCHA key. For production, get your own key from{" "}
                                    <a href="https://www.google.com/recaptcha/admin" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        Google reCAPTCHA
                                    </a>
                                </p>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start space-x-2">
                                <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 mt-1" 
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    required 
                                />
                                <span className="text-sm text-gray-600">
                                    By continuing, you provide consent and agree to our{" "}
                                    <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>
                                </span>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !captchaValue || !termsAccepted}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 text-lg font-medium h-12"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}