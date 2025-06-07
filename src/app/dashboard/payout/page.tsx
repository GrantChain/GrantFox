'use client';

import { withRoleAccess } from '@/components/modules/auth/hoc/withRoleAccess';

function PayoutPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Payout Management</h1>
      <div className="grid gap-4">
        <div className="rounded-xl bg-muted/50 p-6">
          <h2 className="text-lg font-semibold mb-4">Payout Overview</h2>
          <p className="text-muted-foreground">
            Manage your grant payouts and track payment status here.
          </p>
        </div>
      </div>
    </div>
  );
}

// Only ADMIN and GRANT_PROVIDER roles can access the Payout page
export default withRoleAccess(PayoutPage, {
  allowedRoles: ['ADMIN', 'GRANT_PROVIDER'],
});
