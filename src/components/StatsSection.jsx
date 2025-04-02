export function StatsSection() {
  const stats = [
    {
      value: "8X",
      description: "Increase in knowledge retention",
    },
    {
      value: "42X",
      description: "Increase in learning engagement",
    },
    {
      value: "80%",
      description: "Decrease time to performance by up to *%",
    },
    {
      value: "5X",
      description: "Increase in return on investment",
    },
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <span className="inline-block px-6 py-2 bg-white rounded-full text-gray-800 font-semibold text-sm uppercase tracking-wider">
            Statistics
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          Proven Training Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
                {stat.value}
              </div>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
