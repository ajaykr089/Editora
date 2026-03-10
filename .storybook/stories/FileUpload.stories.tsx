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
    dropLabel: { control: 'text' }
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
  dropLabel: 'Drop files here or browse'
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
