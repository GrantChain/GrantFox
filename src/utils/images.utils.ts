export const getPublicUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const bucket = "evidences";

  if (!baseUrl) return "#";

  return `${baseUrl}/storage/v1/object/public/${bucket}/${path}`;
};
