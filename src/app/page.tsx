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
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
        <Landing />
      </div>
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <InstallPWAButton />
      </div>
    </div>
  );
}
