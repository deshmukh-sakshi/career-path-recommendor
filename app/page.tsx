import HeroSection from "@/components/landing/HeroSection";
import StatsBar from "@/components/landing/StatsBar";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-base">
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
    </main>
  );
}
