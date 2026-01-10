export default function TestimonialSection({ section }) {
    return (
        <section className="py-16 bg-cyan-50 mb-10 rounded-lg shadow-xl">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h3 className="text-2xl font-bold text-cyan-700 mb-8">{section.title}</h3>
                <div className="space-y-8">
                    {(section.testimonials || []).map((testimonial, i) => (
                        <div key={i} className="bg-white rounded-lg shadow p-6">
                            <p className="text-lg text-gray-700 italic mb-2">"{testimonial.quote}"</p>
                            <div className="text-cyan-700 font-semibold">- {testimonial.author}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
