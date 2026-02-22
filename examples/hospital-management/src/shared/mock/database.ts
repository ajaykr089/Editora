import {
  ActivityEvent,
  Appointment,
  Bed,
  Invoice,
  LabOrder,
  Patient,
  PermissionMatrix,
  PharmacyItem,
  StaffMember
} from '@/shared/types/domain';
import {
  createActivityFeed,
  createAppointments,
  createBeds,
  createInvoices,
  createLabOrders,
  createPatients,
  createPermissions,
  createPharmacyItems,
  createStaff
} from '@/shared/mock/seed';

export type MockDatabase = {
  patients: Patient[];
  appointments: Appointment[];
  staff: StaffMember[];
  beds: Bed[];
  pharmacy: PharmacyItem[];
  labOrders: LabOrder[];
  invoices: Invoice[];
  activity: ActivityEvent[];
  permissions: PermissionMatrix;
  revision: number;
  offline: boolean;
};

const patients = createPatients();
const staff = createStaff();

const db: MockDatabase = {
  patients,
  appointments: createAppointments(patients, staff),
  staff,
  beds: createBeds(patients),
  pharmacy: createPharmacyItems(),
  labOrders: createLabOrders(patients),
  invoices: createInvoices(patients),
  activity: createActivityFeed(),
  permissions: createPermissions(),
  revision: 1,
  offline: false
};

export function getDb(): MockDatabase {
  return db;
}

export function bumpRevision(): void {
  db.revision += 1;
}

export function setOffline(next: boolean): void {
  db.offline = next;
}
