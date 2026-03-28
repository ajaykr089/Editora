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
  Input,
  MultiSelect,
  Rating,
  Sortable,
  type SortableChangeDetail,
  type SortableItem,
  type SortableSelectionChangeDetail,
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

const sortableLists = [
  {
    id: 'templates',
    label: 'Templates',
    description: 'Clone-only source list',
    cloneOnDrag: true,
    emptyLabel: 'No reusable templates left.'
  },
  {
    id: 'backlog',
    label: 'Backlog',
    description: 'Primary planning queue',
    emptyLabel: 'Drop backlog work here.'
  },
  {
    id: 'active',
    label: 'In Progress',
    description: 'Current sprint focus',
    emptyLabel: 'Nothing active right now.'
  },
  {
    id: 'done',
    label: 'Done',
    description: 'Horizontal closeout lane',
    orientation: 'horizontal' as const,
    emptyLabel: 'Ship something to complete the lane.'
  }
];

const initialSortableItems: SortableItem[] = [
  { id: 'template-story', label: 'Story template', description: 'Reusable outline for content tickets', listId: 'templates', cloneOnDrag: true },
  { id: 'template-qa', label: 'QA checklist', description: 'Regression and smoke test template', listId: 'templates', cloneOnDrag: true },
  { id: 'epic-release', label: 'Release epic', description: 'Top-level parent for launch work', listId: 'backlog' },
  { id: 'brief', label: 'Draft launch brief', description: 'Can be nested under the epic', listId: 'backlog', parentId: 'epic-release' },
  { id: 'review', label: 'Design review', description: 'Currently blocked on content timing', listId: 'active' },
  { id: 'handoff', label: 'Support handoff', description: 'Ready once QA signs off', listId: 'done' },
];

export default function WorkflowPage() {
  const [team, setTeam] = React.useState('engineering');
  const [notifyTeams, setNotifyTeams] = React.useState<string[]>(['ops', 'eng']);
  const [repos, setRepos] = React.useState<string[]>(['editora', 'design']);
  const [rating, setRating] = React.useState(4);
  const [wizardValue, setWizardValue] = React.useState('details');
  const [uploadStatus, setUploadStatus] = React.useState('No upload event yet.');
  const [sortableItems, setSortableItems] = React.useState(initialSortableItems);
  const [sortableSelection, setSortableSelection] = React.useState<string[]>(['epic-release']);
  const [sortableFilter, setSortableFilter] = React.useState('');
  const [sortableSort, setSortableSort] = React.useState<'manual' | 'label'>('manual');
  const [sortableDropzoneStyle, setSortableDropzoneStyle] = React.useState<'indicator' | 'container'>('container');
  const [sortableStatus, setSortableStatus] = React.useState('Waiting for drag-and-drop activity.');

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
            eyebrow="Drag And Drop"
            title="Multi-list sortable workspace"
            description="This surface demonstrates single-list reordering, multi-list transfer, nesting, multi-selection, handle-only dragging, cloning, configurable dropzone styles, keyboard cancel, filter-aware drag locks, and persisted ordering."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={{ ...stageStyle, width: '100%', display: 'grid', gap: 12 }}>
                <Box style={eyebrowStyle}>Controls</Box>
                <Grid style={{ display: 'grid', gap: 12, gridTemplateColumns: 'minmax(0, 1fr) auto auto auto auto' }}>
                  <Input
                    label="Filter cards"
                    placeholder="Type to filter labels and descriptions"
                    value={sortableFilter}
                    onChange={setSortableFilter}
                  />
                  <Button
                    recipe={sortableSort === 'manual' ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => setSortableSort('manual')}
                  >
                    Manual sort
                  </Button>
                  <Button
                    recipe={sortableSort === 'label' ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => setSortableSort('label')}
                  >
                    A-Z lock
                  </Button>
                  <Button
                    recipe={sortableDropzoneStyle === 'indicator' ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => setSortableDropzoneStyle('indicator')}
                  >
                    Line targets
                  </Button>
                  <Button
                    recipe={sortableDropzoneStyle === 'container' ? 'solid' : 'outline'}
                    size="sm"
                    onClick={() => setSortableDropzoneStyle('container')}
                  >
                    Container targets
                  </Button>
                </Grid>
                <Box style={hintStyle}>
                  Try multi-select with Cmd/Ctrl-click or Shift-click. Press Space on a focused item to lift it, arrow keys to move the destination, and Escape to cancel. Switch between line-style and container-style dropzones to match how explicit you want insertion targets to feel.
                </Box>
              </Box>

              <Sortable
                lists={sortableLists}
                items={sortableItems}
                selection={sortableSelection}
                filterQuery={sortableFilter}
                sort={sortableSort}
                dropzoneStyle={sortableDropzoneStyle}
                persistKey="workflow-sortable-demo"
                onItemsChange={setSortableItems}
                onSelectionChange={(detail: SortableSelectionChangeDetail) => setSortableSelection(detail.selection)}
                onPersistRequest={(detail: SortableChangeDetail) =>
                  setSortableStatus(
                    `${detail.operation} via ${detail.source}: ${detail.movedIds.join(', ')}. ` +
                    `Persist ${detail.persistence.records.length} index records.`
                  )
                }
              />

              <Box style={{ ...stageStyle, width: '100%' }}>
                <Box style={eyebrowStyle}>Persistence</Box>
                <Box style={hintStyle}>{sortableStatus}</Box>
              </Box>
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
