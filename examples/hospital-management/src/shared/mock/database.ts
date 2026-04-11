import {
  ActivityEvent,
  Appointment,
  Bed,
  HospitalSettings,
  Invoice,
  LabOrder,
  Patient,
  PatientDocument,
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
  createPatientDocuments,
  createPermissions,
  createPharmacyItems,
  createSettings,
  createStaff
} from '@/shared/mock/seed';

export type MockDatabase = {
  patients: Patient[];
  documents: PatientDocument[];
  appointments: Appointment[];
  staff: StaffMember[];
  beds: Bed[];
  pharmacy: PharmacyItem[];
  labOrders: LabOrder[];
  invoices: Invoice[];
  activity: ActivityEvent[];
  permissions: PermissionMatrix;
  settings: HospitalSettings;
  revision: number;
  offline: boolean;
};

const patients = createPatients();
const staff = createStaff();

const db: MockDatabase = {
  patients,
  documents: createPatientDocuments(patients),
  appointments: createAppointments(patients, staff),
  staff,
  beds: createBeds(patients),
  pharmacy: createPharmacyItems(),
  labOrders: createLabOrders(patients),
  invoices: createInvoices(patients),
  activity: createActivityFeed(),
  permissions: createPermissions(),
  settings: createSettings(),
  revision: 1,
  offline: false
};

export function getDb(): MockDatabase {
  return db;
}

export function bumpRevision(): void {
  db.revision += 1;
}

export function recordActivity(level: ActivityEvent['level'], message: string): ActivityEvent {
  const now = new Date();
  const event = {
    id: `act-${db.activity.length + 1}-${Date.now()}`,
    level,
    message,
    time: now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } satisfies ActivityEvent;

  db.activity.unshift(event);
  db.activity = db.activity.slice(0, 24);
  return event;
}

export function setOffline(next: boolean): void {
  db.offline = next;
}
