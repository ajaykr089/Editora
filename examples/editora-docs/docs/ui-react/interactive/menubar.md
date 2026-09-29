---
title: Menubar
description: Top-level application or editor menu bar.
sidebar_label: Menubar
---

# Menubar

```tsx live
function MenubarDemo() {
  return (
    <ThemeProvider>
      <Menubar
        selected={0}
        placement="bottom"
        closeOnSelect
        onSelect={(detail) => console.log(detail.value)}
      >
        <button>File</button>
        <button>Edit</button>
        <button>View</button>
      </Menubar>
    </ThemeProvider>
  );
}
```

## Key Props

`selected`, `open`, `loop`, `headless`, `orientation`, `placement`, `variant`, `density`, `shape`, `elevation`, `tone`, `closeOnSelect`, `typeahead`, `onChange`, `onOpen`, `onClose`, `onSelect`
