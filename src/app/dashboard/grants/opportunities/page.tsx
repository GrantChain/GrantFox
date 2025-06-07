'use client';

import { withRoleAccess } from '@/components/modules/auth/hoc/withRoleAccess';
import { Grants } from '@/components/modules/grants/ui/pages/Grants';

function OpportunitiesPage() {
  return <Grants />;
}

// Only ADMIN and GRANTEE roles can access the Opportunities page
export default withRoleAccess(OpportunitiesPage, {
  allowedRoles: ['ADMIN', 'GRANTEE'],
});
