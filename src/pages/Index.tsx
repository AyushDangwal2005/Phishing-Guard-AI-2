import { LangProvider } from '@/components/LangProvider';
import { AuthProvider } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import TrustBadges from '@/components/TrustBadges';
import HowItWorks from '@/components/HowItWorks';
import LiveStats from '@/components/LiveStats';
import DetectionTool from '@/components/DetectionTool';
import ScanHistory from '@/components/ScanHistory';
import Footer from '@/components/Footer';

export default function Index() {
  return (
    <AuthProvider>
      <LangProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <HeroSection />
          <TrustBadges />
          <HowItWorks />
          <LiveStats />
          <DetectionTool />
          <ScanHistory />
          <Footer />
        </div>
      </LangProvider>
    </AuthProvider>
  );
}
