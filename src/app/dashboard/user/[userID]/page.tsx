import UserProfilePage from "@/components/modules/profile/pages/UserProfilePage";

export default function UserProfile({
  params,
}: {
  params: Promise<{ userID: string }>;
}) {
  return <UserProfilePage params={params} />;
}
