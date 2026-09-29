---
title: Wizard
description: Step-based flow wrapper with progress and lifecycle hooks.
sidebar_label: Wizard
---

# Wizard

```tsx live
function WizardDemo() {
  return (
    <ThemeProvider>
      <Wizard
        value="details"
        linear
        showStepper
        showProgress
        nextLabel="Continue"
        finishLabel="Deploy"
        onComplete={(detail) => console.log(detail.value)}
      >
        <section value="details" title="Details">Details step</section>
        <section value="review" title="Review">Review step</section>
      </Wizard>
    </ThemeProvider>
  );
}
```

## Key Props

`value`, `linear`, `showStepper`, `stepperPosition`, `hideControls`, `keepMounted`, `variant`, `orientation`, `density`, `shape`, `showProgress`, `busy`, `headless`, `title`, `description`, `emptyLabel`, `nextLabel`, `prevLabel`, `finishLabel`, `onBeforeChange`, `onChange`, `onStepChange`, `onComplete`
