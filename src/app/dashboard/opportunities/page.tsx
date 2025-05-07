import { GrantsTable } from "@/components/modules/grants/ui/grants-table";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grant Opportunities</h1>
      </div>
      <GrantsTable />
    </div>
  );
} 