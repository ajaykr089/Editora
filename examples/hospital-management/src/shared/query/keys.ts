export const qk = {
  dashboard: ['dashboard'] as const,
  patients: (params: Record<string, unknown>) => ['patients', params] as const,
  patient: (id: string) => ['patients', id] as const,
  appointments: (params: Record<string, unknown>) => ['appointments', params] as const,
  staff: (params: Record<string, unknown>) => ['staff', params] as const,
  beds: (params: Record<string, unknown>) => ['beds', params] as const,
  pharmacy: (params: Record<string, unknown>) => ['pharmacy', params] as const,
  labs: (params: Record<string, unknown>) => ['labs', params] as const,
  invoices: (params: Record<string, unknown>) => ['invoices', params] as const,
  reports: (params: Record<string, unknown>) => ['reports', params] as const,
  settings: ['settings'] as const
};
