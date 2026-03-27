'use client';

import React from 'react';
import {
  Badge,
  Box,
  Button,
  Combobox,
  DirectionProvider,
  Dropzone,
  FileUpload,
  Grid,
  MultiSelect,
  Rating,
  Timeline,
  TransferList,
  Wizard,
} from '@editora/ui-react';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, hintStyle, stageStyle } from '../showcase/shared';

const notifyOptions = [
  { label: 'Core', options: [{ value: 'ops', label: 'Operations' }, { value: 'eng', label: 'Engineering' }] },
  { value: 'support', label: 'Support' },
  { value: 'finance', label: 'Finance' },
];

const repoOptions = [
  { value: 'editora', label: 'Editora', description: 'Editor platform' },
  { value: 'docs', label: 'Docs portal', description: 'Marketing and docs' },
  { value: 'design', label: 'Design system', description: 'Tokens and primitives' },
  { value: 'website', label: 'Website', description: 'Public site' },
];

const releaseTimeline = [
  { title: 'Requirements frozen', time: '09:10', tone: 'info' as const },
  { title: 'Design approved', time: '10:45', tone: 'success' as const },
  { title: 'QA flagged a regression', time: '12:20', tone: 'warning' as const, active: true },
  { title: 'Launch window reserved', time: '14:05', tone: 'default' as const },
];

export default function WorkflowPage() {
  const [team, setTeam] = React.useState('engineering');
  const [notifyTeams, setNotifyTeams] = React.useState<string[]>(['ops', 'eng']);
  const [repos, setRepos] = React.useState<string[]>(['editora', 'design']);
  const [rating, setRating] = React.useState(4);
  const [wizardValue, setWizardValue] = React.useState('details');
  const [uploadStatus, setUploadStatus] = React.useState('No upload event yet.');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/workflow"
        eyebrow="Workflow"
        title="Advanced inputs and process surfaces"
        description="This route demonstrates richer workflow and data-entry wrappers that were still missing from the fixture: comboboxes, multi-select controls, transfer lists, uploads, timelines, ratings, and wizard flows."
      >
        <Grid
          style={{
            display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 18,
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Selection"
            title="Combobox, multi-select, and transfer list"
            description="These wrappers cover higher-complexity selection patterns beyond the basic form controls already shown on the forms route."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Combobox
                value={team}
                clearable
                label="Primary team"
                placeholder="Select team..."
                onChange={(next) => setTeam(next)}
              >
                <Combobox.Option value="design" description="Design systems and experience">Design</Combobox.Option>
                <Combobox.Option value="engineering" description="Platform and application delivery">Engineering</Combobox.Option>
                <Combobox.Option value="product" description="Planning and scope">Product</Combobox.Option>
                <Combobox.Option value="operations" description="Rollout and support">Operations</Combobox.Option>
              </Combobox>

              <MultiSelect
                label="Notify teams"
                placeholder="Choose recipients"
                clearable
                selectionIndicator="check"
                variant="soft"
                radius={12}
                options={notifyOptions}
                value={notifyTeams}
                onValueChange={setNotifyTeams}
              />

              <TransferList
                label="Assigned repositories"
                description="Grant access by moving repositories into the selected column."
                variant="soft"
                tone="brand"
                size="md"
                options={repoOptions}
                value={repos}
                onValueChange={setRepos}
              />
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Progress"
            title="Rating, timeline, and wizard"
            description="These components make process state visible, from lightweight scoring all the way up to a structured multi-step flow."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Rating</Box>
                <Rating
                  value={rating}
                  max={5}
                  showValue
                  label="Launch confidence"
                  onChange={(detail) => setRating(detail.value)}
                />
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Timeline</Box>
                <Timeline items={releaseTimeline} />
              </Box>

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Wizard</Box>
                <Wizard
                  value={wizardValue}
                  linear
                  showStepper
                  showProgress
                  nextLabel="Continue"
                  finishLabel="Deploy"
                  onChange={(detail) => setWizardValue(detail.value)}
                  onComplete={(detail) => setUploadStatus(`Wizard completed on step: ${detail.title}`)}
                >
                  <Wizard.Step value="details" title="Details" description="Define the release scope">
                    <Box style={{ display: 'grid', gap: 8 }}>
                      <Badge tone="info">Checklist captured</Badge>
                      <Box style={hintStyle}>Current wizard value: <strong>{wizardValue}</strong></Box>
                    </Box>
                  </Wizard.Step>
                  <Wizard.Step value="review" title="Review" description="Confirm risk and quality bars">
                    <Box style={{ display: 'grid', gap: 8 }}>
                      <Badge tone="warning">Regression review pending</Badge>
                    </Box>
                  </Wizard.Step>
                  <Wizard.Step value="launch" title="Launch" description="Complete rollout and handoff">
                    <Box style={{ display: 'grid', gap: 8 }}>
                      <Badge tone="success">Ready to deploy</Badge>
                    </Box>
                  </Wizard.Step>
                </Wizard>
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Uploads"
            title="File upload and dropzone"
            description="Both upload wrappers are mounted here with the same upload bridge so you can test the standard picker surface and the drag-forward dropzone variant."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <FileUpload
                label="Attachments"
                description="PDF or image files up to 5 MB."
                accept=".pdf,image/*"
                multiple
                maxFiles={5}
                maxSize={5_000_000}
                showPreviews
                uploadOnSelect
                onChange={(files) => setUploadStatus(`FileUpload selected ${files.length} file(s).`)}
                onReject={(rejected) => setUploadStatus(`Rejected ${rejected.length} file(s).`)}
                onUploadRequest={async ({ file, setProgress }) => {
                  setUploadStatus(`Uploading ${file.name}...`);
                  setProgress(25);
                  setProgress(100);
                  setUploadStatus(`Uploaded ${file.name}.`);
                  return { id: file.name };
                }}
              />

              <Dropzone
                label="Drop assets"
                description="Use the drag-focused variant for screenshots and supporting assets."
                accept="image/*"
                multiple
                showPreviews
                onChange={(files) => setUploadStatus(`Dropzone selected ${files.length} file(s).`)}
              />

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Upload status</Box>
                <Box style={hintStyle}>{uploadStatus}</Box>
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
