import { usePathname } from "next/navigation";

const useLayoutDashboard = () => {
  const pathName = usePathname();
  const crumbs = pathName.split("/").filter(Boolean);

  let label = "Home";
  if (crumbs.length > 0) {
    if (crumbs[0] === "dashboard" && crumbs[1] === "public-profile") {
      label = "Public Profile";
    } else if (
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
