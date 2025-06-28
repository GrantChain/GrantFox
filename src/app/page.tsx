import { Landing } from "@/components/modules/landing/ui/pages/Landing";
import { InstallPWAButton } from "@/components/shared/install-pwa-button";

// Main page for the app
export default function Home() {
  return (
    <div className="container mx-auto min-h-screen">
      <Landing />
    </div>
  );
}

// Add to your page component
<InstallPWAButton />;
