export default function HeroSection({ section }) {
    return (
        <section className="py-16 bg-gradient-to-br from-cyan-50 to-white mb-10 rounded-lg shadow-xl">
            <div className="max-w-5xl mx-auto text-center px-4">
                <h2 className="text-4xl font-serif font-black mb-4 text-cyan-700">{section.title}</h2>
                <p className="text-lg text-gray-600 mb-4">{section.description?.[0]}</p>
                {section.imageUrl && (
                    <img src={section.imageUrl} alt={section.title} className="mx-auto rounded-lg shadow-lg mt-6 max-h-80" />
                )}
            </div>
        </section>
    );
}
