"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { label: "Profile", href: "/dashboard/settings/profile" },
  { label: "Preferences", href: "/dashboard/settings/preferences" },
];

const SettingsSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-64 border-r bg-card p-4 dark:bg-card/80">
      <nav className="flex flex-col gap-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-md px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none ${pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
            aria-current={pathname === item.href ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar; 