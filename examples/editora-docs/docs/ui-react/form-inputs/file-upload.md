---
title: File Upload
description: File intake and upload queue component for forms.
sidebar_label: File Upload
---

# File Upload

```tsx
import { FileUpload } from '@editora/ui-react';

<FileUpload
  label="Attachments"
  description="PDF or image files up to 5 MB."
  accept=".pdf,image/*"
  multiple
  maxFiles={5}
  maxSize={5_000_000}
  showPreviews
  uploadOnSelect
  onChange={(files) => console.log(files)}
  onUploadRequest={async ({ file, setProgress }) => {
    setProgress(25);
    setProgress(100);
    return { id: file.name };
  }}
/>;
```

## Key Props

`name`, `label`, `description`, `accept`, `multiple`, `disabled`, `required`, `maxFiles`, `maxSize`, `buttonText`, `dropLabel`, `showPreviews`, `progress`, `uploadOnSelect`, `uploadButtonText`, `onUploadRequest`, `onChange`, `onReject`, `onUploadStart`, `onUploadProgress`, `onUploadSuccess`, `onUploadError`, `onUploadCancel`, `onUploadComplete`

## Notes

- `onUploadRequest` is where application code connects the component to a real backend upload.
- Use `Dropzone` when you want the same upload contract with a more drag-and-drop focused surface.
