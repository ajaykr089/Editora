# Editora Hospital Management Admin (Example)

> [!IMPORTANT]
> **Live Website:** https://editora-ecosystem.netlify.app/  
> **Storybook:** https://editora-ecosystem-storybook.netlify.app/


Production-style hospital management dashboard built with the Editora UI ecosystem.

## Stack
- React 18 + TypeScript + Vite
- React Router
- TanStack Query
- React Hook Form + Zod
- Editora UI components: `@editora/ui-react`
- Icons: `@editora/react-icons`
- Toasts: `@editora/toast`
- Rich text notes: `@editora/editor` aliasing local Editora React editor
- Data layer: in-memory mock API (no backend required)

## Run
```bash
cd examples/hospital-management
npm install
npm run dev
```

App URL: `http://localhost:4180`

## Project Structure
```text
examples/hospital-management
├── src
│   ├── app
│   │   ├── auth
│   │   │   ├── AuthContext.tsx
│   │   │   ├── useAuth.ts
│   │   │   └── useRoleGuard.ts
│   │   ├── guards
│   │   │   └── RoleGuard.tsx
│   │   ├── layout
│   │   │   ├── AppShell.tsx
│   │   │   └── nav.ts
│   │   ├── providers
│   │   │   └── AppProviders.tsx
│   │   ├── routes
│   │   │   └── AppRouter.tsx
│   │   └── App.tsx
│   ├── pages
│   │   ├── auth
│   │   ├── dashboard
│   │   ├── patients
│   │   ├── appointments
│   │   ├── staff
│   │   ├── wards
│   │   ├── pharmacy
│   │   ├── lab
│   │   ├── billing
│   │   ├── reports
│   │   ├── settings
│   │   └── common
│   ├── shared
│   │   ├── api/mockApi.ts
│   │   ├── mock/{seed.ts,database.ts}
│   │   ├── query/{keys.ts,hooks.ts}
│   │   ├── components
│   │   │   ├── EntityDataTable.tsx
│   │   │   ├── FiltersBar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── StateViews.tsx
│   │   │   └── useConfirmAction.tsx
│   │   ├── types/domain.ts
│   │   └── utils/format.ts
│   ├── main.tsx
│   └── styles.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Routing Map
- `/login`
- `/forgot-password`
- `/forbidden`
- `/dashboard`
- `/patients`
- `/patients/:patientId`
- `/appointments`
- `/staff` (admin only)
- `/wards`
- `/pharmacy`
- `/laboratory`
- `/billing`
- `/reports`
- `/settings`
- `*` -> not found

## Implemented Modules
1. Dashboard overview
- KPI cards, trend charts, activity feed, quick actions

2. Patients
- Search/filter/paginated table
- Create/edit patient (RHF+Zod)
- Archive confirmation
- Profile page with demographics, encounters, documents, notes editor

3. Appointments
- List + calendar tabs
- Status transitions (check-in, complete, cancel)
- Booking wizard with stepper

4. Staff
- Staff roster with filters
- RBAC permission matrix

5. Wards/Beds
- Bed board with status visualization
- Admission assign flow
- Discharge flow

6. Pharmacy
- Medicine catalog, low-stock + near-expiry indicators
- Dispense action with optimistic update

7. Laboratory
- Lab order table
- Result entry screen with rich text editor

8. Billing
- Invoice table and payment capture
- Receipts and insurance helper controls

9. Reports
- Date/department/doctor filters
- CSV export
- Prebuilt report matrix

10. Settings
- Hospital profile settings
- Notification toggles
- Audit logs view

## Shared Patterns Included
- `AppShell`: Sidebar + Topbar + breadcrumb + command palette
- `EntityDataTable`: reusable DataTable wrapper
- `FiltersBar`: consistent search/filter controls
- `useConfirmAction`: promise-based confirmations via AlertDialog provider
- Loading/empty/error views
- Offline-mode toggle + network failure behavior

## Mock API Endpoints Covered
- auth: login, forgot-password
- patients: list/get/save/archive
- appointments: list/create/status update
- staff: list + permissions
- wards/beds: list/assign/discharge
- pharmacy: list/dispense
- lab-orders/results: list/update
- billing/invoices/payments: list/record payment
- reports: summary matrix
- settings: profile/notifications/audit

## RBAC Model
Roles:
- `admin`, `receptionist`, `doctor`, `nurse`, `lab`, `pharmacy`, `billing`

Permissions are module-level (`read` / `write`) and exposed in:
- `src/shared/mock/seed.ts` -> `createPermissions()`

Guard enforcement:
- Route-level guard: `src/app/guards/RoleGuard.tsx`
- Role utility: `src/app/auth/useRoleGuard.ts`

## Add a New Module
1. Add route page in `src/pages/<module>/<Module>Page.tsx`.
2. Add nav item in `src/app/layout/nav.ts`.
3. Add mock API methods in `src/shared/api/mockApi.ts`.
4. Add query hook in `src/shared/query/hooks.ts`.
5. Reuse `PageHeader`, `FiltersBar`, `EntityDataTable`, and state components.
6. Add role restrictions via `roles` in nav item and `RoleGuard` if needed.
