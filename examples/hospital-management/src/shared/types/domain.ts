export type Role = 'admin' | 'receptionist' | 'doctor' | 'nurse' | 'lab' | 'pharmacy' | 'billing';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
};

export type PatientStatus = 'active' | 'admitted' | 'discharged' | 'critical' | 'archived';

export type Patient = {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  status: PatientStatus;
  phone: string;
  email: string;
  insurance: string;
  address: string;
  allergies: string[];
  conditions: string[];
  emergencyContact: string;
  notes: string;
  updatedAt: string;
};

export type AppointmentStatus = 'scheduled' | 'arrived' | 'in-consultation' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  slot: string;
  status: AppointmentStatus;
  queueToken?: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: Role;
  department: string;
  status: 'active' | 'leave';
  shift: string;
};

export type BedStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved';

export type Bed = {
  id: string;
  ward: string;
  floor: string;
  status: BedStatus;
  patientId?: string;
  patientName?: string;
  assignedDoctor?: string;
};

export type PharmacyItem = {
  id: string;
  name: string;
  sku: string;
  batch: string;
  expiry: string;
  stock: number;
  reorderPoint: number;
};

export type LabStatus = 'ordered' | 'collected' | 'processing' | 'completed';

export type LabOrder = {
  id: string;
  patientId: string;
  patientName: string;
  testName: string;
  orderedAt: string;
  status: LabStatus;
  result: string;
};

export type InvoiceStatus = 'pending' | 'partial' | 'paid';

export type Invoice = {
  id: string;
  patientId: string;
  patientName: string;
  amount: number;
  paid: number;
  status: InvoiceStatus;
  createdAt: string;
};

export type ActivityEvent = {
  id: string;
  level: 'info' | 'warning' | 'critical' | 'success';
  message: string;
  time: string;
};

export type PermissionMatrix = Record<Role, Record<string, 'read' | 'write'>>;

export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type QueryListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  department?: string;
};
