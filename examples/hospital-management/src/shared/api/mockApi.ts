import {
  ActivityEvent,
  Appointment,
  Bed,
  Invoice,
  LabOrder,
  Paginated,
  Patient,
  PharmacyItem,
  QueryListParams,
  Role,
  StaffMember
} from '@/shared/types/domain';
import { bumpRevision, getDb, setOffline } from '@/shared/mock/database';

const delay = (ms = 280) => new Promise((resolve) => setTimeout(resolve, ms));

function maybeThrowOffline() {
  if (getDb().offline) {
    throw new Error('Network unavailable. Retry once connection is restored.');
  }
}

function paginate<T>(items: T[], page = 1, pageSize = 10): Paginated<T> {
  const total = items.length;
  const safePage = Math.max(1, page);
  const safeSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safeSize;
  return {
    items: items.slice(start, start + safeSize),
    page: safePage,
    pageSize: safeSize,
    total
  };
}

function normalize(value?: string): string {
  return String(value || '').trim().toLowerCase();
}

function includesValue(value: string, query: string): boolean {
  return value.toLowerCase().includes(query);
}

export const mockApi = {
  async login(payload: { email: string; password: string }) {
    await delay(320);
    maybeThrowOffline();

    const email = normalize(payload.email);
    if (!email || !payload.password) throw new Error('Email and password are required.');

    const roleMap: Record<string, Role> = {
      'admin@hospital.test': 'admin',
      'reception@hospital.test': 'receptionist',
      'doctor@hospital.test': 'doctor',
      'nurse@hospital.test': 'nurse',
      'lab@hospital.test': 'lab',
      'pharmacy@hospital.test': 'pharmacy',
      'billing@hospital.test': 'billing'
    };

    const role = roleMap[email] || 'admin';

    return {
      token: `mock-token-${Date.now()}`,
      user: {
        id: `usr-${role}`,
        name: role === 'admin' ? 'Hospital Admin' : role[0].toUpperCase() + role.slice(1),
        email,
        role,
        department: role === 'doctor' ? 'Cardiology' : role === 'lab' ? 'Laboratory' : 'Administration'
      }
    };
  },

  async forgotPassword(payload: { email: string }) {
    await delay(240);
    maybeThrowOffline();
    if (!normalize(payload.email)) throw new Error('Email is required');
    return { ok: true, message: 'Reset instructions sent.' };
  },

  async setOfflineMode(enabled: boolean) {
    setOffline(enabled);
    await delay(120);
    return { enabled };
  },

  async getDashboard() {
    await delay(300);
    maybeThrowOffline();

    const db = getDb();
    const today = new Date().toISOString().slice(0, 10);

    const todaysAppointments = db.appointments.filter((apt) => apt.date === today).length;
    const admissions = db.patients.filter((patient) => patient.status === 'admitted').length;
    const discharges = db.patients.filter((patient) => patient.status === 'discharged').length;
    const pendingLab = db.labOrders.filter((lab) => lab.status !== 'completed').length;
    const occupiedBeds = db.beds.filter((bed) => bed.status === 'occupied').length;
    const occupancyPct = Math.round((occupiedBeds / db.beds.length) * 100);
    const revenue = db.invoices.reduce((acc, invoice) => acc + invoice.paid, 0);

    const trend = Array.from({ length: 7 }, (_, idx) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - idx));
      const label = date.toISOString().slice(5, 10);
      return {
        label,
        appointments: Math.max(8, 18 + ((idx * 5) % 12) - (idx === 2 ? 7 : 0)),
        occupancy: Math.max(50, 68 + ((idx * 7) % 14) - (idx === 4 ? 10 : 0))
      };
    });

    return {
      kpis: {
        todaysAppointments,
        admissions,
        discharges,
        occupancyPct,
        revenue,
        pendingLab
      },
      trend,
      activity: db.activity,
      revision: db.revision
    };
  },

  async listPatients(params: QueryListParams = {}) {
    await delay();
    maybeThrowOffline();

    const db = getDb();
    const query = normalize(params.search);

    let rows = [...db.patients];
    if (query) {
      rows = rows.filter((patient) => {
        return (
          includesValue(patient.name, query) ||
          includesValue(patient.mrn, query) ||
          includesValue(patient.phone, query) ||
          includesValue(patient.email, query)
        );
      });
    }

    if (params.status) rows = rows.filter((patient) => patient.status === params.status);

    return {
      ...paginate(rows, params.page, params.pageSize),
      revision: db.revision
    };
  },

  async getPatient(patientId: string) {
    await delay(180);
    maybeThrowOffline();

    const patient = getDb().patients.find((row) => row.id === patientId);
    if (!patient) throw new Error('Patient not found.');

    const encounters = getDb().appointments
      .filter((row) => row.patientId === patientId)
      .sort((a, b) => b.date.localeCompare(a.date));

    const labs = getDb().labOrders.filter((row) => row.patientId === patientId);
    const invoices = getDb().invoices.filter((row) => row.patientId === patientId);

    return {
      patient,
      encounters,
      labs,
      invoices,
      revision: getDb().revision
    };
  },

  async savePatient(payload: Partial<Patient> & { id?: string }) {
    await delay(260);
    maybeThrowOffline();

    const db = getDb();

    if (payload.id) {
      const index = db.patients.findIndex((row) => row.id === payload.id);
      if (index < 0) throw new Error('Patient not found for update.');
      db.patients[index] = {
        ...db.patients[index],
        ...payload,
        updatedAt: new Date().toISOString()
      } as Patient;
      bumpRevision();
      return db.patients[index];
    }

    const nextId = `pat-${db.patients.length + 1}`;
    const newPatient: Patient = {
      id: nextId,
      mrn: payload.mrn || `MRN-${12000 + db.patients.length + 1}`,
      name: payload.name || 'New Patient',
      age: payload.age || 30,
      gender: payload.gender || 'other',
      status: payload.status || 'active',
      phone: payload.phone || '+1 555 0000',
      email: payload.email || `patient${db.patients.length + 1}@mail.com`,
      insurance: payload.insurance || 'Self-pay',
      address: payload.address || 'Unknown',
      allergies: payload.allergies || [],
      conditions: payload.conditions || [],
      emergencyContact: payload.emergencyContact || 'Unknown',
      notes: payload.notes || '<p>No notes yet</p>',
      updatedAt: new Date().toISOString()
    };

    db.patients.unshift(newPatient);
    bumpRevision();
    return newPatient;
  },

  async archivePatient(patientId: string) {
    await delay(180);
    maybeThrowOffline();

    const db = getDb();
    const target = db.patients.find((row) => row.id === patientId);
    if (!target) throw new Error('Patient not found.');
    target.status = 'archived';
    bumpRevision();
    return { ok: true };
  },

  async listAppointments(params: QueryListParams = {}) {
    await delay();
    maybeThrowOffline();

    let rows = [...getDb().appointments];
    const query = normalize(params.search);
    if (query) {
      rows = rows.filter((row) => includesValue(row.patientName, query) || includesValue(row.doctorName, query) || includesValue(row.id, query));
    }

    if (params.status) rows = rows.filter((row) => row.status === params.status);
    if (params.department) rows = rows.filter((row) => row.department === params.department);

    rows.sort((a, b) => `${a.date} ${a.slot}`.localeCompare(`${b.date} ${b.slot}`));

    return {
      ...paginate(rows, params.page, params.pageSize),
      revision: getDb().revision
    };
  },

  async createAppointment(payload: Partial<Appointment>) {
    await delay(260);
    maybeThrowOffline();

    const db = getDb();
    const next: Appointment = {
      id: `apt-${String(db.appointments.length + 1).padStart(4, '0')}`,
      patientId: payload.patientId || db.patients[0].id,
      patientName: payload.patientName || db.patients[0].name,
      department: payload.department || 'General',
      doctorId: payload.doctorId || db.staff.find((s) => s.role === 'doctor')?.id || 'stf-1',
      doctorName: payload.doctorName || db.staff.find((s) => s.role === 'doctor')?.name || 'Dr Unknown',
      date: payload.date || new Date().toISOString().slice(0, 10),
      slot: payload.slot || '09:00',
      status: payload.status || 'scheduled'
    };
    db.appointments.unshift(next);
    bumpRevision();
    return next;
  },

  async updateAppointmentStatus(payload: { id: string; status: Appointment['status'] }) {
    await delay(180);
    maybeThrowOffline();

    const target = getDb().appointments.find((row) => row.id === payload.id);
    if (!target) throw new Error('Appointment not found.');

    target.status = payload.status;
    if (payload.status === 'arrived') target.queueToken = `Q-${100 + Number(payload.id.replace(/\D+/g, ''))}`;
    bumpRevision();
    return target;
  },

  async listStaff(params: QueryListParams = {}) {
    await delay(180);
    maybeThrowOffline();

    let rows = [...getDb().staff];
    const query = normalize(params.search);
    if (query) rows = rows.filter((row) => includesValue(row.name, query) || includesValue(row.department, query));
    if (params.department) rows = rows.filter((row) => row.department === params.department);

    return {
      ...paginate(rows, params.page, params.pageSize),
      permissions: getDb().permissions,
      revision: getDb().revision
    };
  },

  async listBeds(params: QueryListParams = {}) {
    await delay(180);
    maybeThrowOffline();

    let rows = [...getDb().beds];
    const query = normalize(params.search);
    if (query) rows = rows.filter((row) => includesValue(row.id, query) || includesValue(row.ward, query));
    if (params.status) rows = rows.filter((row) => row.status === params.status);

    return {
      items: rows,
      occupancyPct: Math.round((rows.filter((row) => row.status === 'occupied').length / rows.length) * 100),
      revision: getDb().revision
    };
  },

  async assignBed(payload: { bedId: string; patientId: string; doctorName: string }) {
    await delay(210);
    maybeThrowOffline();

    const db = getDb();
    const bed = db.beds.find((row) => row.id === payload.bedId);
    const patient = db.patients.find((row) => row.id === payload.patientId);

    if (!bed || !patient) throw new Error('Invalid bed assignment payload.');

    bed.status = 'occupied';
    bed.patientId = patient.id;
    bed.patientName = patient.name;
    bed.assignedDoctor = payload.doctorName;
    patient.status = 'admitted';
    bumpRevision();
    return bed;
  },

  async dischargeBed(bedId: string) {
    await delay(180);
    maybeThrowOffline();

    const db = getDb();
    const bed = db.beds.find((row) => row.id === bedId);
    if (!bed) throw new Error('Bed not found.');

    if (bed.patientId) {
      const patient = db.patients.find((row) => row.id === bed.patientId);
      if (patient) patient.status = 'discharged';
    }

    bed.status = 'cleaning';
    bed.patientId = undefined;
    bed.patientName = undefined;
    bed.assignedDoctor = undefined;
    bumpRevision();
    return bed;
  },

  async listPharmacy(params: QueryListParams = {}) {
    await delay(180);
    maybeThrowOffline();

    let rows = [...getDb().pharmacy];
    const query = normalize(params.search);
    if (query) rows = rows.filter((row) => includesValue(row.name, query) || includesValue(row.sku, query));

    return {
      ...paginate(rows, params.page, params.pageSize),
      lowStock: rows.filter((row) => row.stock <= row.reorderPoint).length,
      nearExpiry: rows.filter((row) => new Date(row.expiry).getTime() - Date.now() < 1000 * 60 * 60 * 24 * 60).length,
      revision: getDb().revision
    };
  },

  async dispenseMedicine(payload: { id: string; quantity: number }) {
    await delay(150);
    maybeThrowOffline();

    const target = getDb().pharmacy.find((row) => row.id === payload.id);
    if (!target) throw new Error('Medicine not found.');
    target.stock = Math.max(0, target.stock - Math.max(1, payload.quantity));
    bumpRevision();
    return target;
  },

  async listLabOrders(params: QueryListParams = {}) {
    await delay(200);
    maybeThrowOffline();

    let rows = [...getDb().labOrders];
    const query = normalize(params.search);
    if (query) rows = rows.filter((row) => includesValue(row.patientName, query) || includesValue(row.testName, query));
    if (params.status) rows = rows.filter((row) => row.status === params.status);

    return {
      ...paginate(rows, params.page, params.pageSize),
      revision: getDb().revision
    };
  },

  async updateLabResult(payload: { id: string; status: LabOrder['status']; result?: string }) {
    await delay(220);
    maybeThrowOffline();

    const target = getDb().labOrders.find((row) => row.id === payload.id);
    if (!target) throw new Error('Lab order not found.');
    target.status = payload.status;
    if (payload.result != null) target.result = payload.result;
    bumpRevision();
    return target;
  },

  async listInvoices(params: QueryListParams = {}) {
    await delay(200);
    maybeThrowOffline();

    let rows = [...getDb().invoices];
    const query = normalize(params.search);
    if (query) rows = rows.filter((row) => includesValue(row.patientName, query) || includesValue(row.id, query));
    if (params.status) rows = rows.filter((row) => row.status === params.status);

    return {
      ...paginate(rows, params.page, params.pageSize),
      totalReceivable: rows.reduce((acc, row) => acc + (row.amount - row.paid), 0),
      revision: getDb().revision
    };
  },

  async recordPayment(payload: { id: string; amount: number }) {
    await delay(160);
    maybeThrowOffline();

    const target = getDb().invoices.find((row) => row.id === payload.id);
    if (!target) throw new Error('Invoice not found.');

    target.paid = Math.min(target.amount, target.paid + Math.max(1, payload.amount));
    target.status = target.paid === target.amount ? 'paid' : 'partial';
    bumpRevision();
    return target;
  },

  async getReports(params: { from?: string; to?: string; department?: string; doctor?: string }) {
    await delay(260);
    maybeThrowOffline();

    const appointments = getDb().appointments;
    const invoices = getDb().invoices;

    const revenueSummary = invoices.reduce((acc, row) => acc + row.paid, 0);
    const visits = appointments.filter((row) => row.status !== 'cancelled').length;
    const occupancy = Math.round((getDb().beds.filter((row) => row.status === 'occupied').length / getDb().beds.length) * 100);
    const labTurnaround = Math.round(
      (getDb().labOrders.filter((row) => row.status === 'completed').length / Math.max(1, getDb().labOrders.length)) * 100
    );

    const reportRows = [
      { metric: 'Revenue summary', value: `$${revenueSummary.toLocaleString()}` },
      { metric: 'Patient visits', value: String(visits) },
      { metric: 'Bed occupancy', value: `${occupancy}%` },
      { metric: 'Lab turnaround', value: `${labTurnaround}%` },
      { metric: 'Pharmacy sales', value: `$${Math.round(revenueSummary * 0.16).toLocaleString()}` }
    ];

    return {
      filters: params,
      rows: reportRows,
      revision: getDb().revision
    };
  },

  async getSettings() {
    await delay(130);
    maybeThrowOffline();

    return {
      hospitalName: 'Northstar General Hospital',
      timezone: 'America/New_York',
      departments: ['Cardiology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Emergency', 'Laboratory'],
      notifications: {
        appointmentReminders: true,
        dischargeAlerts: true,
        lowStockAlerts: true
      },
      auditLogs: getDb().activity,
      revision: getDb().revision
    };
  },

  async getRecentActivity(): Promise<ActivityEvent[]> {
    await delay(100);
    maybeThrowOffline();
    return getDb().activity;
  }
};
