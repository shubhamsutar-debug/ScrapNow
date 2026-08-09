import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ScrapPrices from '../components/ScrapPrices';
import HowItWorks from '../components/HowItWorks';
import CollectorCTA from '../components/CollectorCTA';
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
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
