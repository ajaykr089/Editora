import React, { useState } from 'react';
import { Box, Dropzone, FileUpload, Grid } from '@editora/ui-react';
import {
  ShowcasePage,
  ShowcaseSection,
  showcaseCaptionStyle,
  showcaseChipRowStyle,
  showcaseChipStyle,
  showcasePanelStyle
} from './storybook-showcase';

export default {
  title: 'UI/FileUpload',
  component: FileUpload,
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxFiles: { control: 'number' },
    maxSize: { control: 'number' },
    buttonText: { control: 'text' },
    dropLabel: { control: 'text' },
    uploadOnSelect: { control: 'boolean' },
    uploadButtonText: { control: 'text' }
  }
};

export const Playground = (args: any) => {
  const [names, setNames] = useState<string[]>([]);
  return (
    <ShowcasePage
      eyebrow="File Intake"
      title="Upload surfaces should feel operationally trustworthy, not like a browser-default afterthought"
      description="These stories validate pickup, drag-and-drop hierarchy, queue readability, and whether the upload contract looks at home in audit, asset, and ops workflows."
      meta={[
        { label: 'Accepts', value: args.accept },
        { label: 'Limit', value: `${args.maxFiles} files` },
        { label: 'Surface', value: 'Picker + dropzone', tone: 'success' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Default Pattern"
        title="Attachments"
        description="The base field should work in a form without losing hierarchy or overwhelming the surrounding layout."
      >
        <Box style={{ maxWidth: 680, display: 'grid', gap: 16 }}>
          <div style={showcaseChipRowStyle}>
            <span style={showcaseChipStyle}>Validation-aware</span>
            <span style={showcaseChipStyle}>Queue display</span>
            <span style={showcaseChipStyle}>Form-ready</span>
          </div>
          <FileUpload {...args} onChange={(files) => setNames(files.map((file) => file.name))} />
          <Box style={showcasePanelStyle}>
            <strong style={{ color: '#0f172a' }}>Selected files</strong>
            <Box style={{ color: '#64748b', fontSize: 13 }}>
              {names.length ? names.join(', ') : 'none'}
            </Box>
          </Box>
        </Box>
      </ShowcaseSection>
    </ShowcasePage>
  );
};

Playground.args = {
  label: 'Attachments',
  description: 'Upload release notes, screenshots, or audit artifacts.',
  accept: '.pdf,.png,.jpg',
  multiple: true,
  required: false,
  disabled: false,
  maxFiles: 4,
  maxSize: 5_000_000,
  buttonText: 'Browse files',
  dropLabel: 'Drop files here or browse',
  uploadOnSelect: false,
  uploadButtonText: 'Start upload'
};

export const DragAndDropSurface = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  return (
    <ShowcaseSection
      eyebrow="Operational Intake"
      title="Drag-and-drop evidence capture"
      description="The dropzone pattern should feel substantial enough for incident response and audit workflows, with a queue summary that stays readable as files accumulate."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <Dropzone
          label="Evidence bundle"
          description="Optimized for drag-and-drop ingestion in incident workflows."
          accept=".pdf,.csv,.json"
          multiple
          maxFiles={6}
          maxSize={8_000_000}
          showPreviews
          progress={progress}
          onChange={(next) => {
            setFiles(next.map((file) => file.name));
            const nextProgress: Record<string, number> = {};
            next.forEach((file, index) => {
              nextProgress[`${file.name}::${file.size}::${file.lastModified}`] = Math.min(100, 35 + index * 20);
            });
            setProgress(nextProgress);
          }}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Queued files</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>
            {files.length ? files.join(', ') : 'Drop files to populate the queue.'}
          </Box>
          <p style={showcaseCaptionStyle}>Use the side summary when the upload outcome drives a review or submission step nearby.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

function simulateUpload(delay = 420, shouldFail = false) {
  return async ({ signal, setProgress }: { signal: AbortSignal; setProgress(progress: number): void }) => {
    for (const progress of [18, 42, 67, 88, 100]) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      await new Promise((resolve) => setTimeout(resolve, delay / 5));
      setProgress(progress);
    }
    if (shouldFail) throw new Error('Server rejected this file');
  };
}

export const UploadWorkflow = () => {
  const [events, setEvents] = useState<string[]>([]);
  return (
    <ShowcaseSection
      eyebrow="Upload Workflow"
      title="Manual start upload with lifecycle feedback"
      description="This is the production path for review or submission workflows where files should be queued first and uploaded only after user confirmation."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <FileUpload
          label="Release assets"
          description="Queue files, then start upload when the batch is ready."
          accept=".zip,.pdf,.png"
          multiple
          maxFiles={5}
          maxSize={12_000_000}
          uploadButtonText="Start upload"
          onUploadRequest={simulateUpload()}
          onUploadStart={() => setEvents((current) => ['Upload started', ...current].slice(0, 5))}
          onUploadSuccess={(detail) => setEvents((current) => [`Uploaded ${detail.file?.name}`, ...current].slice(0, 5))}
          onUploadError={(detail) => setEvents((current) => [`Failed ${detail.file?.name}: ${detail.error}`, ...current].slice(0, 5))}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Recent lifecycle events</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>
            {events.length ? events.join(' | ') : 'Select files and start the upload to inspect the lifecycle.'}
          </Box>
          <p style={showcaseCaptionStyle}>Use this pattern when files must be reviewed before hitting the server.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

export const AutoUploadQueue = () => {
  const [summary, setSummary] = useState('Waiting for files');
  return (
    <ShowcaseSection
      eyebrow="Auto Upload"
      title="Automatic upload after selection"
      description="This path suits messenger, support, and intake tools where the interaction should immediately start the transfer."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <Dropzone
          label="Incident evidence"
          description="Files begin uploading as soon as they are dropped."
          multiple
          uploadOnSelect
          uploadButtonText="Uploading"
          onUploadRequest={simulateUpload(360)}
          onUploadStart={() => setSummary('Upload started')}
          onUploadComplete={() => setSummary('All uploads finished')}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Queue status</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>{summary}</Box>
          <p style={showcaseCaptionStyle}>Auto-start is best when there is no separate review gate.</p>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};

export const FailureAndRetry = () => {
  const [shouldFail, setShouldFail] = useState(true);
  return (
    <ShowcaseSection
      eyebrow="Recovery"
      title="Failure and retry workflow"
      description="A production uploader needs an honest failure path that leaves the queue actionable instead of silently resetting the file row."
    >
      <Grid style={{ display: 'grid', gap: 16, gridTemplateColumns: 'minmax(320px, 1fr) minmax(260px, 320px)' }}>
        <FileUpload
          label="Compliance package"
          description="The first attempt fails, then retries succeed."
          multiple
          uploadButtonText="Retry uploads"
          onUploadRequest={async (context) => {
            await simulateUpload(320, shouldFail)(context);
            setShouldFail(false);
          }}
        />
        <Box style={showcasePanelStyle}>
          <strong style={{ color: '#0f172a' }}>Failure contract</strong>
          <Box style={{ color: '#64748b', fontSize: 13 }}>
            First run returns a server error. Use the per-file retry action or the queue-level retry button to recover.
          </Box>
        </Box>
      </Grid>
    </ShowcaseSection>
  );
};
