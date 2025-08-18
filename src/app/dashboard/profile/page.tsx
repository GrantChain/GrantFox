import ProfilePage from "@/components/modules/profile/pages/ProfilePage";
import { ProfileLoadersProvider } from "@/components/modules/profile/context/ProfileLoadersContext";

export default function Profile() {
  return (
    <ProfileLoadersProvider>
      <ProfilePage />
    </ProfileLoadersProvider>
  );
}
