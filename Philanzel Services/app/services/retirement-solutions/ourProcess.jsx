"use client"

import { DollarSign, Users, Globe, Building } from "lucide-react"

export default function OurProcessSection() {
    const processData = {
        heading: "Onboarding to Kickstart Your Insurance Career",
        description:
            "Your Partner in Building a Flexible and Rewarding Insurance Career",
        steps: [
            {
                heading: "Step 1",
                name: "Register Online",
                description:
                    "Fill out a short registration form with your basic details.",
                icon: DollarSign,
                color: "cyan",
            },
            {
                heading: "Step 2",
                name: "Attend Online Training",
                description:
                    "Complete easy, guided training sessions at your own pace.",
                icon: Users,
                color: "blue",
            },
            {
                heading: "Step 3",
                name: "Get Certified",
                description:
                    "Clear the certification and become a registered POSP Insurance Partner.",
                icon: Globe,
                color: "green",
            },
            {
                heading: "Step 4",
                name: "Start Earning",
                description:
                    "Begin selling insurance policies and earning commissions right away.",
                icon: Building,
                color: "purple",
            },
        ],
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-cyan-600 uppercase tracking-wide mb-2">
                        OUR PROCESS
                    </p>
                    <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                        {processData.heading}
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto font-sans">
                        {processData.description}
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processData.steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <div key={index} className="text-center">
                                <div
                                    className={`h-24 w-24 flex items-center justify-center mx-auto mb-4 rounded-full bg-${step.color}-100 transition-transform duration-300 hover:scale-110`}
                                >
                                    <Icon className={`h-12 w-12 text-${step.color}-600`} />
                                </div>
                                <div className="text-sm font-semibold text-cyan-600 mb-1">
                                    {step.heading}
                                </div>
                                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                                    {step.name}
                                </h3>
                                <p className="text-gray-600 font-sans text-sm">
                                    {step.description}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
