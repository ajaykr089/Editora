---
"@editora/ui-react": patch
---

`ToastProvider`, `useToast` and the toast API import `@editora/toast/lite`, the entry without the built-in stylesheet: they load `toast.css` themselves (or the app does, as the toast docs say), so the copy built into the main entry of `@editora/toast` 2.2 would have been shipped twice. Their size stays as it was (Toast 14.9 KB, ToastAPI 11.5 KB gzipped, against 18.8 and 15.4 with the main entry).
