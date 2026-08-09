import React from 'react';
import { Navbar } from './landing/components/Navbar';
import { PricingSection } from './landing/components/PricingSection';
import { Footer } from './landing/components/Footer';

const PricingPage = () => {
  return (
    <main className="bg-black text-white min-h-screen selection:bg-blue-500 selection:text-white font-sans overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-grow pt-24 pb-12">
        <PricingSection />
      </div>
      <Footer />
    </main>
  );
};

export default PricingPage;
