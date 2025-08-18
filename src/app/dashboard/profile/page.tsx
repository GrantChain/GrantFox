import { ProfileLoadersProvider } from "@/components/modules/profile/context/ProfileLoadersContext";
import ProfilePage from "@/components/modules/profile/pages/ProfilePage";

export default function Profile() {
  return (
    <ProfileLoadersProvider>
      <ProfilePage />
    </ProfileLoadersProvider>
  );
}
