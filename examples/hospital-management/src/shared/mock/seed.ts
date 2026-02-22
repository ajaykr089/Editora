import {
  ActivityEvent,
  Appointment,
  Bed,
  Invoice,
  LabOrder,
  Patient,
  PermissionMatrix,
  PharmacyItem,
  Role,
  StaffMember
} from '@/shared/types/domain';

const names = [
  'Ava Johnson',
  'Liam Carter',
  'Mia Chen',
  'Noah Patel',
  'Emma Garcia',
  'Lucas Brown',
  'Sophia Miller',
  'Ethan Wilson',
  'Olivia Moore',
  'James Taylor',
  'Charlotte Davis',
  'Benjamin Lee',
  'Amelia Thomas',
  'Henry Walker',
  'Isabella Harris',
  'Alexander Hall',
  'Harper Allen',
  'Daniel Young',
  'Evelyn King',
  'Michael Wright'
];

const departments = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Oncology', 'Emergency'];

function pick<T>(list: T[], index: number): T {
  return list[index % list.length];
}

function todayOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function createPatients(): Patient[] {
  return names.map((name, idx) => {
    const status = idx % 9 === 0 ? 'critical' : idx % 5 === 0 ? 'admitted' : idx % 7 === 0 ? 'discharged' : 'active';
    return {
      id: `pat-${idx + 1}`,
      mrn: `MRN-${String(12000 + idx)}`,
      name,
      age: 18 + (idx * 3) % 67,
      gender: idx % 3 === 0 ? 'female' : idx % 3 === 1 ? 'male' : 'other',
      status,
      phone: `+1 555 10${String(idx).padStart(2, '0')}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@mail.com`,
      insurance: idx % 2 === 0 ? 'BlueCross PPO' : 'Aetna Plus',
      address: `${210 + idx} Care Street, Springfield`,
      allergies: idx % 2 === 0 ? ['Penicillin'] : ['None'],
      conditions: idx % 3 === 0 ? ['Hypertension'] : ['Diabetes Type-II'],
      emergencyContact: `Contact ${idx + 1} • +1 555 84${String(idx).padStart(2, '0')}`,
      notes: `<p>${name} has follow-up scheduled in ${pick(departments, idx)}.</p>`,
      updatedAt: new Date(Date.now() - idx * 3_600_000).toISOString()
    };
  });
}

export function createStaff(): StaffMember[] {
  const roles: Role[] = ['doctor', 'nurse', 'lab', 'pharmacy', 'billing', 'receptionist'];
  return Array.from({ length: 24 }, (_, idx) => {
    const role = pick(roles, idx);
    return {
      id: `stf-${idx + 1}`,
      name: `Dr/Staff ${idx + 1}`,
      role,
      department: role === 'billing' ? 'Accounts' : role === 'lab' ? 'Laboratory' : pick(departments, idx),
      status: idx % 6 === 0 ? 'leave' : 'active',
      shift: idx % 2 === 0 ? 'Morning' : 'Evening'
    };
  });
}

export function createAppointments(patients: Patient[], staff: StaffMember[]): Appointment[] {
  const doctors = staff.filter((s) => s.role === 'doctor');
  return Array.from({ length: 40 }, (_, idx) => {
    const patient = pick(patients, idx);
    const doctor = pick(doctors, idx);
    const status = idx % 11 === 0 ? 'cancelled' : idx % 5 === 0 ? 'arrived' : idx % 7 === 0 ? 'completed' : 'scheduled';
    return {
      id: `apt-${String(idx + 1).padStart(4, '0')}`,
      patientId: patient.id,
      patientName: patient.name,
      department: doctor.department,
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: todayOffset((idx % 18) - 6),
      slot: `${8 + (idx % 9)}:${idx % 2 === 0 ? '00' : '30'}`,
      status,
      queueToken: status === 'arrived' ? `Q-${120 + idx}` : undefined
    };
  });
}

export function createBeds(patients: Patient[]): Bed[] {
  const wards = ['Ward-A', 'Ward-B', 'ICU', 'Recovery'];
  return Array.from({ length: 36 }, (_, idx) => {
    const status = idx % 8 === 0 ? 'maintenance' : idx % 7 === 0 ? 'cleaning' : idx % 5 === 0 ? 'reserved' : idx % 3 === 0 ? 'occupied' : 'available';
    const patient = status === 'occupied' ? pick(patients, idx) : undefined;
    return {
      id: `BED-${String(idx + 1).padStart(3, '0')}`,
      ward: pick(wards, idx),
      floor: `${1 + (idx % 4)}`,
      status,
      patientId: patient?.id,
      patientName: patient?.name,
      assignedDoctor: patient ? `Dr/Staff ${1 + (idx % 8)}` : undefined
    };
  });
}

export function createPharmacyItems(): PharmacyItem[] {
  const meds = ['Paracetamol 500mg', 'Amoxicillin 250mg', 'Aspirin 75mg', 'Metformin 500mg', 'Atorvastatin 20mg'];
  return Array.from({ length: 28 }, (_, idx) => ({
    id: `med-${idx + 1}`,
    name: pick(meds, idx),
    sku: `SKU-${1800 + idx}`,
    batch: `B-${2025 + (idx % 3)}-${idx + 1}`,
    expiry: todayOffset(40 + idx * 9),
    stock: 15 + (idx * 7) % 180,
    reorderPoint: 25 + (idx % 4) * 10
  }));
}

export function createLabOrders(patients: Patient[]): LabOrder[] {
  const tests = ['CBC', 'Lipid Profile', 'LFT', 'KFT', 'HbA1c', 'CRP'];
  return Array.from({ length: 26 }, (_, idx) => ({
    id: `lab-${String(idx + 1).padStart(4, '0')}`,
    patientId: pick(patients, idx).id,
    patientName: pick(patients, idx).name,
    testName: pick(tests, idx),
    orderedAt: new Date(Date.now() - idx * 4_200_000).toISOString(),
    status: idx % 6 === 0 ? 'completed' : idx % 4 === 0 ? 'processing' : idx % 3 === 0 ? 'collected' : 'ordered',
    result: idx % 6 === 0 ? '<p>All values within acceptable range.</p>' : ''
  }));
}

export function createInvoices(patients: Patient[]): Invoice[] {
  return Array.from({ length: 34 }, (_, idx) => {
    const amount = 500 + (idx * 280) % 8000;
    const paid = idx % 3 === 0 ? amount : idx % 3 === 1 ? Math.floor(amount * 0.5) : 0;
    const status = paid === amount ? 'paid' : paid > 0 ? 'partial' : 'pending';
    return {
      id: `inv-${String(idx + 1).padStart(4, '0')}`,
      patientId: pick(patients, idx).id,
      patientName: pick(patients, idx).name,
      amount,
      paid,
      status,
      createdAt: todayOffset(-(idx % 22))
    };
  });
}

export function createActivityFeed(): ActivityEvent[] {
  return [
    { id: 'act-1', level: 'success', message: '3 discharges completed in Ward-B', time: '08:34 AM' },
    { id: 'act-2', level: 'warning', message: 'Low stock alert for Amoxicillin', time: '09:02 AM' },
    { id: 'act-3', level: 'critical', message: 'ICU bed occupancy reached 92%', time: '09:30 AM' },
    { id: 'act-4', level: 'info', message: '12 lab reports marked completed', time: '10:10 AM' },
    { id: 'act-5', level: 'success', message: 'Billing reconciliation synced', time: '10:42 AM' }
  ];
}

export function createPermissions(): PermissionMatrix {
  return {
    admin: {
      patients: 'write',
      appointments: 'write',
      staff: 'write',
      wards: 'write',
      pharmacy: 'write',
      laboratory: 'write',
      billing: 'write',
      reports: 'write',
      settings: 'write'
    },
    receptionist: {
      patients: 'write',
      appointments: 'write',
      staff: 'read',
      wards: 'read',
      pharmacy: 'read',
      laboratory: 'read',
      billing: 'read',
      reports: 'read',
      settings: 'read'
    },
    doctor: {
      patients: 'write',
      appointments: 'write',
      staff: 'read',
      wards: 'read',
      pharmacy: 'read',
      laboratory: 'write',
      billing: 'read',
      reports: 'read',
      settings: 'read'
    },
    nurse: {
      patients: 'write',
      appointments: 'read',
      staff: 'read',
      wards: 'write',
      pharmacy: 'read',
      laboratory: 'read',
      billing: 'read',
      reports: 'read',
      settings: 'read'
    },
    lab: {
      patients: 'read',
      appointments: 'read',
      staff: 'read',
      wards: 'read',
      pharmacy: 'read',
      laboratory: 'write',
      billing: 'read',
      reports: 'read',
      settings: 'read'
    },
    pharmacy: {
      patients: 'read',
      appointments: 'read',
      staff: 'read',
      wards: 'read',
      pharmacy: 'write',
      laboratory: 'read',
      billing: 'read',
      reports: 'read',
      settings: 'read'
    },
    billing: {
      patients: 'read',
      appointments: 'read',
      staff: 'read',
      wards: 'read',
      pharmacy: 'read',
      laboratory: 'read',
      billing: 'write',
      reports: 'write',
      settings: 'read'
    }
  };
}
