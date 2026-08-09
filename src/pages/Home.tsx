import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ScrapPrices from '../components/ScrapPrices';
import HowItWorks from '../components/HowItWorks';
import CollectorCTA from '../components/CollectorCTA';
import Footer from '../components/Footer';

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
      </main>
      <Footer />
    </div>
  );
}
