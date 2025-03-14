"use client";

import { supabase } from "@/lib/supabase";

export default function Page() {
  const handleSubmit = async () => {
    const { data, error } = await supabase
      .from("users")
      .insert({ name: "John Doe" });

    if (data) console.log(data);
    if (error) console.error(error);
  };

  handleSubmit();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
