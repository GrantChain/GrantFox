"use client";

import { useRoleCheck } from "../modules/auth/hooks/useRoleCheck";
import { RoleSelectionDialog } from "../modules/auth/ui/dialogs/RoleSelectionDialog";

export const RoleSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { shouldShowModal, isLoading, setShouldShowModal } = useRoleCheck();

  if (isLoading) {
    return children;
  }

  return (
    <>
      {children}
      <RoleSelectionDialog
        isOpen={shouldShowModal}
        onClose={() => setShouldShowModal(false)}
      />
    </>
  );
};
