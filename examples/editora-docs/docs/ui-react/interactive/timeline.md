---
title: Timeline
description: Ordered event list for histories and workflows.
sidebar_label: Timeline
---

# Timeline

```tsx live
function TimelineDemo() {
  return (
    <ThemeProvider>
      <Timeline
        items={[
          { title: 'Incident opened', time: '09:10', tone: 'warning' },
          { title: 'Mitigation deployed', time: '09:26', tone: 'success', active: true }
        ]}
      />
    </ThemeProvider>
  );
}
```

## Key Props

`items`, `variant`, `headless`
