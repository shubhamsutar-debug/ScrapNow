import React from 'react';
import collectorIllustration from '../assets/images/collector-illustration.jpg';

const CollectorCTA = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="bg-brand-dark rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Are you a Scrap Collector?</h2>
          <p className="text-white/80 mt-3 text-base">Join ScrapNow and grow your business with more customers.</p>
          <button className="mt-6 bg-brand-primary text-white font-semibold px-7 py-3 rounded-btn hover:bg-green-600 transition inline-block w-fit">
            Register as Collector
          </button>
        </div>
        <div className="h-48 sm:h-64 lg:h-full">
          <img 
            src={collectorIllustration} 
            alt="Collector Illustration" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
    </section>
  );
};

export default CollectorCTA;
