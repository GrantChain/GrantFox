import SettingsSidebar from "@/components/modules/settings/Sidebar";
import type { ReactNode } from "react";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <SettingsSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default SettingsLayout; 