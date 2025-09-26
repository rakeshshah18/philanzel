"use client"

export default function AboutService() {
    // Static data
    const aboutData = {
        heading: "Our Story",
        description:
            "Retirement solutions are comprehensive financial strategies designed to ensure you enjoy a comfortable and worry-free life after you stop working. These solutions help you build a retirement corpus, generate regular income, and manage expenses during your golden years.",
        image: {
            url: "/images/pms-img-1.jpg",
            altText: "About Us",
        },
        button: {
            text: "Learn More",
            link: "/about",
        },
    }

    return (
        <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Image */}
                    <div className="relative">
                        <img
                            src={aboutData.image.url}
                            alt={aboutData.image.altText}
                            className="rounded-lg shadow-xl"
                        />
                    </div>

                    {/* Right Content */}
                    <div>
                        <h2 className="text-4xl font-serif font-black text-gray-900 mb-6">
                            {aboutData.heading}
                        </h2>
                        <div className="text-lg text-gray-600 mb-8 font-sans leading-relaxed">
                            {aboutData.description}
                        </div>
                        {aboutData.button && (
                            <div className="flex">
                                <a
                                    href={aboutData.button.link}
                                    className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {aboutData.button.text}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
