import dynamic from "next/dynamic";
import { InstallPWAButton } from "@/components/shared/install-pwa-button";

// Lazy load the Landing component
const Landing = dynamic(
  () =>
    import("@/components/modules/landing/ui/pages/Landing").then((mod) => ({
      default: mod.Landing,
    })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    ),
    ssr: true,
  },
);

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen">
      <Landing />
      <div className="fixed bottom-4 right-4 z-50">
        <InstallPWAButton />
      </div>
    </div>
  );
}
