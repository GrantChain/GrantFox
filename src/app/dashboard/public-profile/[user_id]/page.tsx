import PublicProfilePage from "@/components/modules/profile/pages/PublicProfilePage";

type PublicProfileProps = { params: Promise<{ user_id: string }> };

export default async function PublicProfile({ params }: PublicProfileProps) {
  const { user_id } = await params;
  return <PublicProfilePage userId={user_id} />;
}
