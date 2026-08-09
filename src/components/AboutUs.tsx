import React from 'react';

const AboutUs: React.FC = () => {
  const stats = [
    { value: '6',              label: 'Scrap Materials' },
    { value: 'Collector-Based', label: 'Pricing Model' },
    { value: 'Location-Based', label: 'Collector Discovery' },
    { value: 'Free',           label: 'Pickup' },
  ];

  return (
    <section id="about" className="py-12 md:py-16 px-4 bg-brand-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
            About <span className="text-brand-primary">ScrapNow</span>
          </h2>
          <p className="text-brand-text-secondary mt-3 max-w-xl mx-auto text-sm md:text-base">
            We're building India's most transparent scrap marketplace — connecting households and businesses with verified local collectors at fair, real-time market prices.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-brand-card border border-brand-border rounded-[var(--radius-card)] p-6 text-center shadow-sm"
            >
              <p className="text-2xl md:text-3xl font-bold text-brand-primary">{stat.value}</p>
              <p className="text-brand-text-secondary text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-brand-card border border-brand-border rounded-[var(--radius-card)] p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-sm">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-brand-text mb-4">Our Mission</h3>
            <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed mb-4">
              ScrapNow was founded with a simple belief: every household deserves to know the true value of their recyclable waste — and get it, without hassle.
            </p>
            <p className="text-brand-text-secondary text-sm md:text-base leading-relaxed">
              By digitising the informal scrap economy, we create livelihoods for collectors, reduce landfill waste, and put more money in your pocket.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { icon: '♻️', title: 'Eco-Friendly', desc: 'Every kg recycled keeps waste out of landfills.' },
              { icon: '💰', title: 'Fair Prices', desc: 'Live market rates — no middlemen, no guessing.' },
              { icon: '🤝', title: 'Trusted Network', desc: 'Every collector is verified and rated by users.' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-lg flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="font-semibold text-brand-text text-sm">{item.title}</p>
                  <p className="text-brand-text-secondary text-sm mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
