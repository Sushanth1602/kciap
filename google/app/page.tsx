import React from "react";
import HeroSection from "@/components/landing/HeroSection";
import TrustSection from "@/components/landing/TrustSection";
import HowItWorks from "@/components/landing/HowItWorks";
import MeetTheTeam from "@/components/landing/MeetTheTeam";
import ProductPreview from "@/components/landing/ProductPreview";
import FeaturesPreview from "@/components/landing/FeaturesPreview";
import ComparisonTimeline from "@/components/landing/ComparisonTimeline";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CallToAction from "@/components/landing/CallToAction";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#050505] overflow-hidden">
      <HeroSection />
      <TrustSection />
      <HowItWorks />
      <MeetTheTeam />
      <ProductPreview />
      <FeaturesPreview />
      <ComparisonTimeline />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CallToAction />
    </div>
  );
}
