import { HelpCircle, History, Home, Sparkles } from 'lucide-react';

export const navItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
    roles: ['GRANT_PROVIDER', 'GRANTEE'],
  },
  {
    title: 'Grant Projects',
    url: '/dashboard/grants/projects',
    icon: Sparkles,
    roles: ['GRANT_PROVIDER'],
  },
  {
    title: 'Opportunities',
    url: '/dashboard/grants/opportunities',
    icon: Sparkles,
    roles: ['GRANTEE'],
  },
  {
    title: 'Historic',
    url: '/history',
    icon: History,
    roles: ['GRANT_PROVIDER', 'GRANTEE'],
  },
  {
    title: 'Help',
    url: '/dashboard/help',
    icon: HelpCircle,
    roles: ['GRANT_PROVIDER', 'GRANTEE'],
  },
];
