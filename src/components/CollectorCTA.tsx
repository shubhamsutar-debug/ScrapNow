import { useNavigate } from 'react-router-dom';
import collectorIllustration from '../assets/images/collector-illustration.jpg';

const CollectorCTA = () => {
  const navigate = useNavigate();

  return (
    <section id="for-collectors" className="w-full max-w-7xl mx-auto px-4 py-12">
      <div className="bg-brand-dark rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Are you a Scrap Collector?</h2>
          <p className="text-white/80 mt-3 text-base">Join ScrapNow and grow your business with more customers.</p>
          <button
            onClick={() => navigate('/collector/register')}
            className="mt-6 bg-brand-primary text-white font-bold px-7 py-3 rounded-xl hover:bg-green-600 transition inline-block w-fit cursor-pointer shadow-md"
          >
            Register as Collector →
          </button>
        </div>
        <div className="aspect-[16/9] sm:aspect-[4/3] lg:aspect-auto lg:h-full">
          <img 
            src={collectorIllustration} 
            alt="Collector Illustration" 
            className="w-full h-full object-cover object-center" 
          />
        </div>
      </div>
    </section>
  );
};

export default CollectorCTA;
