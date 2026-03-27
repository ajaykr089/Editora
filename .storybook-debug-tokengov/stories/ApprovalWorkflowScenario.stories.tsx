import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditoraEditor } from "@editora/react";
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import {
  ApprovalWorkflowPlugin,
  BoldPlugin,
  HeadingPlugin,
  HistoryPlugin,
  ItalicPlugin,
  LinkPlugin,
  ListPlugin,
  TrackChangesPlugin,
  UnderlinePlugin,
} from "@editora/plugins";
import { Box, Grid } from "@editora/ui-react";

type WorkflowEventLog = {
  source: string;
  type: string;
  status: string;
  locked: boolean;
  comments: number;
  signoffs: number;
  time: string;
};

const meta: Meta = {
  title: "Editor/Plugins/Approval Workflow Scenario",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
      description: {
        component:
          "Scenario story for validating Approval Workflow in a realistic editorial process with required sign-off comments, lock-on-approval, and multi-instance checks.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function createScenarioPlugins(defaultActor: string) {
  return [
    HistoryPlugin(),
    HeadingPlugin(),
    BoldPlugin(),
    ItalicPlugin(),
    UnderlinePlugin(),
    ListPlugin(),
    LinkPlugin(),
    TrackChangesPlugin({
      author: defaultActor,
      enabledByDefault: true,
    }),
    ApprovalWorkflowPlugin({
      defaultStatus: "draft",
      lockOnApproval: true,
      requireCommentOnApprove: true,
      defaultActor,
    }),
  ];
}

export const PolicyMemoApprovalFlow: Story = {
  render: () => {
    const primaryWrapperRef = useRef<HTMLDivElement>(null);
    const secondaryWrapperRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<WorkflowEventLog[]>([]);

    const primaryPlugins = useMemo(() => createScenarioPlugins("Policy Owner"), []);
    const secondaryPlugins = useMemo(
      () => [
        HistoryPlugin(),
        ApprovalWorkflowPlugin({
          defaultStatus: "draft",
          lockOnApproval: true,
          requireCommentOnApprove: true,
          defaultActor: "Secondary Owner",
        }),
      ],
      [],
    );

    useEffect(() => {
      const handler = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{ state?: any }>;
        const state = event.detail?.state;
        if (!state) return;

        const target = event.target as Node | null;
        if (!target) return;

        let source = "";
        if (primaryWrapperRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryWrapperRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;

        const next: WorkflowEventLog = {
          source,
          type: event.type,
          status: String(state.status || "unknown"),
          locked: Boolean(state.locked),
          comments: Array.isArray(state.comments) ? state.comments.length : 0,
          signoffs: Array.isArray(state.signoffs) ? state.signoffs.length : 0,
          time: new Date().toLocaleTimeString(),
        };

        setEvents((prev) => [next, ...prev].slice(0, 12));
      };

      document.addEventListener("editora:approval-state-changed", handler as EventListener);
      document.addEventListener("editora:approval-state", handler as EventListener);

      return () => {
        document.removeEventListener("editora:approval-state-changed", handler as EventListener);
        document.removeEventListener("editora:approval-state", handler as EventListener);
      };
    }, []);

    return (
      <Grid style={{ display: "grid", gap: 16 }}>
        <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#f8fafc" }}>
          <h3 style={{ margin: 0 }}>Dummy Scenario: Security Incident Customer Memo</h3>
          <p style={{ margin: "8px 0 12px", lineHeight: 1.45 }}>
            Validate Draft - Review - Approved lifecycle with mandatory approval comment and editor lock.
          </p>
          <ol style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 6 }}>
            <li>Open workflow panel using Ctrl/Cmd + Alt + Shift + A.</li>
            <li>Add comment: Initial draft ready for review.</li>
            <li>Request review using toolbar button or Ctrl/Cmd + Alt + Shift + R.</li>
            <li>Try approve without comment. It should fail.</li>
            <li>Approve with comment and verify editor becomes read-only.</li>
            <li>Reopen draft with Ctrl/Cmd + Alt + Shift + D and confirm editing works again.</li>
            <li>Repeat actions in secondary editor to confirm state isolation.</li>
          </ol>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <Grid style={{ display: "grid", gap: 16 }}>
            <div ref={primaryWrapperRef}>
              <EditoraEditor
                plugins={primaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={`
                  <h2>Security Incident Customer Communication Memo</h2>
                  <p><strong>Owner:</strong> Content Lead | <strong>Audience:</strong> Enterprise Customers</p>
                  <h3>Summary</h3>
                  <p>A service disruption was detected on March 4, 2026. This memo outlines customer-facing messaging and next steps.</p>
                  <h3>Message Draft</h3>
                  <ul>
                    <li>Acknowledge the disruption and impact window.</li>
                    <li>Provide current mitigation status and next ETA checkpoint.</li>
                    <li>Include customer support channel and incident page link.</li>
                  </ul>
                  <p>Open Approval Workflow and follow the checklist above.</p>
                `}
              />
            </div>

            <div ref={secondaryWrapperRef}>
              <EditoraEditor
                plugins={secondaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={`
                  <h3>Secondary Memo (Instance Isolation Check)</h3>
                  <p>Use this editor to confirm approval state/comments do not leak from the primary memo.</p>
                `}
              />
            </div>
          </Grid>

          <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 8px" }}>Approval Event Log</h4>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#475569" }}>
              Captures <code>editora:approval-state-changed</code> and <code>editora:approval-state</code>.
            </p>
            {events.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>No approval events captured yet.</p>
            ) : (
              <ol style={{ margin: 0, paddingInlineStart: 18, display: "grid", gap: 8 }}>
                {events.map((entry, index) => (
                  <li key={`${entry.time}-${index}`} style={{ fontSize: 12, lineHeight: 1.4 }}>
                    [{entry.time}] {entry.source} | {entry.type} | status={entry.status} | locked=
                    {String(entry.locked)} | comments={entry.comments} | signoffs={entry.signoffs}
                  </li>
                ))}
              </ol>
            )}
          </Box>
        </Grid>
      </Grid>
    );
  },
};
