import React from 'react';
import { Navbar } from './landing/components/Navbar';
import { FeaturesSection } from './landing/components/FeaturesSection';
import { Footer } from './landing/components/Footer';

const FeaturesPage = () => {
  return (
    <main className="bg-black text-white min-h-screen selection:bg-blue-500 selection:text-white font-sans overflow-hidden flex flex-col">
      <Navbar />
      <div className="grow pt-24 pb-12">
        <FeaturesSection />
      </div>
      <Footer />
    </main>
  );
};

export default FeaturesPage;
