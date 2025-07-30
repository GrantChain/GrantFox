"use client";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        <div className="aspect-video rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors" />
        <div className="aspect-video rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors" />
        <div className="aspect-video rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors" />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 w-full rounded-xl bg-muted/50 hover:bg-muted/70 transition-colors min-h-[50vh] md:min-h-[60vh]" />
    </div>
  );
}
