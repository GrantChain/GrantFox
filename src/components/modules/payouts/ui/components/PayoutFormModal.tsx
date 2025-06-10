import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PayoutFormValues } from "../../schemas/payout.schema";
import { PayoutForm } from "./PayoutForm";

interface PayoutFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<PayoutFormValues>;
  onSubmit: (values: PayoutFormValues) => void;
  mode?: "create" | "edit";
  isSubmitting?: boolean;
}

export const PayoutFormModal = ({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
  mode = "create",
  isSubmitting,
}: PayoutFormModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Payout" : "Create Payout"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Edit the details of your payout."
              : "Fill in the details to create a new payout."}
          </DialogDescription>
        </DialogHeader>

        <PayoutForm
          initialValues={initialValues}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
