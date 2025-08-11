import Navbar from '../../components/landing/Navbar';
import Hero from '../../components/landing/Hero';
import TeamSection from '../../components/landing/TeamSection';
import CTASection from '../../components/landing/CTASection';
import Footer from '../../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-pearl-white">
      <Navbar />
      <div className="divider h-1 bg-gradient-to-r from-primary-blue via-electric-blue to-cyber-cyan" />
      <Hero />
      <div className="divider h-1 bg-gradient-to-r from-primary-blue via-electric-blue to-cyber-cyan" />
      <TeamSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
