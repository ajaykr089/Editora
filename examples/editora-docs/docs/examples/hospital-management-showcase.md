---
title: Hospital Management Showcase
sidebar_position: 1
description: Advanced showcase application for @editora/ui-react using a hospital operations workflow.
keywords: [hospital management, ui-react, showcase, advanced example, admin app]
---

# Hospital Management Showcase

`examples/hospital-management` is the advanced application showcase for `@editora/ui-react`.

It is a production-style admin app that exercises real workflows instead of isolated component demos. The app combines routing, mock API state, role-aware navigation, rich forms, tables, overlays, and editor-driven record management in one place.

## Why this example exists

Use this app when you want to see how Editora components behave together in a real system:

- `PageHeader`, `PageToolbar`, `RecordHeader`
- `DataViewToolbar`, `FiltersBar`, `DataTable`, `Pagination`
- `DatePicker`, `DateRangePicker`, `Calendar`, `Stepper`
- `Drawer`, `Dialog`, `Accordion`, `HoverCard`, `QuickActions`, `CommandPalette`
- `Stat`, `MetricCard`, `Progress`, `Chart`, `Timeline`, `Marquee`
- `ThemeProvider`, `AlertDialogProvider`, toast flows, and editor integration

## App modules

- Dashboard: operational metrics, trends, activity, and quick actions
- Patients: searchable records, profile tabs, document upload, and chart workspace drawer
- Appointments: scheduling toolbar, calendar focus, booking wizard, and queue workspace drawer
- Staff: roster filters, stat summaries, RBAC matrix, and profile drawer
- Wards: occupancy monitoring, progress indicators, admissions, and discharge flow
- Pharmacy: inventory stats, hover previews, stock drawer, dispense, and restock flow
- Laboratory: order creation, result editing, and report preview workflow
- Billing: collections toolbar, claim helper, hover previews, invoice workspace drawer, and payment capture
- Reports: date-range reporting, KPIs, and trend charts
- Settings: profile controls, import/export, notification config, and audit log accordion

## Run locally

```bash
cd examples/hospital-management
npm install
npm run dev
```

Default local URL:

```text
http://127.0.0.1:4180/
```

## Best way to evaluate it

1. Open `Dashboard` and use the floating quick actions launcher.
2. Open `Patients` and inspect record drawers from encounters, documents, labs, and invoices.
3. Open `Appointments` and compare list hover previews, calendar focus, and workspace drawer actions.
4. Open `Pharmacy` and `Billing` to test hover-card plus drawer workflows against live mock mutations.
5. Toggle offline mode in the shell to check failure handling.

## Related pages

- Live examples: `/docs/examples/live-examples`
- `@editora/ui-react`: `/docs/ui-react`
- Package reference: `/docs/packages/ui-react`
