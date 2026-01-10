"use client"

import { useState, useEffect } from "react"

export default function PartnerAbout() {
    const [services, setServices] = useState([])
    const [isLoadingServices, setIsLoadingServices] = useState(true)
    const [formData, setFormData] = useState({
        services: "",
        name: "",
        email: "",
        phone: "",
        message: "",
        terms: false
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState(null)
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoadingServices(true)
                const response = await fetch(`${BASE_URL}/api/services/public`)
                
                if (response.ok) {
                    const result = await response.json()
                    if (result && result.data && Array.isArray(result.data)) {
                        setServices(result.data)
                    } else {
                        console.error('Services data is not in expected format:', result)
                        setServices([])
                    }
                } else {
                    console.error('Failed to fetch services')
                    setServices([])
                }
            } catch (error) {
                console.error('Error fetching services:', error)
                setServices([])
            } finally {
                setIsLoadingServices(false)
            }
        }

        fetchServices()
    }, [])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.terms) {
            setSubmitStatus('terms-error')
            setTimeout(() => setSubmitStatus(null), 5000)
            return
        }

        setIsSubmitting(true)
        setSubmitStatus(null)

        try {
            const submitData = {
                serviceName: formData.services, 
                personName: formData.name,       
                email: formData.email,
                phone: formData.phone,
                message: formData.message
            }
            const response = await fetch(`${BASE_URL}/api/user/partner-inquiry`, {
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

            setSubmitStatus('success')

            setFormData({
                services: "",
                name: "",
                email: "",
                phone: "",
                message: "",
                terms: false
            })

            setTimeout(() => setSubmitStatus(null), 5000)

        } catch (error) {
            console.error("Form submission error:", error)
            setSubmitStatus('error')
            setTimeout(() => setSubmitStatus(null), 5000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">

                    {/* Main Content */}
                    <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4">
                                Become a <span className="text-cyan-600">Partner</span>
                            </h1>
                        </div>
                        
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1">
                                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                                    <p>
                                        Join Philanzel as a POSP (Point of Sales Person) Partner and embark on a flexible, rewarding career in the insurance industry. With no upfront costs, flexible work hours, and a vast range of insurance products, you have everything you need to succeed.
                                    </p>
                                    
                                    <p>
                                        Whether you're looking to earn part-time or full-time income, Philanzel empowers you with the tools, training, and support to grow at your own pace.
                                    </p>
                                </div>

                                {/* Call to Action */}
                                <div className="mt-8">
                                    <h2 className="text-2xl font-bold text-blue-600 mb-4">
                                        Take the First Step Today!
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Ready to start your journey as a Philanzel partner? Fill out the form and take the first step towards a rewarding career in the insurance industry.
                                    </p>
                                </div>
                            </div>
                            <div className="w-80 flex-shrink-0">
                                <div className="bg-gray-50 rounded-lg p-2">
                                    <h3 className="text-base font-bold text-gray-900 mb-2">Partner Registration</h3>
                                    {submitStatus && (
                                        <div className={`mb-4 p-3 rounded-lg text-xs ${
                                            submitStatus === 'success'
                                                ? 'bg-green-50 border border-green-200 text-green-800'
                                                : 'bg-red-50 border border-red-200 text-red-800'
                                            }`}>
                                            {submitStatus === 'success'
                                                ? 'Thank you! Your partner inquiry has been submitted successfully.'
                                                : submitStatus === 'terms-error'
                                                ? 'Please accept the terms and conditions to continue.'
                                                : 'Sorry, there was an error submitting your inquiry. Please try again.'
                                            }
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <div>
                                            <label htmlFor="services" className="block text-xs font-medium text-gray-700 mb-0.5">
                                                Services
                                            </label>
                                            <select
                                                id="services"
                                                name="services"
                                                value={formData.services}
                                                onChange={(e) => handleInputChange("services", e.target.value)}
                                                required
                                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 hover:border-gray-400 transition-colors duration-200 bg-white shadow-sm appearance-none cursor-pointer"
                                                style={{
                                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                                    backgroundPosition: 'right 0.5rem center',
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: '1.5em 1.5em',
                                                    paddingRight: '2.5rem'
                                                }}
                                            >
                                                <option value="" className="text-gray-500 rounded-lg">
                                                    {isLoadingServices ? "Loading services..." : "Select a Service"}
                                                </option>
                                                {!isLoadingServices && Array.isArray(services) && services.map((service) => (
                                                    <option key={service._id} value={service.slug} className="text-gray-900 py-2 rounded-lg">
                                                        {service.tabTitle}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-0.5">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange("name", e.target.value)}
                                                required
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                required
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your email"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-0.5">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                required
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-0.5">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={(e) => handleInputChange("message", e.target.value)}
                                                rows={2}
                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none"
                                                placeholder="Tell us why you want to become a partner"
                                            />
                                        </div>

                                        <div className="flex items-start mt-2">
                                            <input
                                                type="checkbox"
                                                id="terms"
                                                name="terms"
                                                checked={formData.terms}
                                                onChange={(e) => handleInputChange("terms", e.target.checked)}
                                                required
                                                className="mt-0.5 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="terms" className="ml-2 text-xs text-gray-700">
                                                By continuing, you provide consent and agree to our{' '}
                                                <a 
                                                    href="/terms-and-conditions" 
                                                    target="_blank"
                                                    className="text-cyan-600 hover:text-blue-800 underline"
                                                >
                                                    Terms & Conditions
                                                </a>
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !formData.terms}
                                            className="w-full bg-cyan-600 text-white py-1.5 px-3 text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition duration-200 font-medium mt-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1 inline-block"></div>
                                                    Submitting...
                                                </>
                                            ) : (
                                                "Submit Application"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
