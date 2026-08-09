import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Add Items',
      description: 'Click photos of your scrap',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Check Rates',
      description: 'See current market rates',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Choose Collector',
      description: 'Select nearby collector (Free pickup)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Weigh & Get Paid',
      description: 'Collector weighs & pays you',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
          <path d="M12 3v18"/>
          <path d="m5 8 4 4"/>
          <path d="m19 8-4 4"/>
          <path d="M2 15h20"/>
          <path d="M7 15a5 5 0 0 0 10 0"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-brand-text mb-10 text-center">How ScrapNow Works</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center mb-4">
              {step.icon}
            </div>
            <div className="w-6 h-6 rounded-pill bg-brand-primary text-white text-xs font-bold flex items-center justify-center mb-2">
              {step.id}
            </div>
            <h3 className="font-semibold text-brand-text text-sm text-center">{step.title}</h3>
            <p className="text-xs text-brand-text-secondary text-center mt-1">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
