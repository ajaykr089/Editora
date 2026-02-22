import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from '@/app/layout/AppShell';
import { RoleGuard } from '@/app/guards/RoleGuard';
import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ForbiddenPage from '@/pages/common/ForbiddenPage';
import NotFoundPage from '@/pages/common/NotFoundPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PatientsPage from '@/pages/patients/PatientsPage';
import PatientProfilePage from '@/pages/patients/PatientProfilePage';
import AppointmentsPage from '@/pages/appointments/AppointmentsPage';
import StaffPage from '@/pages/staff/StaffPage';
import WardsPage from '@/pages/wards/WardsPage';
import PharmacyPage from '@/pages/pharmacy/PharmacyPage';
import LaboratoryPage from '@/pages/lab/LaboratoryPage';
import BillingPage from '@/pages/billing/BillingPage';
import ReportsPage from '@/pages/reports/ReportsPage';
import SettingsPage from '@/pages/settings/SettingsPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />

      <Route
        path="/"
        element={
          <RoleGuard>
            <AppShell />
          </RoleGuard>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/:patientId" element={<PatientProfilePage />} />

        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="staff" element={<RoleGuard allow={['admin']}><StaffPage /></RoleGuard>} />
        <Route path="wards" element={<WardsPage />} />
        <Route path="pharmacy" element={<PharmacyPage />} />
        <Route path="laboratory" element={<LaboratoryPage />} />
        <Route path="billing" element={<BillingPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
