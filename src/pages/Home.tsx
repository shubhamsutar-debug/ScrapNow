import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ScrapPrices from '../components/ScrapPrices';
import HowItWorks from '../components/HowItWorks';
import CollectorCTA from '../components/CollectorCTA';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      {/* Logged-in Customer Banner */}
      {user && (
        <div className="bg-brand-primary text-white py-2.5 px-4 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs">
          <span>👋 Welcome back, {user.name}! You are logged in.</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="underline hover:text-brand-light transition font-extrabold ml-1 cursor-pointer"
          >
            Go to Customer Dashboard →
          </button>
        </div>
      )}

      <main>
        <Hero />
        <ScrapPrices />
        <div className="bg-brand-card">
          <HowItWorks />
          <CollectorCTA />
        </div>
        <AboutUs />
      </main>

      <Footer />
      <AuthModal />
    </div>
  );
}
