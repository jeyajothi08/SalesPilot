import React, { useEffect } from 'react';
import Lenis from 'lenis';

// Import all modern, modular sections
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustedBySection } from './components/TrustedBySection';
import { FeaturesSection } from './components/FeaturesSection';
import { AIAutomationShowcase } from './components/AIAutomationShowcase';
import { CRMShowcase } from './components/CRMShowcase';
import { WhatsAppAutomation } from './components/WhatsAppAutomation';
import { VoiceCallsShowcase } from './components/VoiceCallsShowcase';
import { EmailAutomation } from './components/EmailAutomation';
import { AnalyticsShowcase } from './components/AnalyticsShowcase';
import { TestimonialsSection } from './components/TestimonialsSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

const LandingPage = () => {

  useEffect(() => {
    // Smooth scrolling using Lenis (as per previous setup, maintaining high-end feel)
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-black text-white min-h-screen selection:bg-blue-500 selection:text-white font-sans overflow-hidden">
       <Navbar />
       
       <HeroSection />
       <TrustedBySection />
       <FeaturesSection />
       
       <AIAutomationShowcase />
       <CRMShowcase />
       <WhatsAppAutomation />
       <VoiceCallsShowcase />
       <EmailAutomation />
       <AnalyticsShowcase />
       
       <TestimonialsSection />
       <PricingSection />
       <FAQSection />
       <ContactSection />
       
       <Footer />

       {/* Floating button to launch OS dashboard (for development/testing) */}
       <div className="fixed bottom-4 right-4 z-[999]">
          <a href="#os" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold shadow-lg transition-colors border border-blue-500/50">
            Launch OS Dashboard
          </a>
       </div>
    </main>
  );
};

export default LandingPage;
