import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mockApi } from '@/shared/api/mockApi';
import { qk } from '@/shared/query/keys';
import { QueryListParams } from '@/shared/types/domain';

export function useDashboardQuery() {
  return useQuery({
    queryKey: qk.dashboard,
    queryFn: () => mockApi.getDashboard(),
    refetchInterval: 25_000
  });
}

export function usePatientsQuery(params: QueryListParams) {
  return useQuery({
    queryKey: qk.patients(params),
    queryFn: () => mockApi.listPatients(params)
  });
}

export function usePatientQuery(id: string) {
  return useQuery({
    queryKey: qk.patient(id),
    queryFn: () => mockApi.getPatient(id),
    enabled: !!id
  });
}

export function useSavePatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.savePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function useArchivePatientMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.archivePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function useAppointmentsQuery(params: QueryListParams) {
  return useQuery({
    queryKey: qk.appointments(params),
    queryFn: () => mockApi.listAppointments(params)
  });
}

export function useCreateAppointmentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function useUpdateAppointmentStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.updateAppointmentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function useStaffQuery(params: QueryListParams) {
  return useQuery({
    queryKey: qk.staff(params),
    queryFn: () => mockApi.listStaff(params)
  });
}

export function useBedsQuery(params: QueryListParams) {
  return useQuery({
    queryKey: qk.beds(params),
    queryFn: () => mockApi.listBeds(params)
  });
}

export function useAssignBedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.assignBed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function useDischargeBedMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.dischargeBed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beds'] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function usePharmacyQuery(params: QueryListParams) {
  return useQuery({
    queryKey: qk.pharmacy(params),
    queryFn: () => mockApi.listPharmacy(params)
  });
}

export function useDispenseMedicineMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.dispenseMedicine,
    onMutate: async ({ id, quantity }: { id: string; quantity: number }) => {
      await queryClient.cancelQueries({ queryKey: ['pharmacy'] });
      const previous = queryClient.getQueriesData({ queryKey: ['pharmacy'] });
      queryClient.setQueriesData({ queryKey: ['pharmacy'] }, (prev: any) => {
        if (!prev?.items) return prev;
        return {
          ...prev,
          items: prev.items.map((item: any) =>
            item.id === id ? { ...item, stock: Math.max(0, item.stock - Math.max(1, quantity)) } : item
          )
        };
      });
      return { previous };
    },
    onError: (_error: unknown, _variables: unknown, ctx: any) => {
      ctx?.previous?.forEach(([queryKey, data]: [unknown, unknown]) => queryClient.setQueryData(queryKey as any, data));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacy'] });
    }
  });
}

export function useLabOrdersQuery(params: QueryListParams) {
  return useQuery({
    queryKey: qk.labs(params),
    queryFn: () => mockApi.listLabOrders(params)
  });
}

export function useUpdateLabResultMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.updateLabResult,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labs'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function useInvoicesQuery(params: QueryListParams) {
  return useQuery({
    queryKey: qk.invoices(params),
    queryFn: () => mockApi.listInvoices(params)
  });
}

export function useRecordPaymentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.recordPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: qk.dashboard });
    }
  });
}

export function useReportsQuery(params: { from?: string; to?: string; department?: string; doctor?: string }) {
  return useQuery({
    queryKey: qk.reports(params),
    queryFn: () => mockApi.getReports(params)
  });
}

export function useSettingsQuery() {
  return useQuery({
    queryKey: qk.settings,
    queryFn: () => mockApi.getSettings()
  });
}

export function useOfflineModeMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mockApi.setOfflineMode,
    onSuccess: () => queryClient.invalidateQueries()
  });
}
