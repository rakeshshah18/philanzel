export default function FeatureSection({ section }) {
    return (
        <section className="py-12 bg-white mb-10 rounded-lg shadow-xl">
            <div className="max-w-6xl mx-auto px-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(section.features || []).map((feature, i) => (
                        <div key={i} className="bg-cyan-50 rounded-lg p-6 shadow">
                            <h4 className="font-semibold text-cyan-700 mb-2">{feature.heading}</h4>
                            <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
