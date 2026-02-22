import { Role } from '@/shared/types/domain';

export type NavItem = {
  value: string;
  label: string;
  to: string;
  icon: string;
  section: string;
  badge?: string;
  description?: string;
  roles?: Role[];
};

export const navItems: NavItem[] = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    to: '/dashboard',
    icon: 'dashboard',
    section: 'Overview',
    description: 'KPIs and activity'
  },
  {
    value: 'patients',
    label: 'Patients',
    to: '/patients',
    icon: 'users',
    section: 'Clinical',
    description: 'Profiles and history'
  },
  {
    value: 'appointments',
    label: 'Appointments',
    to: '/appointments',
    icon: 'calendar',
    section: 'Clinical',
    description: 'Scheduling board'
  },
  {
    value: 'staff',
    label: 'Staff & RBAC',
    to: '/staff',
    icon: 'shield',
    section: 'Management',
    description: 'Team and permissions',
    roles: ['admin']
  },
  {
    value: 'wards',
    label: 'Wards / Beds',
    to: '/wards',
    icon: 'layout',
    section: 'Management',
    description: 'Occupancy board'
  },
  {
    value: 'pharmacy',
    label: 'Pharmacy',
    to: '/pharmacy',
    icon: 'clipboard',
    section: 'Operations',
    description: 'Stock and dispensing'
  },
  {
    value: 'laboratory',
    label: 'Laboratory',
    to: '/laboratory',
    icon: 'activity',
    section: 'Operations',
    description: 'Orders and results'
  },
  {
    value: 'billing',
    label: 'Billing',
    to: '/billing',
    icon: 'receipt',
    section: 'Finance',
    description: 'Invoices and payments',
    badge: '7'
  },
  {
    value: 'reports',
    label: 'Reports',
    to: '/reports',
    icon: 'chart-bar',
    section: 'Finance',
    description: 'Exports and analytics'
  },
  {
    value: 'settings',
    label: 'Settings',
    to: '/settings',
    icon: 'settings',
    section: 'System',
    description: 'Hospital profile'
  }
];

export function itemForPath(pathname: string): NavItem | undefined {
  return navItems.find((item) => pathname.startsWith(item.to));
}
