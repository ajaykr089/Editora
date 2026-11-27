---
title: "Questionnaire"
description: "Asks a few questions one at a time: choices, free text, other answers, required, skippable and conditional questions."
sidebar_label: "Questionnaire"
---

# Questionnaire

:::info New in @editora/ui-react 0.7.0 and @editora/ui-core 0.7.0
:::

For an agent that clarifies a task before starting, and short onboarding flows.

```tsx
import { Question, Questionnaire } from '@editora/ui-react';

<Questionnaire shortcuts onSubmit={(values) => start(values)}>
  <Question name="scope" label="What should I build?" required>
    <option value="web">A web app</option>
    <option value="api" data-description="REST or GraphQL">An API</option>
  </Question>
  <Question name="auth" label="Which sign-in?" type="multiple" when="scope:web">
    <option value="email">Email</option>
    <option value="google">Google</option>
  </Question>
  <Question name="language" label="Language" allowOther>
    <option value="ts">TypeScript</option>
  </Question>
  <Question name="notes" label="Anything else?" type="text" placeholder="Optional" />
  <p slot="complete">Thanks, starting now.</p>
</Questionnaire>
```

Or pass the questions as data:

```tsx
<Questionnaire
  items={[
    { name: 'scope', label: 'What should I build?', required: true, options: [{ value: 'web', label: 'A web app' }] },
    { name: 'notes', label: 'Anything else?', type: 'text' },
  ]}
  defaultValues={saved}
  onChange={({ values }) => save(values)}
/>
```

## Behaviour

- One question at a time, with "Question 2 of 4" progress, Back, Skip (optional questions) and Next / Submit.
- `when="name:value"` asks a question only when that earlier answer is, or includes, `value`; the progress count follows. Answers to questions that no longer apply are not submitted.
- A required question cannot be passed unanswered: the error is shown, the answers are marked `aria-invalid` and described by it, and focus goes to the first answer.
- `shortcuts`: 1-9 pick a choice and Enter goes on (not while typing in a text answer).
- `onSubmit(values, event)`: call `event.preventDefault()` to keep it open (for example on a server error). The event does not bubble, so a surrounding `<form>` never takes it for its own submit.
- The ref is the element: `values`, `activeIndex`, `next()`, `previous()`, `skip()`, `goTo(name)`, `reset()`, `toFormData()`.

## Accessibility

Each question is a fieldset whose legend is its label, so screen readers read the question with its choices; a single choice is a radiogroup. Choices are native radios and checkboxes. After moving on, focus goes to the new question, so its label is read.

## Texts

`backLabel`, `nextLabel`, `skipLabel`, `submitLabel`, `otherLabel`, `requiredMessage`, `progressLabel` (`Question {current} of {total}`).

See the API reference for [Questionnaire](../api/questionnaire) and [Question](../api/question).
