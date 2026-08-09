import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/images/hero-recycling.jpg';
import { useAuth } from '../context/AuthContext';
import { useCity } from '../context/CityContext';
import CitySelector from './CitySelector';

const Hero = () => {
  const { user, openAuthModal } = useAuth();
  const { selectedCity, setSelectedCity } = useCity();
  const navigate = useNavigate();

  const handleSellScrap = () => {
    if (user) {
      navigate('/sell-scrap');
    } else {
      openAuthModal('sell-scrap');
    }
  };

  return (
    <section id="home" className="py-12 md:py-20 px-4 w-full bg-gradient-to-b from-brand-bg to-white relative overflow-hidden">
      {/* Background soft gradient */}
      <div className="absolute top-0 right-0 w-3/4 h-full bg-gradient-to-bl from-brand-light/40 to-transparent -z-10 rounded-l-[100px] blur-3xl opacity-60"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
        
        {/* LEFT COLUMN */}
        <div className="w-full lg:w-[55%] flex flex-col items-start text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-brand-text">
            Know Your Scrap's Value.<br />
            Sell It With <span className="text-brand-primary">Confidence.</span>
          </h1>
          
          <p className="text-brand-text-secondary text-base md:text-lg mt-5 max-w-lg">
            Check current market rates, find nearby collectors, and sell your recyclable waste easily.
          </p>
          
          {/* Location Selector */}
          <div className="mt-6">
            <CitySelector
              variant="full"
              selectedCity={selectedCity}
              onCityChange={setSelectedCity}
            />
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button onClick={handleSellScrap} className="bg-brand-primary text-white font-semibold px-7 py-3 rounded-lg hover:bg-brand-dark transition shadow-sm inline-flex justify-center items-center gap-2 w-full sm:w-auto cursor-pointer">
              <span>♻️</span> Sell Scrap 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <button
              onClick={() => navigate('/select-city')}
              className="bg-brand-card border border-brand-border text-brand-text font-medium px-7 py-3 rounded-lg hover:bg-gray-50 transition w-full sm:w-auto text-center inline-flex justify-center items-center cursor-pointer"
            >
              Check Rate List
            </button>
          </div>
          
          {/* Benefit Badges */}
          <div className="mt-8 flex gap-3 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-sm text-brand-text-secondary bg-brand-card border border-brand-border rounded-full px-3 py-1.5 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>Best Market Rates</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-sm text-brand-text-secondary bg-brand-card border border-brand-border rounded-full px-3 py-1.5 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Zero Pickup Charges</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-sm text-brand-text-secondary bg-brand-card border border-brand-border rounded-full px-3 py-1.5 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-primary">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>Trusted Collectors</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full lg:w-[45%] relative mt-8 lg:mt-0 flex justify-center lg:justify-end">
          {/* Decorative background blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[400px] aspect-square bg-brand-light rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-80 blur-[2px]"></div>
          
          {/* Decorative floating dots */}
          <div className="absolute top-10 right-10 w-4 h-4 bg-brand-primary/30 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-20 left-4 w-6 h-6 bg-brand-primary/20 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 -right-4 w-3 h-3 bg-brand-primary/40 rounded-full animate-ping" style={{ animationDuration: '5s' }}></div>
          
          {/* Main Image */}
          <div className="relative z-10 w-full max-w-md shadow-xl rounded-2xl overflow-hidden border-4 border-white bg-brand-bg">
            <img 
              src={heroImage} 
              alt="Recycling scrap for value" 
              className="w-full h-auto object-cover object-top aspect-[4/3] lg:aspect-square"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Hero;
