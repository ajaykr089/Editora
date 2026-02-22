You are a senior product engineer + UX designer building a **full functional Hospital Management Admin Dashboard** as a production-grade SaaS app.

PRIMARY GOAL
Build a complete, working admin dashboard (frontend-first) for a hospital management system with a clean, modern UI/UX (Radix/MUI-level polish), using the Editora UI ecosystem.
use flat design
if you see any ui component or variation missing, you are welcome to create /  update the ui component here : /Users/etelligens/Documents/Rich-Text-Editor/packages/ui-core/src/components

TECH STACK (MANDATORY)
- React 18 + TypeScript + Vite
- Routing: React Router
- Data fetching: TanStack Query (React Query)
- Forms: React Hook Form + Zod validation
- Tables: build using @editora/ui-react table components (no external table libs unless absolutely necessary)
- Styling: ONLY via @editora/ui-react props/tokens/classes; do not introduce Tailwind/Chakra/MUI
- Icons: @editora/react-icons ONLY
- Toasts/notifications: @editora/toast ONLY
- Rich text editor: @editora/editor ONLY (wherever rich text is needed)
- State: minimal, prefer query cache; for global UI state use React Context (no Redux)
- Must be SSR-friendly patterns (no window/document on module scope)

DESIGN SYSTEM (MANDATORY)
- Use @editora/ui-react components everywhere:
  Buttons, Inputs, Selects, Dialogs/AlertDialogs, Drawers, Tabs, Cards, Badges, Chips, Breadcrumb, Pagination, Skeleton, Toast host, Tooltip, Popover, DropdownMenu, DatePicker (if available), Table, Sidebar, Topbar, Layout/Grid, Stepper/Wizard.
- Use a consistent layout:
  - Left Sidebar (collapsible) with grouped navigation
  - Topbar with global search, notifications, user menu, quick actions
  - Main content with responsive grid cards + data tables
- Provide polished states:
  - Loading skeletons, empty states, error states, disabled states, success states
  - Micro-interactions: hover/active/focus visible states, subtle transitions
- Accessibility: keyboard navigation, correct ARIA labels, focus rings, contrast-safe

APP MODULES (REQUIRED)
Build the following sections with real screens, routes, and CRUD UI:

1) Dashboard Overview
- KPIs: Today appointments, Admissions, Discharges, Bed occupancy %, Revenue (optional), Pending lab reports
- Charts: appointments trend, occupancy trend (use simple chart solution; if no chart component in @editora/ui-react, implement minimal SVG charts)
- Quick actions: Add patient, Create appointment, Create invoice, Add staff, Create lab order
- Recent activity feed: admissions/discharges, payments, critical alerts

2) Patient Management
- Patient list table: search, filters (age, gender, status), sort, pagination
- Patient profile page:
  - Demographics, contacts, insurance
  - Medical summary: allergies, conditions, vitals timeline
  - Visits/encounters list
  - Documents (upload + list)
  - Notes using @editora/editor
- CRUD: create/edit patient; soft delete; merge duplicates (basic UI)

3) Appointment & Scheduling
- Appointment list + calendar view (day/week/month)
- Booking flow with stepper:
  patient -> department -> doctor -> slot -> confirmation
- Reschedule, cancel, status changes
- Check-in flow: mark patient arrived + assign queue token

4) Doctor & Staff Management
- Staff list: doctors, nurses, admin, lab tech
- Roles & permissions UI (RBAC):
  - roles: admin, receptionist, doctor, nurse, lab, pharmacy, billing
  - permissions matrix (read/write)
- Doctor schedule: working hours, leaves

5) Ward / Bed Management
- Wards list, bed grid with status:
  available, occupied, cleaning, maintenance, reserved
- Admission flow:
  select patient -> assign bed -> assign doctor -> deposit/invoice
- Transfer bed / discharge patient
- Occupancy analytics

6) Pharmacy
- Medicines catalog: SKU, batch, expiry, stock
- Dispense flow with prescription:
  - create prescription (doctor)
  - dispense (pharmacy)
- Stock alerts: low stock, near expiry
- Purchase orders: create, receive, update stock

7) Laboratory
- Test catalog
- Lab orders: create from visit/appointment
- Sample collection status: ordered -> collected -> processing -> completed
- Result entry screen:
  - structured fields + optional rich text via @editora/editor
- Print/share lab report (generate PDF view page)

8) Billing & Invoicing
- Invoice list: pending/paid/partial
- Create invoice: services, room charges, lab, pharmacy
- Payments: cash/card/upi, refunds
- Insurance: policy details, claim status (basic UI)
- Receipts and invoice PDF page

9) Inventory / Assets (Optional but recommended)
- Consumables stock, suppliers, reorder points
- Assets: equipment tracking, maintenance schedules

10) Reports
- Filters by date range, department, doctor
- Export CSV
- Prebuilt reports:
  - revenue summary
  - patient visits
  - bed occupancy
  - lab turnaround time
  - pharmacy sales

11) System Settings
- Hospital profile, departments, services catalog/pricing
- Notification settings
- Audit logs view
- Data import/export

AUTH + SECURITY UX (REQUIRED)
- Login page + forgot password UI
- Session handling with token storage strategy (httpOnly cookie preferred; if not, secure storage pattern)
- Route guards by role
- “Forbidden” and “Not found” pages
- Audit log events for critical actions

DATA LAYER (REQUIRED)
- Create a mock API layer FIRST (MSW or in-memory) so the UI is fully functional without backend:
  - /auth/login
  - /patients
  - /appointments
  - /staff
  - /wards, /beds
  - /pharmacy, /inventory
  - /lab-orders, /lab-results
  - /billing/invoices, /payments
  - /reports
- Use TanStack Query for caching, pagination, invalidation
- Use optimistic updates for fast UX on simple actions
- Handle errors gracefully and show toasts via @editora/toast

UI/UX REQUIREMENTS (STRICT)
- Use @editora/ui-react components consistently: no raw HTML forms unless absolutely required
- Use @editora/react-icons for all iconography
- Use @editora/toast for:
  success/error/info, undo actions, background task status
- Use @editora/editor for rich text notes/results only
- Provide consistent spacing, typography, and responsive behavior
- Provide empty states with helpful call-to-actions
- Provide confirmation dialogs for destructive actions (delete, cancel appointment, discharge)

EDGE CASES (REQUIRED)
- Concurrent edits: show “data changed” banner and refresh option
- Network failures: retry UI, offline banner (basic)
- Long lists: virtualization if needed (only if @editora supports; otherwise pagination)
- Form validation: strong Zod schemas; show inline errors
- Accessibility: focus management in dialogs/drawers; keyboard navigation; aria labels

DELIVERABLES (MUST OUTPUT)
1) Project structure (folders and key files)
2) Full routing map
3) Layout components:
   - AppShell (Sidebar + Topbar + Content)
   - SidebarNav config
4) Core screens implemented with real, interactive UI:
   - Dashboard
   - Patient list + profile
   - Appointment list + booking wizard
   - Bed management board
   - Billing invoices + payments
   - Lab orders + result entry
5) Shared components library:
   - DataTable wrapper using @editora/ui-react
   - FiltersBar
   - PageHeader
   - ConfirmDialog (promise-based recommended)
   - EmptyState, ErrorState, Skeletons
6) Mock API using MSW or in-memory server
7) State & hooks:
   - useAuth, useRoleGuard
   - query hooks for each module
8) Seed data generator (patients, doctors, beds, invoices)
9) Toast integration examples
10) Documentation:
   - how to run
   - how to add a new module
   - RBAC model explanation

OUTPUT FORMAT (STRICT)
- Provide code in multiple blocks with file path headers (e.g. "// src/app/App.tsx")
- No TODO placeholders; provide working implementations
- Ensure imports reference @editora/ui-react, @editora/react-icons, @editora/toast, @editora/editor correctly
- Keep code consistent and runnable under Vite + TS

QUALITY BAR
- UX should feel like a mature admin product:
  fast navigation, polished tables, predictable forms, clear statuses, good empty/loading/error states.
- Prefer composable abstractions and clean domain models.
- Write secure patterns: no exposing sensitive data, avoid storing tokens in localStorage unless required.

START NOW
1) Propose the folder structure and routing map.
2) Implement AppShell (Sidebar + Topbar).
3) Implement Auth pages and route guards.
4) Implement Dashboard + Patients module end-to-end with mock API.
Then proceed module-by-module until the entire dashboard is functional.