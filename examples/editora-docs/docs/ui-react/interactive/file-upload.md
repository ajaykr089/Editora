---
title: File Upload
description: Interactive upload surface with queue lifecycle callbacks.
sidebar_label: File Upload
---

# File Upload

```tsx
import { Dropzone } from '@editora/ui-react';

<Dropzone
  label="Drop assets"
  dropLabel="Drop files here"
  accept="image/*"
  multiple
  showPreviews
  onChange={(files) => console.log(files)}
  onUploadRequest={async ({ file, setProgress }) => {
    setProgress(100);
    return { name: file.name };
  }}
/>;
```

## Key Props

`name`, `label`, `description`, `accept`, `multiple`, `disabled`, `required`, `maxFiles`, `maxSize`, `buttonText`, `dropLabel`, `showPreviews`, `progress`, `uploadOnSelect`, `uploadButtonText`, `onUploadRequest`, `onChange`, `onReject`, `onUploadStart`, `onUploadProgress`, `onUploadSuccess`, `onUploadError`, `onUploadCancel`, `onUploadComplete`
