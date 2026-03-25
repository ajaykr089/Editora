import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { EditoraEditor } from "@editora/react";
import "@editora/themes/themes/default.css";
import "@editora/themes/themes/dark.css";
import {
  BoldPlugin,
  HeadingPlugin,
  HistoryPlugin,
  PIIRedactionPlugin,
  UnderlinePlugin,
} from "@editora/plugins";
import { Box, Grid } from "@editora/ui-react";

type PIIEventLog = {
  source: string;
  type: string;
  total: number;
  high: number;
  medium: number;
  low: number;
  redactedCount: number;
  time: string;
};

const meta: Meta = {
  title: "Editor/Plugins/PII Redaction Scenario",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
      description: {
        component:
          "Scenario story for validating PII detection/redaction lifecycle with realtime scan, redact-all flow, and multi-instance isolation.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function createPIIPlugins() {
  return [
    HistoryPlugin(),
    HeadingPlugin(),
    BoldPlugin(),
    UnderlinePlugin(),
    PIIRedactionPlugin({
      enableRealtime: true,
      redactionMode: "token",
      redactionToken: "REDACTED",
      maxFindings: 160,
    }),
  ];
}

export const SecurityComplianceReview: Story = {
  render: () => {
    const primaryRef = useRef<HTMLDivElement>(null);
    const secondaryRef = useRef<HTMLDivElement>(null);
    const [events, setEvents] = useState<PIIEventLog[]>([]);

    const primaryPlugins = useMemo(() => createPIIPlugins(), []);
    const secondaryPlugins = useMemo(
      () => [
        HistoryPlugin(),
        PIIRedactionPlugin({
          enableRealtime: true,
          redactionMode: "mask",
          maxFindings: 80,
        }),
      ],
      [],
    );

    useEffect(() => {
      const onScan = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{ findings?: any[]; stats?: any }>;
        const detail = event.detail || {};
        const stats = detail.stats || {};

        const target = event.target as Node | null;
        if (!target) return;

        let source = "";
        if (primaryRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;

        setEvents((prev) => [
          {
            source,
            type: event.type,
            total: Number(stats.total || 0),
            high: Number(stats.high || 0),
            medium: Number(stats.medium || 0),
            low: Number(stats.low || 0),
            redactedCount: Number(stats.redactedCount || 0),
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ].slice(0, 14));
      };

      const onRedacted = (rawEvent: Event) => {
        const event = rawEvent as CustomEvent<{ redactedCount?: number }>;
        const target = event.target as Node | null;
        if (!target) return;

        let source = "";
        if (primaryRef.current?.contains(target)) source = "Primary Memo";
        if (secondaryRef.current?.contains(target)) source = "Secondary Memo";
        if (!source) return;

        setEvents((prev) => [
          {
            source,
            type: event.type,
            total: 0,
            high: 0,
            medium: 0,
            low: 0,
            redactedCount: Number(event.detail?.redactedCount || 0),
            time: new Date().toLocaleTimeString(),
          },
          ...prev,
        ].slice(0, 14));
      };

      document.addEventListener("editora:pii-scan", onScan as EventListener);
      document.addEventListener("editora:pii-findings", onScan as EventListener);
      document.addEventListener("editora:pii-redacted", onRedacted as EventListener);

      return () => {
        document.removeEventListener("editora:pii-scan", onScan as EventListener);
        document.removeEventListener("editora:pii-findings", onScan as EventListener);
        document.removeEventListener("editora:pii-redacted", onRedacted as EventListener);
      };
    }, []);

    return (
      <Grid style={{ display: "grid", gap: 16 }}>
        <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 14, background: "#f8fafc" }}>
          <h3 style={{ margin: 0 }}>Dummy Scenario: Incident Memo Pre-Share PII Sweep</h3>
          <p style={{ margin: "8px 0 12px", lineHeight: 1.45 }}>
            Use the plugin before export/share to detect and redact sensitive values.
          </p>
          <ol style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 6 }}>
            <li>Open panel with Ctrl/Cmd + Alt + Shift + I.</li>
            <li>Run scan with Ctrl/Cmd + Alt + Shift + U.</li>
            <li>Verify email/phone/API key findings appear.</li>
            <li>Use Locate to inspect context, then redact selected findings.</li>
            <li>Run Redact All (Ctrl/Cmd + Alt + Shift + M) and re-scan to confirm clean result.</li>
            <li>Check secondary editor remains independent.</li>
          </ol>
        </Box>

        <Grid style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
          <Grid style={{ display: "grid", gap: 16 }}>
            <div ref={primaryRef}>
              <EditoraEditor
                plugins={primaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={`
                  <h2>Customer Incident Communication Memo</h2>
                  <p>Owner: Content Lead | Reviewer: Security Team</p>
                  <h3>Draft Message</h3>
                  <p>Please contact incident-owner@acme-secure.com for escalations and call +1 (415) 555-0136 for urgent updates.</p>
                  <p>Temporary debug token (remove before publish): sk-proj-9x8A12B34C56D78E90F12G34H56I78J.</p>
                  <p>Customer support fallback: support-team@acme-secure.com</p>
                `}
              />
            </div>

            <div ref={secondaryRef}>
              <EditoraEditor
                plugins={secondaryPlugins}
                statusbar={{ enabled: true, position: "bottom" }}
                floatingToolbar={true}
                defaultValue={`
                  <h3>Secondary Draft (Isolation Check)</h3>
                  <p>This instance should keep its own findings/state. Test value: test.secondary@acme.com</p>
                `}
              />
            </div>
          </Grid>

          <Box style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, background: "#ffffff" }}>
            <h4 style={{ margin: "0 0 8px" }}>PII Event Log</h4>
            <p style={{ margin: "0 0 12px", fontSize: 12, color: "#475569" }}>
              Tracks scan/findings/redaction events from both editors.
            </p>
            {events.length === 0 ? (
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>No PII events captured yet.</p>
            ) : (
              <ol style={{ margin: 0, paddingInlineStart: 18, display: "grid", gap: 8 }}>
                {events.map((entry, index) => (
                  <li key={`${entry.time}-${index}`} style={{ fontSize: 12, lineHeight: 1.4 }}>
                    [{entry.time}] {entry.source} | {entry.type} | total={entry.total} | high={entry.high} | medium=
                    {entry.medium} | low={entry.low} | redacted={entry.redactedCount}
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
