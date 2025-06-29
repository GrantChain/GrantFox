import SettingsSidebar from "@/components/modules/settings/Sidebar";
import { ReactNode } from "react";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <SettingsSidebar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
};

export default SettingsLayout; 