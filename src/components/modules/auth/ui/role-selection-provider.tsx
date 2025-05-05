"use client";

import { RoleSelectionModal } from "./role-selection-modal";
import { useRoleCheck } from "../hooks/use-role-check";

export function RoleSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { shouldShowModal, isLoading, setShouldShowModal } = useRoleCheck();

  if (isLoading) {
    return children;
  }

  return (
    <>
      {children}
      <RoleSelectionModal
        isOpen={shouldShowModal}
        onClose={() => setShouldShowModal(false)}
      />
    </>
  );
}
