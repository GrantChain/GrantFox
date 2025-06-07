import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCircle2, Building2 } from "lucide-react";
import { useRoleSelection } from "../../hooks/useRoleSelection";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSelectionDialog = ({
  isOpen,
  onClose,
}: RoleSelectionModalProps) => {
  const { selectedRole, setSelectedRole, isLoading, handleSubmit } =
    useRoleSelection({
      onClose,
    });

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
              selectedRole === "GRANTEE"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole("GRANTEE")}
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
              selectedRole === "PAYOUT_PROVIDER"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole("PAYOUT_PROVIDER")}
          >
            <div className="flex items-start gap-4">
              <Building2 className="h-8 w-8 mt-1" />
              <div>
                <h3 className="font-semibold text-lg">Payout Provider</h3>
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
};
