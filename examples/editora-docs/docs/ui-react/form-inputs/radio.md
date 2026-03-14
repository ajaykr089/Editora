---
title: Radio
description: ui-react currently exposes grouped radio selection through RadioGroup.
sidebar_label: Radio
status: unavailable
---

# Radio

`@editora/ui-react` does not currently export a standalone `Radio` wrapper.

Use [Radio Group](./radio-group) for production usage. That is the supported API for single-choice selection in `ui-react`.

## Recommended Alternative

```tsx
import { RadioGroup } from '@editora/ui-react';

function PlanChoice() {
  return (
    <RadioGroup name="plan" value="pro" onChange={(detail) => console.log(detail.value)}>
      <button value="starter">Starter</button>
      <button value="pro">Pro</button>
      <button value="enterprise">Enterprise</button>
    </RadioGroup>
  );
}
```
