import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, UserCircle2 } from "lucide-react";
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

  const handleGranteeClick = () => setSelectedRole("GRANTEE");
  const handlePayoutProviderClick = () => setSelectedRole("PAYOUT_PROVIDER");

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
          <button
            type="button"
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all text-left w-full ${
              selectedRole === "GRANTEE"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            aria-label="Select Grantee role"
            onClick={handleGranteeClick}
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
          </button>

          <button
            type="button"
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all text-left w-full ${
              selectedRole === "PAYOUT_PROVIDER"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            aria-label="Select Payout Provider role"
            onClick={handlePayoutProviderClick}
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
          </button>
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
