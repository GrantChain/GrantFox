import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserCircle2, Building2 } from "lucide-react";
import { registerRole } from "../services/register-role.service";
import { supabase } from "@/lib/supabase"; // Cambio aquí

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleSelectionModal({
  isOpen,
  onClose,
}: RoleSelectionModalProps) {
  console.log("🎭 Modal renderizado - isOpen:", isOpen);
  const [selectedRole, setSelectedRole] = useState<
    "grant_provider" | "grantee" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const result = await registerRole(user.id, selectedRole);

      if (result.success) {
        toast.success("Role registered successfully");
        onClose();
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error registering role:", error);
      toast.error("Failed to register role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Choose Your Role</DialogTitle>
          <DialogDescription>
            Please select how you want to use our platform
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedRole === "grantee"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole("grantee")}
          >
            <div className="flex items-start gap-4">
              <UserCircle2 className="h-8 w-8 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Grantee</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Looking for grants and funding opportunities. Submit
                  applications and manage your grant requests.
                </p>
              </div>
            </div>
          </div>

          <div
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
              selectedRole === "grant_provider"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole("grant_provider")}
          >
            <div className="flex items-start gap-4">
              <Building2 className="h-8 w-8 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Grant Provider</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Offer grants and funding. Create grant programs and manage
                  applications from grantees.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!selectedRole || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
