import { usePathname } from "next/navigation";

const useLayoutDashboard = () => {
  const pathName = usePathname();
  const crumbs = pathName.split("/").filter(Boolean);

  let label = "Home";
  if (crumbs.length > 0) {
    // If the route is /dashboard/user/[userID], show 'User Profile' instead of the userID
    if (
      crumbs.length >= 3 &&
      crumbs[0] === "dashboard" &&
      crumbs[1] === "user" &&
      crumbs[2].length > 0
    ) {
      label = "User Profile";
    } else {
      label = crumbs[crumbs.length - 1]
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  }

  return { label };
};

export default useLayoutDashboard;
