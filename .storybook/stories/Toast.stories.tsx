import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

import {
  toast,
  toastAdvanced,
  type ToastLevelAdvanced,
  type ToastPosition,
  type ToastTheme,
  type ToastOptionsAdvanced,
} from "@editora/toast";
import "../../packages/editora-toast/dist/toast.css";
import { Box, Grid, Flex } from "@editora/ui-react";

// ─── Shared helpers ────────────────────────────────────────────────────────────

const THEMES: ToastTheme[] = [
  "light", "dark", "system", "colored", "minimal",
  "glass", "neon", "retro", "ocean", "forest", "sunset", "midnight",
];

const POSITIONS: ToastPosition[] = [
  "top-left", "top-center", "top-right",
  "bottom-left", "bottom-center", "bottom-right",
];

const LEVELS: ToastLevelAdvanced[] = [
  "info", "success", "error", "warning", "loading", "promise", "custom",
];

const LEVEL_MESSAGES: Record<string, string> = {
  info:    "Heads up — something worth knowing.",
  success: "All changes saved successfully.",
  error:   "Something went wrong. Please try again.",
  warning: "Storage is 90% full.",
  loading: "Processing your request…",
  promise: "Waiting for promise to settle…",
  custom:  "Custom level toast.",
};

const THEME_SWATCHES: Record<string, string> = {
  light:    "#fff",
  dark:     "#1c1917",
  system:   "linear-gradient(135deg,#fff 50%,#1c1917 50%)",
  colored:  "linear-gradient(135deg,#2563eb,#16a34a)",
  minimal:  "#f9f9f9",
  glass:    "rgba(255,255,255,.15)",
  neon:     "#09090b",
  retro:    "#fefce8",
  ocean:    "linear-gradient(135deg,#0f2942,#1a3d5c)",
  forest:   "linear-gradient(135deg,#052e16,#14532d)",
  sunset:   "linear-gradient(135deg,#431407,#7c2d12)",
  midnight: "#0a0a0f",
};

const ANIMATION_TYPES = [
  "spring", "bounce", "slide", "zoom", "flip",
  "fade", "elastic", "rotate", "custom",
] as const;

// Shared button style used in plain Storybook sections
const btn: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #d6d3d1",
  background: "#fff",
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
const btnPrimary: React.CSSProperties = { ...btn, background: "#1c1917", color: "#fafaf9", border: "1px solid #1c1917" };
const btnBlue:    React.CSSProperties = { ...btn, color: "#2563eb", borderColor: "rgba(37,99,235,.3)" };
const btnGreen:   React.CSSProperties = { ...btn, color: "#16a34a", borderColor: "rgba(22,163,74,.3)" };
const btnRed:     React.CSSProperties = { ...btn, color: "#dc2626", borderColor: "rgba(220,38,38,.3)" };
const btnAmber:   React.CSSProperties = { ...btn, color: "#d97706", borderColor: "rgba(217,119,6,.3)" };

// ─── Meta ─────────────────────────────────────────────────────────────────────

type StoryArgs = {
  theme?: ToastTheme;
  position?: ToastPosition;
  rtl?: boolean;
  swipeDirection?: ToastOptionsAdvanced["swipeDirection"];
  pauseOnWindowBlur?: boolean;
};

const meta: Meta<StoryArgs> = {
  title: "UI Components/Toast Notifications",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# Editora Toast — Advanced Notification System

**Bundle**: ~8 KB gzipped · **Zero dependencies** · Framework agnostic

## What's covered in these stories

| Story | What it shows |
|-------|--------------|
| \`ToastShowcase\` | Full interactive playground with all controls |
| \`BasicTypes\` | 6 semantic levels side by side |
| \`RichContent\` | Title, description, icons, action buttons |
| \`AllThemes\` | All 12 themes firing every level |
| \`AllPositions\` | Every anchor position |
| \`AllAnimations\` | All 9 animation types |
| \`PromiseLifecycle\` | Loading → success / error flows |
| \`ProgressVariants\` | Determinate, indeterminate, multi-step, speed |
| \`ActionPatterns\` | Confirm, retry, multi-choice, survey, decision |
| \`InteractiveContent\` | Custom render, embedded form, image, code block |
| \`StackingBehaviour\` | Stack vs expand, max-visible limiting |
| \`GroupedToasts\` | Grouped uploads, batched system events |
| \`UpdateFlow\` | Loading → success, loading → error, update-in-place |
| \`ErrorHandling\` | Network, validation, permission, timeout, 500, rate-limit |
| \`AsyncOperations\` | API call, file op, payment, sync |
| \`AccessibilityFeatures\` | Keyboard, reduced-motion, ARIA roles |
| \`RTLSupport\` | Arabic, Hebrew, Persian, mixed |
| \`SwipeDirections\` | All 7 swipe direction modes |
| \`PersistentAlerts\` | Persistent, no-close, priority |
| \`ConfigurationModes\` | Duration, maxVisible, pauseOnHover, pauseOnBlur |
| \`BulkNotifications\` | Sequential, concurrent, staggered |
| \`SystemNotifications\` | Update, disk, connection, messages |
| \`CustomStyling\` | CSS variables override, custom class, inline style |
| \`PluginSystem\` | Analytics, logger, rate-limiter plugins |
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: { type: "select" },
      options: THEMES,
      description: "Toast theme",
    },
    position: {
      control: { type: "select" },
      options: POSITIONS,
      description: "Toast position",
    },
    rtl: { control: { type: "boolean" }, description: "Right-to-left text" },
    swipeDirection: {
      control: { type: "select" },
      options: ["any", "horizontal", "vertical", "left", "right", "up", "down"],
      description: "Swipe-to-dismiss axis",
    },
    pauseOnWindowBlur: {
      control: { type: "boolean" },
      description: "Pause when window loses focus",
    },
  },
};

export default meta;
type Story = StoryObj<StoryArgs>;

// ─── Shared section wrapper ────────────────────────────────────────────────────

const Section = ({
  label,
  title,
  desc,
  children,
}: {
  label: string;
  title: string;
  desc?: string;
  children: React.ReactNode;
}) => (
  <Box style={{ marginBottom: 40 }}>
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#78716c", margin: "0 0 4px" }}>{label}</p>
    <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 4px" }}>{title}</h2>
    {desc && <p style={{ fontSize: 13, color: "#78716c", margin: "0 0 16px" }}>{desc}</p>}
    {children}
  </Box>
);

const Card = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <div style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 10, padding: 20, marginBottom: 16 }}>
    {title && <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 12px" }}>{title}</p>}
    {children}
  </div>
);

const BtnRow = ({ children }: { children: React.ReactNode }) => (
  <Flex style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</Flex>
);

// ─── 1. SHOWCASE (full playground) ────────────────────────────────────────────

export const ToastShowcase: Story = {
  render: (args) => {
    const [init, setInit] = useState(false);
    useEffect(() => {
      toastAdvanced.configure({
        theme: args.theme as any ?? "light",
        position: args.position as any ?? "bottom-right",
        duration: 4000,
        maxVisible: 5,
        enableAccessibility: true,
        rtl: args.rtl,
        swipeDirection: args.swipeDirection as any,
        pauseOnWindowBlur: args.pauseOnWindowBlur,
      });
      setInit(true);
    }, [args.theme, args.position, args.rtl, args.swipeDirection, args.pauseOnWindowBlur]);

    if (!init) return <div>Initialising…</div>;

    return (
      <Box style={{ padding: 20, maxWidth: 860 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>
          Editora Toast
        </h1>
        <p style={{ color: "#78716c", marginBottom: 32 }}>
          Use the Controls panel to change theme, position, RTL, and swipe settings.
        </p>

        <Section label="Levels" title="Basic toast types">
          <BtnRow>
            {LEVELS.filter(l => l !== "custom" && l !== "promise").map(lvl => (
              <button key={lvl} style={btn}
                onClick={() => (toastAdvanced as any)[lvl]?.(LEVEL_MESSAGES[lvl]) ?? toastAdvanced.show({ message: LEVEL_MESSAGES[lvl], level: lvl as any })}>
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </BtnRow>
        </Section>

        <Section label="Content" title="Rich content">
          <BtnRow>
            <button style={btn} onClick={() => toastAdvanced.show({ title: "File uploaded", message: "report-q4.pdf saved to /docs", level: "success" })}>With title</button>
            <button style={btn} onClick={() => toastAdvanced.show({ title: "New message", message: "Jordan left a comment.", description: "Just now · Design Reviews", level: "info" })}>With description</button>
            <button style={btn} onClick={() => toastAdvanced.show({
              title: "Unsaved changes", message: "Save before leaving?", level: "warning", duration: 9000,
              actions: [{ label: "Save", primary: true, onClick: () => toastAdvanced.success("Saved!") }, { label: "Discard", onClick: () => {} }]
            })}>With actions</button>
            <button style={btn} onClick={() => toastAdvanced.show({ message: "Custom icon", level: "info", icon: "🚀" })}>Custom icon</button>
          </BtnRow>
        </Section>

        <Section label="Async" title="Promise lifecycle">
          <BtnRow>
            <button style={btnGreen} onClick={() => {
              toastAdvanced.promise(new Promise(r => setTimeout(() => r("Done"), 2000)), { loading: "Working…", success: d => `Done — ${d}`, error: "Failed" }).catch(() => {});
            }}>Resolve</button>
            <button style={btnRed} onClick={() => {
              toastAdvanced.promise(new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 2000)), { loading: "Working…", success: "Done!", error: e => `Error: ${e.message}` }).catch(() => {});
            }}>Reject</button>
            <button style={btn} onClick={() => {
              const t = toastAdvanced.loading("Saving…");
              setTimeout(() => toastAdvanced.update(t.id, { message: "Saved!", level: "success" }), 2000);
            }}>Loading → Success</button>
          </BtnRow>
        </Section>

        <Section label="Themes" title="All themes">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 8 }}>
            {THEMES.map(theme => (
              <button key={theme} style={{ ...btn, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 8px" }}
                onClick={() => toastAdvanced.show({ message: `${theme} theme`, level: "success", theme: theme as any })}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: THEME_SWATCHES[theme] ?? "#ddd", border: "1px solid rgba(0,0,0,.08)", flexShrink: 0 }} />
                <span style={{ fontSize: 11 }}>{theme}</span>
              </button>
            ))}
          </div>
        </Section>

        <BtnRow>
          <button style={btnRed} onClick={() => toastAdvanced.clear()}>Clear all</button>
        </BtnRow>
      </Box>
    );
  },
  args: { theme: "light", position: "bottom-right", rtl: false, swipeDirection: "any", pauseOnWindowBlur: false },
};

// ─── 2. BASIC TYPES ───────────────────────────────────────────────────────────

export const BasicTypes: Story = {
  name: "Basic Types",
  parameters: {
    docs: { description: { story: "Every semantic level in one view. Each has its own tinted surface, accent stripe, and icon." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Levels" title="All toast types" desc="Six semantic levels, each mapped to a colour and default icon.">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {(["info", "success", "error", "warning", "loading"] as const).map(lvl => (
            <Card key={lvl} title={lvl.charAt(0).toUpperCase() + lvl.slice(1)}>
              <BtnRow>
                <button style={btn} onClick={() => (toastAdvanced as any)[lvl]?.(LEVEL_MESSAGES[lvl]) ?? toastAdvanced.show({ message: LEVEL_MESSAGES[lvl], level: lvl })}>
                  Simple
                </button>
                <button style={btn} onClick={() => toastAdvanced.show({ title: "With title", message: LEVEL_MESSAGES[lvl], level: lvl })}>
                  + Title
                </button>
                <button style={btn} onClick={() => toastAdvanced.show({ title: "With all", message: LEVEL_MESSAGES[lvl], description: "Secondary context line", level: lvl })}>
                  + Desc
                </button>
              </BtnRow>
            </Card>
          ))}
          <Card title="Custom">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({ message: "Custom level — no default icon", level: "custom" })}>
                No icon
              </button>
              <button style={btn} onClick={() => toastAdvanced.show({ message: "Custom with icon", level: "custom", icon: "🎯" })}>
                🎯 Icon
              </button>
            </BtnRow>
          </Card>
        </Grid>
      </Section>

      <Section label="Duration" title="Auto-dismiss timing">
        <BtnRow>
          {[1000, 2000, 4000, 8000].map(ms => (
            <button key={ms} style={btn}
              onClick={() => toastAdvanced.show({ message: `Auto-dismiss in ${ms / 1000}s`, level: "info", duration: ms })}>
              {ms / 1000}s
            </button>
          ))}
          <button style={btn} onClick={() => toastAdvanced.show({ message: "Persistent — close manually", level: "warning", persistent: true, closable: true })}>
            Persistent
          </button>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "No close button", level: "info", closable: false, duration: 3000 })}>
            No close btn
          </button>
        </BtnRow>
      </Section>
    </Box>
  ),
};

// ─── 3. RICH CONTENT ──────────────────────────────────────────────────────────

export const RichContent: Story = {
  name: "Rich Content",
  parameters: {
    docs: { description: { story: "Titles, descriptions, custom icons, and action button combinations." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Content" title="Rich toast content">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Title + message">
            <BtnRow>
              <button style={btnGreen} onClick={() => toastAdvanced.show({ title: "Upload complete", message: "design-v3.fig was saved to /assets", level: "success" })}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="Title + message + description">
            <BtnRow>
              <button style={btnBlue} onClick={() => toastAdvanced.show({ title: "New comment", message: "Alex left a reply on your PR.", description: "2 min ago · repo/feature-branch", level: "info" })}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="Custom icon (emoji)">
            <BtnRow>
              {["🚀", "💡", "🔥", "🎉", "⚡"].map(icon => (
                <button key={icon} style={btn} onClick={() => toastAdvanced.show({ message: `Icon: ${icon}`, level: "info", icon })}>{icon}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="Custom icon (SVG string)">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({
                message: "SVG icon toast",
                level: "success",
                icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#16a34a" stroke-width="1.5"/><path d="M5 8l2 2 4-4" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
              })}>SVG icon</button>
            </BtnRow>
          </Card>

          <Card title="1 action">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({
                message: "New version available (v2.1.0).",
                level: "info",
                actions: [{ label: "Update now", primary: true, onClick: () => toastAdvanced.success("Update started!") }],
              })}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="2 actions (primary + secondary)">
            <BtnRow>
              <button style={btnAmber} onClick={() => toastAdvanced.show({
                title: "Unsaved changes",
                message: "You have unsaved edits.",
                level: "warning",
                duration: 10000,
                actions: [
                  { label: "Save", primary: true, onClick: () => toastAdvanced.success("Saved!") },
                  { label: "Discard", onClick: () => {} },
                ],
              })}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="3 actions">
            <BtnRow>
              <button style={btnBlue} onClick={() => toastAdvanced.show({
                message: "How was your experience?",
                level: "info",
                duration: 12000,
                actions: [
                  { label: "👍 Good", onClick: () => toastAdvanced.success("Thanks!") },
                  { label: "👎 Bad", onClick: () => toastAdvanced.info("Sorry to hear that.") },
                  { label: "Skip", onClick: () => {} },
                ],
              })}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="4 actions (survey)">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({
                message: "Rate your satisfaction:",
                level: "info",
                duration: 15000,
                actions: [
                  { label: "😍 Great",    onClick: () => toastAdvanced.success("Awesome!") },
                  { label: "😊 Good",     onClick: () => toastAdvanced.success("Thanks!") },
                  { label: "😐 Neutral",  onClick: () => toastAdvanced.info("Noted.") },
                  { label: "😕 Poor",     onClick: () => toastAdvanced.warning("We'll improve.") },
                ],
              })}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="Long message (truncation)">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({
                message: "This is a very long notification message that tests how the toast handles multi-line text content and whether it wraps correctly at the configured width.",
                level: "info",
              })}>Long text</button>
            </BtnRow>
          </Card>

          <Card title="HTML in message (via render)">
            <BtnRow>
              <button style={btn} onClick={() => {
                toastAdvanced.show({
                  render: () => {
                    const d = document.createElement("div");
                    d.innerHTML = `<div style="display:flex;align-items:center;gap:10px"><div style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#667eea,#764ba2);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;flex-shrink:0">🎨</div><div><div style="font-weight:600;font-size:13px">Custom render</div><div style="font-size:12px;opacity:.7;margin-top:2px">Full DOM control via <code>render()</code></div></div></div>`;
                    return d;
                  },
                  level: "custom",
                  duration: 5000,
                });
              }}>Custom render</button>
            </BtnRow>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 4. ALL THEMES ────────────────────────────────────────────────────────────

export const AllThemes: Story = {
  name: "All Themes",
  parameters: {
    docs: { description: { story: "Every theme firing all four primary levels, so you can compare colour treatments side by side." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Appearance" title="All 12 themes × 4 levels" desc="Click any button to see the theme applied to that level.">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
          {THEMES.map(theme => (
            <Card key={theme}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: THEME_SWATCHES[theme] ?? "#ddd", border: "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />
                <p style={{ fontWeight: 600, fontSize: 14, margin: 0, textTransform: "capitalize" }}>{theme}</p>
              </div>
              <BtnRow>
                {(["success", "info", "warning", "error"] as const).map(lvl => (
                  <button key={lvl} style={btn}
                    onClick={() => toastAdvanced.show({ message: `${theme} — ${lvl}`, level: lvl, theme: theme as any, duration: 40000000 })}>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </button>
                ))}
              </BtnRow>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section label="Rich colours" title="Rich-colour mode">
        <Card title="richColors: true — semantic fills applied to backgrounds">
          <BtnRow>
            {(["success", "error", "warning", "info"] as const).map(lvl => (
              <button key={lvl} style={btn}
                onClick={() => toastAdvanced.show({ message: `${lvl} with rich colours`, level: lvl, richColors: true } as any)}>
                {lvl}
              </button>
            ))}
          </BtnRow>
        </Card>
      </Section>
    </Box>
  ),
};

// ─── 5. ALL POSITIONS ─────────────────────────────────────────────────────────

export const AllPositions: Story = {
  name: "All Positions",
  parameters: {
    docs: { description: { story: "Six edge anchors plus centred overlay. Each button fires to that exact position." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Placement" title="All 7 positions">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, maxWidth: 360 }}>
          {([
            ["top-left", "↖ Top left"],
            ["top-center", "↑ Top centre"],
            ["top-right", "↗ Top right"],
            ["bottom-left", "↙ Bot left"],
            ["bottom-center", "↓ Bot centre"],
            ["bottom-right", "↘ Bot right"],
          ] as const).map(([pos, label]) => (
            <button key={pos} style={{ ...btn, justifyContent: "center" }}
              onClick={() => toastAdvanced.show({ message: `Position: ${pos}`, level: "info", position: pos })}>
              {label}
            </button>
          ))}
          <button style={{ ...btn, gridColumn: "span 3", justifyContent: "center" }}
            onClick={() => toastAdvanced.show({ message: "Centred overlay", level: "info", position: "center" })}>
            ⊕ Centre overlay
          </button>
        </div>
      </Section>

      <Section label="Stacking" title="Multiple positions at once">
        <BtnRow>
          <button style={btnPrimary} onClick={() => {
            POSITIONS.forEach((pos, i) => {
              setTimeout(() => toastAdvanced.show({ message: `Toast at ${pos}`, level: "info", position: pos }), i * 200);
            });
          }}>Fire all positions</button>
          <button style={btn} onClick={() => toastAdvanced.clear()}>Clear all</button>
        </BtnRow>
      </Section>
    </Box>
  ),
};

// ─── 6. ALL ANIMATIONS ────────────────────────────────────────────────────────

export const AllAnimations: Story = {
  name: "All Animations",
  parameters: {
    docs: { description: { story: "Nine animation types including a fully custom JS-controlled enter/exit pair." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Motion" title="All 9 animation types">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>

          <Card title="spring">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "Spring animation", level: "success", animation: { type: "spring", config: { stiffness: 100, damping: 20 } } })}>Fire</button>
          </Card>

          <Card title="bounce">
            <BtnRow>
              {(["gentle", "normal", "strong"] as const).map(intensity => (
                <button key={intensity} style={btn} onClick={() => toastAdvanced.show({ message: `Bounce (${intensity})`, level: "info", animation: { type: "bounce", direction: "up", intensity, duration: 800 } })}>{intensity}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="slide">
            <BtnRow>
              {(["up", "down", "left", "right"] as const).map(dir => (
                <button key={dir} style={btn} onClick={() => toastAdvanced.show({ message: `Slide ${dir}`, level: "info", animation: { type: "slide", direction: dir, distance: 100, duration: 400 } })}>{dir}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="zoom">
            <BtnRow>
              {(["center", "top", "bottom", "left", "right"] as const).map(origin => (
                <button key={origin} style={btn} onClick={() => toastAdvanced.show({ message: `Zoom from ${origin}`, level: "warning", animation: { type: "zoom", scale: 0.3, origin, duration: 500 } })}>{origin}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="flip">
            <BtnRow>
              {(["x", "y"] as const).map(axis => (
                ["forward", "backward"].map(dir => (
                  <button key={`${axis}-${dir}`} style={btn} onClick={() => toastAdvanced.show({ message: `Flip ${axis} ${dir}`, level: "error", animation: { type: "flip", axis, direction: dir as any, duration: 600 } })}>{axis}/{dir}</button>
                ))
              ))}
            </BtnRow>
          </Card>

          <Card title="fade">
            <BtnRow>
              {(["none", "up", "down", "left", "right"] as const).map(dir => (
                <button key={dir} style={btn} onClick={() => toastAdvanced.show({ message: `Fade ${dir}`, level: "info", animation: { type: "fade", direction: dir, distance: 20, duration: 300 } })}>{dir}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="elastic">
            <BtnRow>
              {(["gentle", "normal", "strong"] as const).map(intensity => (
                <button key={intensity} style={btn} onClick={() => toastAdvanced.show({ message: `Elastic (${intensity})`, level: "success", animation: { type: "elastic", direction: "up", intensity, duration: 1000 } })}>{intensity}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="rotate">
            <BtnRow>
              {(["clockwise", "counterclockwise"] as const).map(dir => (
                <button key={dir} style={btn} onClick={() => toastAdvanced.show({ message: `Rotate ${dir}`, level: "warning", animation: { type: "rotate", degrees: 360, direction: dir, duration: 500 } })}>{dir}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="custom (JS)">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({
                message: "Custom bounce (JS)",
                level: "info",
                animation: {
                  type: "custom",
                  show: async (el) => {
                    el.style.transform = "scale(0.3)";
                    el.style.opacity = "0";
                    await new Promise(r => setTimeout(r, 50));
                    el.style.transition = "all 0.6s cubic-bezier(0.68,-0.55,0.265,1.55)";
                    el.style.transform = "scale(1)";
                    el.style.opacity = "1";
                    return new Promise(r => setTimeout(r, 600));
                  },
                  hide: async (el) => {
                    el.style.transition = "all 0.4s ease";
                    el.style.transform = "scale(0.8)";
                    el.style.opacity = "0";
                    return new Promise(r => setTimeout(r, 400));
                  },
                },
              })}>Custom bounce</button>

              <button style={btn} onClick={() => toastAdvanced.show({
                message: "Custom shake (JS)",
                level: "error",
                animation: {
                  type: "custom",
                  show: async (el) => {
                    el.style.opacity = "1";
                    const frames = ["translateX(-8px)", "translateX(8px)", "translateX(-6px)", "translateX(6px)", "translateX(0)"];
                    for (const f of frames) {
                      el.style.transform = f;
                      await new Promise(r => setTimeout(r, 60));
                    }
                  },
                },
              })}>Shake</button>
            </BtnRow>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 7. PROMISE LIFECYCLE ─────────────────────────────────────────────────────

export const PromiseLifecycle: Story = {
  name: "Promise Lifecycle",
  parameters: {
    docs: { description: { story: "Pass any promise and get automatic loading → success / error transitions. The toast ID stays constant through the whole lifecycle." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Async" title="Promise lifecycle variations">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Static messages">
            <BtnRow>
              <button style={btnGreen} onClick={() => toastAdvanced.promise(new Promise(r => setTimeout(() => r("Done"), 2000)), { loading: "Working…", success: "Completed!", error: "Failed" }).catch(() => {})}>Resolve</button>
              <button style={btnRed}   onClick={() => toastAdvanced.promise(new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 2000)), { loading: "Working…", success: "Done!", error: "Failed" }).catch(() => {})}>Reject</button>
            </BtnRow>
          </Card>

          <Card title="Dynamic messages (function)">
            <BtnRow>
              <button style={btnGreen} onClick={() => toastAdvanced.promise(
                new Promise<{ user: string }>(r => setTimeout(() => r({ user: "Alice" }), 2000)),
                { loading: "Fetching user…", success: d => `Welcome, ${d.user}!`, error: e => `Error: ${e.message}` }
              ).catch(() => {})}>Resolve</button>
              <button style={btnRed} onClick={() => toastAdvanced.promise(
                new Promise((_, r) => setTimeout(() => r(new Error("User not found")), 2000)),
                { loading: "Fetching user…", success: d => `Welcome!`, error: e => `Error: ${e.message}` }
              ).catch(() => {})}>Reject</button>
            </BtnRow>
          </Card>

          <Card title="API call simulation">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.promise(
                new Promise<{ status: number }>(r => setTimeout(() => Math.random() > 0.3 ? r({ status: 200 }) : Promise.reject(new Error("Network error")), 2500)),
                { loading: "Making API request…", success: d => `✓ Status ${d.status}`, error: e => `✕ ${e.message}` }
              ).catch(() => {})}>Random outcome</button>
            </BtnRow>
          </Card>

          <Card title="Payment processing">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.promise(
                new Promise<{ txn: string }>(r => setTimeout(() => r({ txn: "TXN_" + Date.now().toString().slice(-6) }), 3000)),
                { loading: "Processing payment…", success: d => `Payment OK — ${d.txn}`, error: "Payment declined" }
              ).catch(() => {})}>Pay</button>
            </BtnRow>
          </Card>

          <Card title="File upload (random failure)">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.promise(
                new Promise((res, rej) => setTimeout(() => Math.random() > 0.4 ? res(null) : rej(new Error("Server error")), 2000)),
                { loading: "Uploading file…", success: "Upload complete!", error: "Upload failed. Check connection." }
              ).catch(() => {})}>Upload</button>
            </BtnRow>
          </Card>

          <Card title="Data sync">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.promise(
                new Promise(r => setTimeout(r, 3500)),
                { loading: "Syncing with cloud…", success: "Data synchronised", error: "Sync conflict detected" }
              ).catch(() => {})}>Sync</button>
            </BtnRow>
          </Card>

        </Grid>
      </Section>

      <Section label="Update" title="Manual update flow">
        <Card title="Mutate an existing toast in place">
          <BtnRow>
            <button style={btn} onClick={() => {
              const t = toastAdvanced.loading("Saving document…");
              setTimeout(() => toastAdvanced.update(t.id, { message: "Document saved!", level: "success" }), 2000);
            }}>Loading → Success</button>

            <button style={btn} onClick={() => {
              const t = toastAdvanced.loading("Deleting record…");
              setTimeout(() => toastAdvanced.update(t.id, { message: "Delete failed — permission denied", level: "error" }), 2000);
            }}>Loading → Error</button>

            <button style={btn} onClick={() => {
              const t = toastAdvanced.info("Checking for updates…");
              setTimeout(() => toastAdvanced.update(t.id, { message: "No updates available.", level: "success" }), 1500);
            }}>Info → Success</button>
          </BtnRow>
        </Card>
      </Section>
    </Box>
  ),
};

// ─── 8. PROGRESS VARIANTS ─────────────────────────────────────────────────────

export const ProgressVariants: Story = {
  name: "Progress Variants",
  parameters: {
    docs: { description: { story: "Determinate bars, indeterminate spinners, multi-step flows, and speed indicators." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Progress" title="Progress bar variants">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>

          <Card title="Determinate (with %)">
            <button style={btn} onClick={() => {
              const t = toastAdvanced.show({ message: "Processing…", level: "loading", progress: { value: 0, showPercentage: true } });
              let v = 0;
              const iv = setInterval(() => {
                v += 10;
                toastAdvanced.update(t.id, { progress: { value: v, showPercentage: true }, message: `Processing… ${v}%` });
                if (v >= 100) { clearInterval(iv); setTimeout(() => toastAdvanced.update(t.id, { message: "Complete!", level: "success", progress: undefined }), 400); }
              }, 200);
            }}>Start</button>
          </Card>

          <Card title="Determinate (no %)">
            <button style={btn} onClick={() => {
              const t = toastAdvanced.show({ message: "Downloading…", level: "loading", progress: { value: 0 } });
              let v = 0;
              const iv = setInterval(() => {
                v += 5;
                toastAdvanced.update(t.id, { progress: { value: v } });
                if (v >= 100) { clearInterval(iv); toastAdvanced.update(t.id, { message: "Download complete!", level: "success", progress: undefined }); }
              }, 100);
            }}>Start</button>
          </Card>

          <Card title="Indeterminate (spinner only)">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "Syncing with cloud…", level: "loading", duration: 5000 })}>Start</button>
          </Card>

          <Card title="Multi-step process">
            <button style={btn} onClick={() => {
              const steps = ["Analysing files…", "Processing data…", "Optimising…", "Finalising…"];
              let step = 0;
              const t = toastAdvanced.show({ message: steps[0], level: "loading", progress: { value: 0 } });
              const iv = setInterval(() => {
                step++;
                if (step >= steps.length) { clearInterval(iv); toastAdvanced.update(t.id, { message: "All steps complete!", level: "success", progress: undefined }); return; }
                toastAdvanced.update(t.id, { message: steps[step], progress: { value: (step / steps.length) * 100 } });
              }, 1500);
            }}>Start</button>
          </Card>

          <Card title="Download with speed">
            <button style={btn} onClick={() => {
              const t = toastAdvanced.show({ message: "Downloading… 0 MB/s", level: "loading", progress: { value: 0, showPercentage: true } });
              let v = 0, speed = 2.1;
              const iv = setInterval(() => {
                v += Math.random() * 8 + 2;
                speed = Math.max(0.5, speed + (Math.random() - 0.5) * 0.5);
                if (v >= 100) { v = 100; clearInterval(iv); toastAdvanced.update(t.id, { message: "Downloaded!", level: "success", progress: undefined }); return; }
                toastAdvanced.update(t.id, { message: `Downloading… ${speed.toFixed(1)} MB/s`, progress: { value: v, showPercentage: true } });
              }, 600);
            }}>Start</button>
          </Card>

          <Card title="Randomised (realistic)">
            <button style={btn} onClick={() => {
              const t = toastAdvanced.show({ message: "Compiling…", level: "loading", progress: { value: 0, showPercentage: true } });
              let v = 0;
              const tick = () => {
                v += Math.random() * 12;
                if (v >= 100) { v = 100; toastAdvanced.update(t.id, { message: "Build complete!", level: "success", progress: undefined }); return; }
                toastAdvanced.update(t.id, { progress: { value: Math.round(v), showPercentage: true }, message: `Compiling… ${Math.round(v)}%` });
                setTimeout(tick, 150 + Math.random() * 300);
              };
              setTimeout(tick, 200);
            }}>Build</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 9. ACTION PATTERNS ───────────────────────────────────────────────────────

export const ActionPatterns: Story = {
  name: "Action Patterns",
  parameters: {
    docs: { description: { story: "Common UX patterns built with action buttons: confirm, retry, undo, survey, multi-choice." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Actions" title="Action button patterns">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Confirm destructive action">
            <button style={btnRed} onClick={() => toastAdvanced.show({
              message: "Delete this file permanently?",
              level: "warning",
              duration: 10000,
              actions: [
                { label: "Delete", primary: true, onClick: () => toastAdvanced.success("File deleted.") },
                { label: "Cancel", onClick: () => {} },
              ],
            })}>Fire</button>
          </Card>

          <Card title="Undo action">
            <button style={btn} onClick={() => toastAdvanced.show({
              message: "Message sent.",
              level: "success",
              duration: 6000,
              actions: [{ label: "Undo", onClick: () => toastAdvanced.info("Message recalled.") }],
            })}>Fire</button>
          </Card>

          <Card title="Retry failed operation">
            <button style={btnRed} onClick={() => toastAdvanced.show({
              message: "Failed to save. Retry?",
              level: "error",
              duration: 10000,
              actions: [
                { label: "Retry", primary: true, onClick: () => toastAdvanced.success("Saved!") },
                { label: "Save locally", onClick: () => toastAdvanced.info("Saved locally.") },
              ],
            })}>Fire</button>
          </Card>

          <Card title="Update available">
            <button style={btnBlue} onClick={() => toastAdvanced.show({
              title: "Update available",
              message: "v2.1.0 is ready to install.",
              level: "info",
              duration: 12000,
              actions: [
                { label: "Update now", primary: true, onClick: () => toastAdvanced.loading("Installing…") },
                { label: "Later", onClick: () => {} },
                { label: "What's new", onClick: () => toastAdvanced.info("Changelog opened.") },
              ],
            })}>Fire</button>
          </Card>

          <Card title="Position decision">
            <button style={btn} onClick={() => toastAdvanced.show({
              message: "Choose notification position:",
              level: "info",
              duration: 15000,
              actions: [
                { label: "Top right",    onClick: () => { toastAdvanced.configure({ position: "top-right" });    toastAdvanced.success("Set to top-right"); } },
                { label: "Bottom right", onClick: () => { toastAdvanced.configure({ position: "bottom-right" }); toastAdvanced.success("Set to bottom-right"); } },
              ],
            })}>Fire</button>
          </Card>

          <Card title="Quick survey (4 choices)">
            <button style={btn} onClick={() => toastAdvanced.show({
              message: "Rate your experience:",
              level: "info",
              duration: 20000,
              actions: [
                { label: "😍 Great",   onClick: () => toastAdvanced.success("Thank you!") },
                { label: "😊 Good",    onClick: () => toastAdvanced.success("Thanks!") },
                { label: "😐 Neutral", onClick: () => toastAdvanced.info("Noted.") },
                { label: "😕 Poor",    onClick: () => toastAdvanced.warning("We'll improve.") },
              ],
            })}>Fire</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 10. INTERACTIVE CONTENT ──────────────────────────────────────────────────

export const InteractiveContent: Story = {
  name: "Interactive Content",
  parameters: {
    docs: { description: { story: "Custom render() gives full DOM control — embed forms, images, code blocks, or any HTML inside a toast." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Custom render" title="Embedded interactive content">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Feedback form">
            <button style={btn} onClick={() => {
              const root = document.createElement("div");
              root.style.cssText = "display:flex;flex-direction:column;gap:8px;min-width:260px";
              root.innerHTML = `
                <div style="font-weight:600;font-size:13px">💬 Quick feedback</div>
                <textarea placeholder="How can we improve?" style="width:100%;min-height:56px;padding:7px 9px;border:1px solid rgba(0,0,0,.12);border-radius:6px;font-size:12px;font-family:inherit;resize:vertical;background:transparent;color:inherit;box-sizing:border-box"></textarea>
                <div style="display:flex;gap:6px;justify-content:flex-end">
                  <button id="et-cancel" style="padding:5px 10px;border:1px solid rgba(0,0,0,.12);background:transparent;border-radius:5px;font-size:12px;cursor:pointer;font-family:inherit">Cancel</button>
                  <button id="et-send" style="padding:5px 10px;border:none;background:#1c1917;color:#fff;border-radius:5px;font-size:12px;cursor:pointer;font-family:inherit;font-weight:500">Send</button>
                </div>`;
              const toastInst = toastAdvanced.show({ render: () => root, level: "info", duration: 0, closable: true });
              root.querySelector("#et-send")!.addEventListener("click", () => {
                const val = (root.querySelector("textarea") as HTMLTextAreaElement).value.trim();
                toastAdvanced.dismiss(toastInst.id);
                val ? toastAdvanced.success("Thanks for the feedback!") : toastAdvanced.warning("Please write something first.");
              });
              root.querySelector("#et-cancel")!.addEventListener("click", () => toastAdvanced.dismiss(toastInst.id));
            }}>Show form</button>
          </Card>

          <Card title="Image + caption">
            <button style={btn} onClick={() => {
              const root = document.createElement("div");
              root.style.cssText = "display:flex;align-items:center;gap:12px";
              root.innerHTML = `
                <div style="width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#667eea,#764ba2);flex-shrink:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px">🖼</div>
                <div><div style="font-weight:600;font-size:13px">preview.png</div><div style="font-size:12px;opacity:.65;margin-top:2px">1200 × 800 · PNG · 142 KB</div></div>`;
              toastAdvanced.show({ render: () => root, level: "custom", duration: 5000 });
            }}>Show</button>
          </Card>

          <Card title="Code snippet">
            <button style={btn} onClick={() => {
              const root = document.createElement("div");
              root.style.cssText = "display:flex;flex-direction:column;gap:8px;min-width:260px";
              root.innerHTML = `
                <div style="font-weight:600;font-size:13px">📋 Snippet copied</div>
                <pre style="margin:0;padding:10px;background:rgba(0,0,0,.06);border-radius:6px;font-size:11px;overflow:hidden;white-space:pre-wrap;word-break:break-all;font-family:'SF Mono',monospace">toast.success('Saved!')</pre>`;
              toastAdvanced.show({ render: () => root, level: "success", duration: 4000 });
            }}>Show</button>
          </Card>

          <Card title="User mention">
            <button style={btn} onClick={() => {
              const root = document.createElement("div");
              root.style.cssText = "display:flex;align-items:center;gap:10px";
              const initials = ["AJ", "MK", "RP", "SL"][Math.floor(Math.random() * 4)];
              const hue = Math.floor(Math.random() * 360);
              root.innerHTML = `
                <div style="width:34px;height:34px;border-radius:50%;background:hsl(${hue},60%,50%);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:13px;flex-shrink:0">${initials}</div>
                <div><div style="font-weight:600;font-size:13px">${initials} mentioned you</div><div style="font-size:12px;opacity:.65;margin-top:2px">…in #design-reviews · Just now</div></div>`;
              toastAdvanced.show({ render: () => root, level: "custom", duration: 5000,
                actions: [{ label: "View", primary: true, onClick: () => {} }, { label: "Dismiss", onClick: () => {} }] });
            }}>Show</button>
          </Card>

          <Card title="Progress bar + label (custom)">
            <button style={btn} onClick={() => {
              const root = document.createElement("div");
              root.style.cssText = "display:flex;flex-direction:column;gap:8px;min-width:240px";
              root.innerHTML = `
                <div style="display:flex;justify-content:space-between;font-size:13px"><span>Compiling project</span><span id="pct">0%</span></div>
                <div style="height:6px;background:rgba(0,0,0,.08);border-radius:99px;overflow:hidden"><div id="bar" style="height:100%;width:0%;background:#2563eb;border-radius:99px;transition:width .2s ease"></div></div>`;
              toastAdvanced.show({ render: () => root, level: "custom", duration: 0 });
              let v = 0;
              const iv = setInterval(() => {
                v += Math.random() * 12;
                if (v >= 100) { v = 100; clearInterval(iv); }
                (root.querySelector("#bar") as HTMLElement).style.width = v + "%";
                (root.querySelector("#pct") as HTMLElement).textContent = Math.round(v) + "%";
              }, 200);
            }}>Show</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 11. STACKING BEHAVIOUR ───────────────────────────────────────────────────

export const StackingBehaviour: Story = {
  name: "Stacking Behaviour",
  parameters: {
    docs: { description: { story: "Stack mode shows a 3D peek of queued toasts. Hover or expand to see all. maxVisible limits how many are shown at once." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Stacking" title="Stack & queue modes">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Fire 3 quickly (stack peek)">
            <button style={btn} onClick={() => {
              ["info", "success", "warning"].forEach((lvl, i) =>
                setTimeout(() => toastAdvanced.show({ message: `Stacked toast #${i + 1}`, level: lvl as any }), i * 200));
            }}>Fire 3</button>
          </Card>

          <Card title="Fire 6 quickly (queue overflow)">
            <button style={btn} onClick={() => {
              LEVELS.filter(l => l !== "custom" && l !== "promise").concat(["success", "error"] as any[]).slice(0, 6).forEach((lvl, i) =>
                setTimeout(() => toastAdvanced.show({ message: `Toast ${i + 1} of 6`, level: lvl as any }), i * 150));
            }}>Fire 6</button>
          </Card>

          <Card title="maxVisible = 2">
            <BtnRow>
              <button style={btn} onClick={() => { toastAdvanced.configure({ maxVisible: 2 }); toastAdvanced.info("maxVisible set to 2"); }}>Set 2</button>
              <button style={btn} onClick={() => { toastAdvanced.configure({ maxVisible: 5 }); toastAdvanced.info("maxVisible reset to 5"); }}>Reset</button>
            </BtnRow>
          </Card>

          <Card title="Clear all">
            <button style={btnRed} onClick={() => toastAdvanced.clear()}>Clear all</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 12. GROUPED TOASTS ───────────────────────────────────────────────────────

export const GroupedToasts: Story = {
  name: "Grouped Toasts",
  parameters: {
    docs: { description: { story: "Group multiple toasts under one key — they stack into a single slot and collapse." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Groups" title="Toast groups">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Batch file uploads">
            <button style={btn} onClick={() => {
              ["design-v3.fig", "spec.pdf", "assets.zip"].forEach((file, i) =>
                setTimeout(() => toastAdvanced.group("batch-upload", { message: `${file} uploaded`, level: "success" }), i * 700));
            }}>Upload 3 files</button>
          </Card>

          <Card title="System event stream">
            <button style={btn} onClick={() => {
              const events = [
                { msg: "Database backup started", lvl: "info" },
                { msg: "Backup 50% complete", lvl: "loading" },
                { msg: "Backup completed", lvl: "success" },
              ];
              events.forEach(({ msg, lvl }, i) =>
                setTimeout(() => toastAdvanced.group("db-backup", { message: msg, level: lvl as any }), i * 1200));
            }}>Simulate backup</button>
          </Card>

          <Card title="Mixed levels in one group">
            <button style={btn} onClick={() => {
              [
                { message: "Step 1 passed ✓", level: "success" as const },
                { message: "Step 2 passed ✓", level: "success" as const },
                { message: "Step 3 warning ⚠", level: "warning" as const },
                { message: "Step 4 failed ✕", level: "error" as const },
              ].forEach(({ message, level }, i) =>
                setTimeout(() => toastAdvanced.group("ci-run", { message, level }), i * 600));
            }}>Run CI</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 13. UPDATE FLOW ──────────────────────────────────────────────────────────

export { PromiseLifecycle as UpdateFlow };

// ─── 14. ERROR HANDLING ───────────────────────────────────────────────────────

export const ErrorHandling: Story = {
  name: "Error Handling",
  parameters: {
    docs: { description: { story: "Real error patterns — each toast names the problem and provides a clear recovery action." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Errors" title="Error handling patterns">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {[
            { title: "Network error",      msg: "Unable to reach the server. Check your connection.", action: "Retry", action2: "Settings" },
            { title: "Validation error",   msg: "Email is invalid. Password must be 8+ characters.",  action: "Fix issues" },
            { title: "Permission denied",  msg: "Administrator access required for this action.",     action: "Request access", action2: "Learn more" },
            { title: "Request timeout",    msg: "Server took too long to respond.",                   action: "Retry", action2: "Cancel" },
            { title: "Server error (500)", msg: "Something went wrong. Our team has been notified.",  action: "Try again", action2: "Report" },
            { title: "Rate limited",       msg: "Too many requests. Please wait a moment.",           action: "Wait & retry" },
            { title: "Conflict (409)",     msg: "Someone else edited this file. Resolve conflicts.",  action: "View diff", action2: "Overwrite" },
            { title: "Not found (404)",    msg: "The requested resource no longer exists.",           action: "Go back" },
          ].map(({ title, msg, action, action2 }) => (
            <Card key={title} title={title}>
              <button style={btnRed} onClick={() => toastAdvanced.show({
                message: msg,
                level: "error",
                duration: 8000,
                actions: [
                  { label: action, primary: true, onClick: () => toastAdvanced.info(`${action} clicked`) },
                  ...(action2 ? [{ label: action2, onClick: () => toastAdvanced.info(`${action2} clicked`) }] : []),
                ],
              })}>Show</button>
            </Card>
          ))}
        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 15. ASYNC OPERATIONS ─────────────────────────────────────────────────────

export const AsyncOperations: Story = {
  name: "Async Operations",
  parameters: {
    docs: { description: { story: "Real-world async patterns using the promise API with random success/failure outcomes." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Async" title="Real-world async operations">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {[
            { label: "API call",       loading: "Fetching data…",       success: "Data loaded",       error: "Network error",       delay: 2000, failRate: 0.2 },
            { label: "File export",    loading: "Exporting report…",    success: "Report exported",   error: "Export failed",       delay: 2500, failRate: 0.15 },
            { label: "Payment",        loading: "Processing payment…",  success: "Payment approved",  error: "Card declined",       delay: 3000, failRate: 0.25 },
            { label: "Data sync",      loading: "Syncing with cloud…",  success: "Sync complete",     error: "Sync conflict",       delay: 3500, failRate: 0.1 },
            { label: "Build & deploy", loading: "Building project…",    success: "Deployed to prod",  error: "Build failed",        delay: 4000, failRate: 0.2 },
            { label: "Auth check",     loading: "Verifying identity…",  success: "Signed in",         error: "Invalid credentials", delay: 1500, failRate: 0.3 },
          ].map(({ label, loading, success, error, delay, failRate }) => (
            <Card key={label} title={label}>
              <button style={btn} onClick={() => toastAdvanced.promise(
                new Promise((res, rej) => setTimeout(() => Math.random() > failRate ? res(null) : rej(new Error(error)), delay)),
                { loading, success, error }
              ).catch(() => {})}>Run</button>
            </Card>
          ))}
        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 16. ACCESSIBILITY ────────────────────────────────────────────────────────

export const AccessibilityFeatures: Story = {
  name: "Accessibility Features",
  parameters: {
    docs: { description: { story: "ARIA roles, keyboard focus, reduced-motion respect, and high-contrast examples." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="A11y" title="Accessibility features">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="ARIA role='alert' (assertive)">
            <BtnRow>
              <button style={btnRed} onClick={() => toastAdvanced.show({ message: "Critical: session expiring in 60s", level: "error", ariaLive: "assertive" } as any)}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="ARIA role='status' (polite)">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({ message: "Background sync completed", level: "success", ariaLive: "polite" } as any)}>Fire</button>
            </BtnRow>
          </Card>

          <Card title="Keyboard-closable">
            <p style={{ fontSize: 12, color: "#78716c", marginBottom: 8 }}>Tab to focus the toast, then press Escape or Enter to close.</p>
            <button style={btn} onClick={() => toastAdvanced.show({ message: "Focus me and press Escape", level: "info", closable: true, duration: 10000 })}>Show</button>
          </Card>

          <Card title="No close button (for non-critical)">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "Auto-dismissed in 3s, no close button", level: "info", closable: false, duration: 3000 })}>Show</button>
          </Card>

          <Card title="Reduced motion (CSS)">
            <p style={{ fontSize: 12, color: "#78716c", marginBottom: 8 }}>Toasts respect <code>prefers-reduced-motion</code> — all transitions collapse to a simple opacity fade.</p>
            <button style={btn} onClick={() => toastAdvanced.info("Respects prefers-reduced-motion")}>Show</button>
          </Card>

          <Card title="High contrast (dark + white text)">
            <button style={btn} onClick={() => toastAdvanced.show({ title: "High contrast mode", message: "Text remains legible on all backgrounds.", level: "success", theme: "dark" as any })}>Show</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 17. RTL SUPPORT ──────────────────────────────────────────────────────────

export const RTLSupport: Story = {
  name: "RTL Support",
  parameters: {
    docs: { description: { story: "Right-to-left layout support for Arabic, Hebrew, Persian, and bidirectional mixed content." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="i18n" title="RTL language support">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Arabic">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "تم الحفظ بنجاح", title: "نجاح", level: "success", rtl: true, duration: 6000 })}>عرض</button>
          </Card>

          <Card title="Hebrew">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "הקובץ נשמר בהצלחה", title: "הצלחה", level: "success", rtl: true, duration: 6000 })}>Show</button>
          </Card>

          <Card title="Persian (Farsi)">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "ذخیره شد", title: "موفقیت", level: "success", rtl: true, duration: 6000 })}>Show</button>
          </Card>

          <Card title="Arabic with actions">
            <button style={btn} onClick={() => toastAdvanced.show({
              message: "هل تريد حذف هذا الملف؟",
              level: "warning",
              rtl: true,
              duration: 10000,
              actions: [
                { label: "حذف", primary: true, onClick: () => toastAdvanced.success("تم الحذف") },
                { label: "إلغاء", onClick: () => {} },
              ],
            })}>Show</button>
          </Card>

          <Card title="Mixed LTR + RTL comparison">
            <BtnRow>
              <button style={btn} onClick={() => toastAdvanced.show({ message: "Left-to-right text (LTR)", level: "info", rtl: false })}>LTR</button>
              <button style={btn} onClick={() => toastAdvanced.show({ message: "نص من اليمين إلى اليسار", level: "info", rtl: true })}>RTL</button>
            </BtnRow>
          </Card>

          <Card title="Long RTL message">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "هذه رسالة طويلة جداً تختبر كيفية تعامل التنبيه مع النصوص الطويلة في وضع الكتابة من اليمين إلى اليسار", level: "info", rtl: true, duration: 8000 })}>Show</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 18. SWIPE DIRECTIONS ─────────────────────────────────────────────────────

export const SwipeDirections: Story = {
  name: "Swipe Directions",
  parameters: {
    docs: { description: { story: "All 7 swipe-dismiss modes. On touch devices, swipe the toast in the labelled direction to dismiss it." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Touch" title="Swipe-to-dismiss modes" desc="On mobile, swipe the toast in the indicated direction. On desktop, click and drag.">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {([
            { dir: "any",        label: "Any direction",   lvl: "info" },
            { dir: "left",       label: "← Left only",     lvl: "warning" },
            { dir: "right",      label: "→ Right only",    lvl: "warning" },
            { dir: "up",         label: "↑ Up only",       lvl: "info" },
            { dir: "down",       label: "↓ Down only",     lvl: "info" },
            { dir: "horizontal", label: "↔ Horizontal",    lvl: "success" },
            { dir: "vertical",   label: "↕ Vertical",      lvl: "success" },
          ] as const).map(({ dir, label, lvl }) => (
            <Card key={dir} title={label}>
              <button style={btn} onClick={() => toastAdvanced.show({
                message: `Swipe ${label.toLowerCase()} to dismiss`,
                level: lvl,
                swipeDismiss: true,
                swipeDirection: dir,
                duration: 12000,
              })}>Show</button>
            </Card>
          ))}
        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 19. PERSISTENT ALERTS ────────────────────────────────────────────────────

export const PersistentAlerts: Story = {
  name: "Persistent Alerts",
  parameters: {
    docs: { description: { story: "Toasts that stay until explicitly dismissed — ideal for critical alerts, announcements, and legal notices." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Persistence" title="Persistent & priority toasts">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Persistent (manual close only)">
            <button style={btn} onClick={() => toastAdvanced.show({ message: "Pinned until you close it.", level: "info", persistent: true, closable: true })}>Show</button>
          </Card>

          <Card title="Critical alert (no auto-dismiss)">
            <button style={btnRed} onClick={() => toastAdvanced.show({
              title: "Critical security alert",
              message: "Unusual login detected from 192.168.1.1.",
              level: "error",
              persistent: true,
              closable: true,
              actions: [
                { label: "Secure account", primary: true, onClick: () => toastAdvanced.success("Account secured.") },
                { label: "Not me", onClick: () => toastAdvanced.info("Reported.") },
              ],
            })}>Show</button>
          </Card>

          <Card title="System announcement">
            <button style={btnBlue} onClick={() => toastAdvanced.show({
              title: "Scheduled maintenance",
              message: "The service will be down on Sunday 02:00–04:00 UTC.",
              level: "warning",
              persistent: true,
              actions: [{ label: "Got it", primary: true, onClick: () => {} }],
            })}>Show</button>
          </Card>

          <Card title="Legal / cookie notice">
            <button style={btn} onClick={() => toastAdvanced.show({
              message: "We use cookies to improve your experience.",
              level: "info",
              persistent: true,
              actions: [
                { label: "Accept all", primary: true, onClick: () => toastAdvanced.success("Preferences saved.") },
                { label: "Manage", onClick: () => toastAdvanced.info("Settings opened.") },
              ],
            })}>Show</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 20. CONFIGURATION MODES ──────────────────────────────────────────────────

export const ConfigurationModes: Story = {
  name: "Configuration Modes",
  parameters: {
    docs: { description: { story: "Global config changes that affect all subsequent toasts. Hit Reset to restore defaults." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Config" title="Global configuration">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>

          <Card title="Duration">
            <BtnRow>
              {[1000, 2000, 4000, 8000, 12000].map(ms => (
                <button key={ms} style={btn} onClick={() => {
                  toastAdvanced.configure({ duration: ms });
                  toastAdvanced.info(`Duration: ${ms / 1000}s`);
                }}>{ms / 1000}s</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="Max visible">
            <BtnRow>
              {[1, 2, 3, 5, 10].map(n => (
                <button key={n} style={btn} onClick={() => {
                  toastAdvanced.configure({ maxVisible: n });
                  toastAdvanced.info(`Max visible: ${n}`);
                }}>{n}</button>
              ))}
            </BtnRow>
          </Card>

          <Card title="Pause on hover">
            <BtnRow>
              <button style={btnGreen} onClick={() => { toastAdvanced.configure({ pauseOnHover: true });  toastAdvanced.info("Pause on hover: ON");  }}>On</button>
              <button style={btn}      onClick={() => { toastAdvanced.configure({ pauseOnHover: false }); toastAdvanced.info("Pause on hover: OFF"); }}>Off</button>
            </BtnRow>
          </Card>

          <Card title="Pause on window blur">
            <BtnRow>
              <button style={btnGreen} onClick={() => { toastAdvanced.configure({ pauseOnWindowBlur: true });  toastAdvanced.show({ message: "Switch tabs to pause me!", level: "info", duration: 15000 }); }}>On</button>
              <button style={btn}      onClick={() => { toastAdvanced.configure({ pauseOnWindowBlur: false }); toastAdvanced.info("Pause on blur: OFF"); }}>Off</button>
            </BtnRow>
          </Card>

          <Card title="Swipe dismiss (global)">
            <BtnRow>
              <button style={btnGreen} onClick={() => { toastAdvanced.configure({ swipeDismiss: true });  toastAdvanced.info("Swipe dismiss: ON — drag to dismiss"); }}>On</button>
              <button style={btn}      onClick={() => { toastAdvanced.configure({ swipeDismiss: false }); toastAdvanced.info("Swipe dismiss: OFF"); }}>Off</button>
            </BtnRow>
          </Card>

          <Card title="Reset to defaults">
            <button style={btnPrimary} onClick={() => {
              toastAdvanced.configure({ duration: 4000, maxVisible: 5, position: "bottom-right", pauseOnHover: true, swipeDismiss: true, pauseOnWindowBlur: false });
              toastAdvanced.success("Configuration reset to defaults.");
            }}>Reset</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 21. BULK NOTIFICATIONS ───────────────────────────────────────────────────

export const BulkNotifications: Story = {
  name: "Bulk Notifications",
  parameters: {
    docs: { description: { story: "Sequential, staggered, and concurrent batch notifications — tests the queue and maxVisible limits." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Bulk" title="Multiple notifications">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>

          <Card title="3 sequential (200ms apart)">
            <button style={btn} onClick={() => {
              [
                { message: "New email from support@editora.dev", level: "info" as const },
                { message: "Database backup completed", level: "success" as const },
                { message: "High CPU on server-01", level: "warning" as const },
              ].forEach(({ message, level }, i) =>
                setTimeout(() => toastAdvanced.show({ message, level, position: "top-right" }), i * 200));
            }}>Fire 3</button>
          </Card>

          <Card title="5 rapid-fire">
            <button style={btn} onClick={() => {
              (["info", "success", "error", "warning", "info"] as const).forEach((lvl, i) =>
                setTimeout(() => toastAdvanced.show({ message: `Notification ${i + 1}`, level: lvl }), i * 100));
            }}>Fire 5</button>
          </Card>

          <Card title="Staggered (1s gaps)">
            <button style={btn} onClick={() => {
              ["Build started", "Tests passing (48/48)", "Deployed to staging", "Smoke tests OK", "Deployed to production"].forEach((msg, i) =>
                setTimeout(() => toastAdvanced.show({ message: msg, level: i === 4 ? "success" : "info" }), i * 1000));
            }}>Deploy pipeline</button>
          </Card>

          <Card title="All levels at once">
            <button style={btn} onClick={() => {
              LEVELS.filter(l => l !== "promise").forEach(lvl =>
                toastAdvanced.show({ message: LEVEL_MESSAGES[lvl], level: lvl as any }));
            }}>All levels</button>
          </Card>

          <Card title="Clear all">
            <button style={btnRed} onClick={() => toastAdvanced.clear()}>Clear all</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 22. SYSTEM NOTIFICATIONS ─────────────────────────────────────────────────

export const SystemNotifications: Story = {
  name: "System Notifications",
  parameters: {
    docs: { description: { story: "OS-style notifications with titles, icons, and actionable CTAs — update prompts, disk alerts, connection drops, messages." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="OS-style" title="System notification patterns">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          {[
            { title: "System update v2.1.0",  msg: "New features, security fixes, and performance improvements.",          level: "success" as const, a1: "Update now", a2: "Later" },
            { title: "Low disk space",         msg: "Only 2.3 GB remaining. Consider clearing cache or upgrading.",         level: "warning" as const, a1: "Free space",  a2: "Dismiss" },
            { title: "Connection lost",        msg: "Internet disconnected. Some features may not be available.",           level: "error"   as const, a1: "Retry",       a2: "Settings" },
            { title: "3 new messages",         msg: "Jordan, Alex, and Maria sent you messages in #design.",                level: "info"    as const, a1: "View",        a2: "Mark read" },
            { title: "Backup complete",        msg: "All 4,821 files were backed up to cloud storage successfully.",        level: "success" as const, a1: "View backup" },
            { title: "Session expiring",       msg: "Your session will expire in 5 minutes. Save your work.",              level: "warning" as const, a1: "Extend",       a2: "Sign out" },
            { title: "New device signed in",   msg: "MacBook Pro signed into your account from San Francisco, CA.",         level: "warning" as const, a1: "That's me",   a2: "Secure account" },
            { title: "Shared with you",        msg: "Alex shared 'Q4 Report.pdf' with view access.",                       level: "info"    as const, a1: "Open file" },
          ].map(({ title, msg, level, a1, a2 }) => (
            <Card key={title} title={title}>
              <button style={btn} onClick={() => toastAdvanced.show({
                title,
                message: msg,
                level,
                duration: 8000,
                actions: [
                  { label: a1, primary: true, onClick: () => toastAdvanced.info(`${a1} clicked`) },
                  ...(a2 ? [{ label: a2, onClick: () => {} }] : []),
                ],
              })}>Show</button>
            </Card>
          ))}

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 23. CUSTOM STYLING ───────────────────────────────────────────────────────

export const CustomStyling: Story = {
  name: "Custom Styling",
  parameters: {
    docs: { description: { story: "Override CSS variables globally or per-toast, pass custom className, or set inline styles via the render() API." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Customisation" title="CSS variable overrides" desc="Every aspect of the toast is driven by a CSS variable — no !important fights needed.">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="Brand colours (CSS vars)">
            <button style={btn} onClick={() => {
              // Temporarily override the CSS variables on :root
              document.documentElement.style.setProperty("--et-success", "#7c3aed");
              document.documentElement.style.setProperty("--et-success-tint", "rgba(124,58,237,.06)");
              document.documentElement.style.setProperty("--et-success-ring", "rgba(124,58,237,.18)");
              toastAdvanced.success("Brand purple success toast");
              setTimeout(() => {
                document.documentElement.style.removeProperty("--et-success");
                document.documentElement.style.removeProperty("--et-success-tint");
                document.documentElement.style.removeProperty("--et-success-ring");
              }, 100);
            }}>Purple brand</button>
          </Card>

          <Card title="Sharp corners (radius = 0)">
            <button style={btn} onClick={() => {
              document.documentElement.style.setProperty("--et-radius", "0px");
              document.documentElement.style.setProperty("--et-radius-sm", "0px");
              toastAdvanced.info("Square-cornered toast");
              setTimeout(() => {
                document.documentElement.style.removeProperty("--et-radius");
                document.documentElement.style.removeProperty("--et-radius-sm");
              }, 100);
            }}>Show</button>
          </Card>

          <Card title="Pill shape (radius = 999px)">
            <button style={btn} onClick={() => {
              document.documentElement.style.setProperty("--et-radius", "999px");
              toastAdvanced.success("Pill-shaped toast");
              setTimeout(() => document.documentElement.style.removeProperty("--et-radius"), 100);
            }}>Show</button>
          </Card>

          <Card title="Wide toast (500px)">
            <button style={btn} onClick={() => {
              document.documentElement.style.setProperty("--et-width", "500px");
              toastAdvanced.info("Extra-wide toast for longer messages that need more horizontal space.");
              setTimeout(() => document.documentElement.style.removeProperty("--et-width"), 100);
            }}>Show</button>
          </Card>

          <Card title="Compact toast (280px)">
            <button style={btn} onClick={() => {
              document.documentElement.style.setProperty("--et-width", "280px");
              toastAdvanced.info("Compact");
              setTimeout(() => document.documentElement.style.removeProperty("--et-width"), 100);
            }}>Show</button>
          </Card>

          <Card title="Large typography">
            <button style={btn} onClick={() => {
              document.documentElement.style.setProperty("--et-font-size-body", "16px");
              document.documentElement.style.setProperty("--et-font-size-title", "17px");
              toastAdvanced.show({ title: "Large text", message: "Accessible font size for users who need it.", level: "info" });
              setTimeout(() => {
                document.documentElement.style.removeProperty("--et-font-size-body");
                document.documentElement.style.removeProperty("--et-font-size-title");
              }, 100);
            }}>Show</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 24. PLUGIN SYSTEM ────────────────────────────────────────────────────────

export const PluginSystem: Story = {
  name: "Plugin System",
  parameters: {
    docs: { description: { story: "Extend toast behaviour with plugins that hook into lifecycle events. Examples: analytics, structured logging, and client-side rate limiting." } },
  },
  render: () => {
    const [installed, setInstalled] = useState<string[]>([]);

    return (
      <Box style={{ padding: 20 }}>
        <Section label="Plugins" title="Plugin system" desc="Plugins hook into afterShow, beforeDismiss, afterUpdate, and other lifecycle events.">
          <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

            <Card title="Analytics plugin">
              <p style={{ fontSize: 12, color: "#78716c", marginBottom: 10 }}>Logs every toast to the console with level, message, and timestamp. Check the browser console.</p>
              <BtnRow>
                <button style={installed.includes("analytics") ? btnGreen : btn} onClick={() => {
                  if (installed.includes("analytics")) return;
                  toastAdvanced.use({
                    name: "analytics",
                    install(manager: any) {
                      manager.on("afterShow", (t: any) => console.log("📊 [analytics]", { level: t.level, message: t.message, ts: new Date().toISOString() }));
                    },
                  });
                  setInstalled(p => [...p, "analytics"]);
                  toastAdvanced.success("Analytics plugin installed — check console");
                }}>{installed.includes("analytics") ? "✓ Installed" : "Install"}</button>
                <button style={btn} onClick={() => toastAdvanced.info("This toast is being tracked")}>Test</button>
              </BtnRow>
            </Card>

            <Card title="Logger plugin">
              <p style={{ fontSize: 12, color: "#78716c", marginBottom: 10 }}>Structured log with JSON payload for every toast lifecycle event.</p>
              <BtnRow>
                <button style={installed.includes("logger") ? btnGreen : btn} onClick={() => {
                  if (installed.includes("logger")) return;
                  toastAdvanced.use({
                    name: "logger",
                    install(manager: any) {
                      manager.on("afterShow",    (t: any) => console.log("📝 [toast:show]",    JSON.stringify({ id: t.id, level: t.level })));
                      manager.on("beforeDismiss",(t: any) => console.log("📝 [toast:dismiss]", JSON.stringify({ id: t.id, level: t.level })));
                    },
                  });
                  setInstalled(p => [...p, "logger"]);
                  toastAdvanced.success("Logger plugin installed — check console");
                }}>{installed.includes("logger") ? "✓ Installed" : "Install"}</button>
                <button style={btn} onClick={() => toastAdvanced.warning("Logged warning")}>Test</button>
              </BtnRow>
            </Card>

            <Card title="Rate-limiter plugin (demo)">
              <p style={{ fontSize: 12, color: "#78716c", marginBottom: 10 }}>Throttles duplicate messages to prevent spam. Click rapidly to see it in action.</p>
              <BtnRow>
                <button style={installed.includes("ratelimit") ? btnGreen : btn} onClick={() => {
                  if (installed.includes("ratelimit")) return;
                  const seen = new Map<string, number>();
                  toastAdvanced.use({
                    name: "ratelimit",
                    install(manager: any) {
                      const orig = manager.show.bind(manager);
                      manager.show = (opts: any) => {
                        const key = opts.message ?? "";
                        const last = seen.get(key) ?? 0;
                        if (Date.now() - last < 2000) { console.warn("[ratelimit] throttled:", key); return { id: "throttled" }; }
                        seen.set(key, Date.now());
                        return orig(opts);
                      };
                    },
                  });
                  setInstalled(p => [...p, "ratelimit"]);
                  toastAdvanced.success("Rate-limiter installed — try spamming the test button");
                }}>{installed.includes("ratelimit") ? "✓ Installed" : "Install"}</button>
                <button style={btn} onClick={() => toastAdvanced.info("Same message — try clicking fast")}>Test (spam me)</button>
              </BtnRow>
            </Card>

          </Grid>
        </Section>
      </Box>
    );
  },
};

// ─── 25. EDGE CASES ───────────────────────────────────────────────────────────

export const EdgeCases: Story = {
  name: "Edge Cases",
  parameters: {
    docs: { description: { story: "Unusual or extreme inputs — empty strings, very long messages, special characters, rapid updates, and unicode." } },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Edge cases" title="Robustness checks">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>

          <Card title="Empty message">
            <button style={btn} onClick={() => toastAdvanced.info("")}>Show</button>
          </Card>

          <Card title="Very long single word">
            <button style={btn} onClick={() => toastAdvanced.info("Pneumonoultramicroscopicsilicovolcanoconiosis")}>Show</button>
          </Card>

          <Card title="200-char message">
            <button style={btn} onClick={() => toastAdvanced.info("A".repeat(200))}>Show</button>
          </Card>

          <Card title="Emoji-heavy">
            <button style={btn} onClick={() => toastAdvanced.success("🎉🚀✨💡🔥⚡🎯🎨🌟💫🎪🎭🎬🎤🎧🎸🥁🎺🎻🪗")}>Show</button>
          </Card>

          <Card title="Special characters">
            <button style={btn} onClick={() => toastAdvanced.info("& < > \" ' ` \\ / | ? * # @ ! $ % ^ ( ) [ ] { }")}>Show</button>
          </Card>

          <Card title="Rapid update (10× in 100ms)">
            <button style={btn} onClick={() => {
              const t = toastAdvanced.loading("Starting…");
              for (let i = 1; i <= 10; i++) {
                setTimeout(() => toastAdvanced.update(t.id, { message: `Update ${i}/10` }), i * 10);
              }
              setTimeout(() => toastAdvanced.update(t.id, { message: "Done!", level: "success" }), 150);
            }}>Show</button>
          </Card>

          <Card title="Fire 20 rapidly">
            <button style={btn} onClick={() => {
              for (let i = 0; i < 20; i++) {
                setTimeout(() => toastAdvanced.show({ message: `Toast ${i + 1}`, level: i % 2 === 0 ? "info" : "success" }), i * 50);
              }
            }}>Fire 20</button>
          </Card>

          <Card title="CJK characters">
            <button style={btn} onClick={() => toastAdvanced.success("文件已成功保存。お知らせです。파일이 저장되었습니다.")}>Show</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 26. THEMING DEEP DIVE ────────────────────────────────────────────────────

export const ThemingDeepDive: Story = {
  name: "Theming Deep Dive",
  parameters: {
    docs: {
      description: {
        story: "Side-by-side comparison of every theme × every level, plus richColors mode and CSS variable override recipes.",
      },
    },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section
        label="Themes"
        title="Every theme × every level"
        desc="Each row fires the same message in a different theme so you can compare colour treatments at a glance."
      >
        {THEMES.map(theme => (
          <Card key={theme}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: 6, background: THEME_SWATCHES[theme] ?? "#ddd", border: "1px solid rgba(0,0,0,.1)", flexShrink: 0 }} />
              <p style={{ fontWeight: 600, fontSize: 14, margin: 0, textTransform: "capitalize" }}>{theme}</p>
            </div>
            <BtnRow>
              {(["success", "info", "warning", "error", "loading"] as const).map(lvl => (
                <button
                  key={lvl}
                  style={btn}
                  onClick={() =>
                    toastAdvanced.show({ message: `${theme} / ${lvl}`, level: lvl, theme: theme as any })
                  }
                >
                  {lvl}
                </button>
              ))}
            </BtnRow>
          </Card>
        ))}
      </Section>

      <Section label="Rich colours" title="richColors mode" desc="When richColors is true the background becomes a deeper semantic fill.">
        <Card>
          <BtnRow>
            {(["success", "error", "warning", "info"] as const).map(lvl => (
              <button
                key={lvl}
                style={btn}
                onClick={() =>
                  toastAdvanced.show({ message: `${lvl} rich colour`, level: lvl, richColors: true } as any)
                }
              >
                {lvl}
              </button>
            ))}
          </BtnRow>
        </Card>
      </Section>

      <Section label="CSS overrides" title="Token override recipes">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
          {[
            {
              label: "Brand indigo",
              vars: { "--et-info": "#4f46e5", "--et-info-tint": "rgba(79,70,229,.06)", "--et-info-ring": "rgba(79,70,229,.2)" },
              level: "info" as const,
              msg: "Indigo brand info",
            },
            {
              label: "Teal success",
              vars: { "--et-success": "#0d9488", "--et-success-tint": "rgba(13,148,136,.06)", "--et-success-ring": "rgba(13,148,136,.2)" },
              level: "success" as const,
              msg: "Teal success toast",
            },
            {
              label: "Crimson error",
              vars: { "--et-error": "#be123c", "--et-error-tint": "rgba(190,18,60,.06)", "--et-error-ring": "rgba(190,18,60,.2)" },
              level: "error" as const,
              msg: "Crimson error toast",
            },
            {
              label: "No shadow",
              vars: { "--et-shadow": "none" },
              level: "info" as const,
              msg: "Shadow removed",
            },
          ].map(({ label, vars, level, msg }) => (
            <Card key={label} title={label}>
              <button
                style={btn}
                onClick={() => {
                  Object.entries(vars).forEach(([k, v]) =>
                    document.documentElement.style.setProperty(k, v)
                  );
                  toastAdvanced.show({ message: msg, level });
                  setTimeout(
                    () => Object.keys(vars).forEach(k => document.documentElement.style.removeProperty(k)),
                    120
                  );
                }}
              >
                Show
              </button>
            </Card>
          ))}
        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 27. POSITION × THEME MATRIX ─────────────────────────────────────────────

export const PositionThemeMatrix: Story = {
  name: "Position × Theme Matrix",
  parameters: {
    docs: {
      description: {
        story: "Fire any combination of position and theme from a single picker to verify layout correctness.",
      },
    },
  },
  render: () => {
    const [selTheme, setSelTheme] = useState<ToastTheme>("light");
    const [selPos, setSelPos]     = useState<ToastPosition>("bottom-right");

    return (
      <Box style={{ padding: 20 }}>
        <Section label="Matrix" title="Position × Theme picker">
          <Grid style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            <Card title="1. Pick a theme">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(80px,1fr))", gap: 6 }}>
                {THEMES.map(t => (
                  <button
                    key={t}
                    style={{
                      ...btn,
                      flexDirection: "column" as const,
                      gap: 4,
                      padding: "8px 4px",
                      background: selTheme === t ? "#1c1917" : "#fff",
                      color: selTheme === t ? "#fafaf9" : "#1c1917",
                      fontSize: 11,
                    }}
                    onClick={() => setSelTheme(t)}
                  >
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: THEME_SWATCHES[t] ?? "#ddd", border: "1px solid rgba(0,0,0,.1)" }} />
                    {t}
                  </button>
                ))}
              </div>
            </Card>

            <Card title="2. Pick a position">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, maxWidth: 280 }}>
                {([
                  ["top-left", "↖ TL"],
                  ["top-center", "↑ TC"],
                  ["top-right", "↗ TR"],
                  ["bottom-left", "↙ BL"],
                  ["bottom-center", "↓ BC"],
                  ["bottom-right", "↘ BR"],
                ] as const).map(([p, label]) => (
                  <button
                    key={p}
                    style={{
                      ...btn,
                      fontSize: 11,
                      background: selPos === p ? "#1c1917" : "#fff",
                      color: selPos === p ? "#fafaf9" : "#1c1917",
                    }}
                    onClick={() => setSelPos(p)}
                  >
                    {label}
                  </button>
                ))}
                <button
                  style={{
                    ...btn,
                    fontSize: 11,
                    gridColumn: "span 3",
                    background: selPos === "center" ? "#1c1917" : "#fff",
                    color: selPos === "center" ? "#fafaf9" : "#1c1917",
                  }}
                  onClick={() => setSelPos("center" as ToastPosition)}
                >
                  ⊕ Centre
                </button>
              </div>
            </Card>

          </Grid>

          <div style={{ marginTop: 16 }}>
            <BtnRow>
              {(["success", "info", "warning", "error"] as const).map(lvl => (
                <button
                  key={lvl}
                  style={btn}
                  onClick={() =>
                    toastAdvanced.show({
                      message: `${selTheme} · ${selPos} · ${lvl}`,
                      level: lvl,
                      theme: selTheme as any,
                      position: selPos,
                    })
                  }
                >
                  Fire {lvl}
                </button>
              ))}
              <button style={btnRed} onClick={() => toastAdvanced.clear()}>Clear all</button>
            </BtnRow>
          </div>
        </Section>
      </Box>
    );
  },
};

// ─── 28. ANIMATION PLAYGROUND ─────────────────────────────────────────────────

export const AnimationPlayground: Story = {
  name: "Animation Playground",
  parameters: {
    docs: {
      description: {
        story: "Interactive picker: choose any animation type, direction, intensity, and duration, then fire a preview toast.",
      },
    },
  },
  render: () => {
    const [type, setType]           = useState<string>("spring");
    const [direction, setDirection] = useState<string>("up");
    const [intensity, setIntensity] = useState<string>("normal");
    const [duration, setDuration]   = useState<number>(500);

    const buildAnimation = () => {
      switch (type) {
        case "spring":   return { type: "spring" as const, config: { stiffness: 100, damping: 20 } };
        case "bounce":   return { type: "bounce"  as const, direction: direction as any, intensity: intensity as any, duration };
        case "slide":    return { type: "slide"   as const, direction: direction as any, distance: 80, duration };
        case "zoom":     return { type: "zoom"    as const, scale: 0.3, origin: direction as any, duration };
        case "flip":     return { type: "flip"    as const, axis: direction as any, direction: "forward" as any, duration };
        case "fade":     return { type: "fade"    as const, direction: direction as any, distance: 20, duration };
        case "elastic":  return { type: "elastic" as const, direction: direction as any, intensity: intensity as any, duration };
        case "rotate":   return { type: "rotate"  as const, degrees: 360, direction: "clockwise" as any, duration };
        default:         return { type: "fade" as const };
      }
    };

    return (
      <Box style={{ padding: 20 }}>
        <Section label="Motion" title="Animation playground">
          <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>

            <Card title="Animation type">
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {ANIMATION_TYPES.filter(t => t !== "custom").map(t => (
                  <button
                    key={t}
                    style={{
                      ...btn,
                      fontSize: 12,
                      background: type === t ? "#1c1917" : "#fff",
                      color: type === t ? "#fafaf9" : "#1c1917",
                    }}
                    onClick={() => setType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Direction / origin / axis">
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {["up", "down", "left", "right", "x", "y", "center", "none"].map(d => (
                  <button
                    key={d}
                    style={{
                      ...btn,
                      fontSize: 12,
                      background: direction === d ? "#1c1917" : "#fff",
                      color: direction === d ? "#fafaf9" : "#1c1917",
                    }}
                    onClick={() => setDirection(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Card>

            <Card title="Intensity">
              <BtnRow>
                {["gentle", "normal", "strong"].map(i => (
                  <button
                    key={i}
                    style={{
                      ...btn,
                      background: intensity === i ? "#1c1917" : "#fff",
                      color: intensity === i ? "#fafaf9" : "#1c1917",
                    }}
                    onClick={() => setIntensity(i)}
                  >
                    {i}
                  </button>
                ))}
              </BtnRow>
            </Card>

            <Card title={`Duration: ${duration}ms`}>
              <BtnRow>
                {[200, 400, 600, 800, 1200].map(d => (
                  <button
                    key={d}
                    style={{
                      ...btn,
                      fontSize: 12,
                      background: duration === d ? "#1c1917" : "#fff",
                      color: duration === d ? "#fafaf9" : "#1c1917",
                    }}
                    onClick={() => setDuration(d)}
                  >
                    {d}ms
                  </button>
                ))}
              </BtnRow>
            </Card>

          </Grid>

          <div style={{ marginTop: 16 }}>
            <BtnRow>
              {(["success", "info", "warning", "error"] as const).map(lvl => (
                <button
                  key={lvl}
                  style={btn}
                  onClick={() =>
                    toastAdvanced.show({
                      message: `${type} · ${direction} · ${duration}ms`,
                      level: lvl,
                      animation: buildAnimation() as any,
                    })
                  }
                >
                  Fire {lvl}
                </button>
              ))}
            </BtnRow>
          </div>
        </Section>
      </Box>
    );
  },
};

// ─── 29. PROMISE CHAINING ─────────────────────────────────────────────────────

export const PromiseChaining: Story = {
  name: "Promise Chaining",
  parameters: {
    docs: {
      description: {
        story: "Demonstrates chained async workflows where the completion of one promise triggers the next toast lifecycle.",
      },
    },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Async" title="Promise chaining patterns">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          <Card title="3-step pipeline">
            <button
              style={btn}
              onClick={async () => {
                // Step 1
                await toastAdvanced
                  .promise(new Promise(r => setTimeout(r, 1000)), {
                    loading: "Step 1: Fetching config…",
                    success: "Step 1 complete",
                    error: "Step 1 failed",
                  })
                  .catch(() => {});

                // Step 2
                await toastAdvanced
                  .promise(new Promise(r => setTimeout(r, 1200)), {
                    loading: "Step 2: Building assets…",
                    success: "Step 2 complete",
                    error: "Step 2 failed",
                  })
                  .catch(() => {});

                // Step 3
                await toastAdvanced
                  .promise(new Promise(r => setTimeout(r, 800)), {
                    loading: "Step 3: Deploying…",
                    success: "🚀 Deployed!",
                    error: "Deploy failed",
                  })
                  .catch(() => {});
              }}
            >
              Run pipeline
            </button>
          </Card>

          <Card title="Retry on failure">
            <button
              style={btn}
              onClick={async () => {
                let attempt = 0;
                const tryIt = (): Promise<void> =>
                  toastAdvanced
                    .promise(
                      new Promise<void>((res, rej) =>
                        setTimeout(() => {
                          attempt++;
                          attempt >= 3 ? res() : rej(new Error(`Attempt ${attempt} failed`));
                        }, 1500)
                      ),
                      {
                        loading: `Attempt ${attempt + 1}…`,
                        success: `Succeeded on attempt ${attempt}!`,
                        error: e => `${e.message} — retrying…`,
                      }
                    )
                    .catch(() => new Promise(r => setTimeout(r, 500)).then(tryIt));

                tryIt();
              }}
            >
              Auto-retry (3 attempts)
            </button>
          </Card>

          <Card title="Parallel promises">
            <button
              style={btn}
              onClick={() => {
                const jobs = [
                  { label: "Images",    ms: 1200 },
                  { label: "Styles",    ms: 800  },
                  { label: "Scripts",   ms: 1600 },
                ];
                jobs.forEach(({ label, ms }) =>
                  toastAdvanced
                    .promise(new Promise(r => setTimeout(r, ms)), {
                      loading: `Compiling ${label}…`,
                      success: `${label} ready`,
                      error: `${label} failed`,
                    })
                    .catch(() => {})
                );
              }}
            >
              Run 3 parallel jobs
            </button>
          </Card>

          <Card title="Sequential with data passing">
            <button
              style={btn}
              onClick={async () => {
                const userId = await toastAdvanced
                  .promise<number>(
                    new Promise(r => setTimeout(() => r(42), 1000)),
                    { loading: "Looking up user…", success: d => `Found user #${d}`, error: "User not found" }
                  )
                  .catch(() => null);

                if (!userId) return;

                await toastAdvanced
                  .promise(
                    new Promise(r => setTimeout(r, 1200)),
                    { loading: `Loading profile for #${userId}…`, success: "Profile loaded", error: "Profile unavailable" }
                  )
                  .catch(() => {});
              }}
            >
              User lookup → profile
            </button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 30. REAL-WORLD SCENARIOS ─────────────────────────────────────────────────

export const RealWorldScenarios: Story = {
  name: "Real-World Scenarios",
  parameters: {
    docs: {
      description: {
        story: "End-to-end flows that simulate real product moments: form submit, e-commerce checkout, code deploy, and document collaboration.",
      },
    },
  },
  render: () => (
    <Box style={{ padding: 20 }}>
      <Section label="Real world" title="Product-ready notification flows">
        <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>

          {/* Form submit */}
          <Card title="Form submission">
            <button style={btn} onClick={async () => {
              toastAdvanced.loading("Validating fields…");
              await new Promise(r => setTimeout(r, 600));
              toastAdvanced.clear();

              await toastAdvanced
                .promise(new Promise(r => setTimeout(r, 1800)), {
                  loading: "Submitting form…",
                  success: "Form submitted! We'll be in touch.",
                  error: "Submission failed. Please retry.",
                })
                .catch(() => {});
            }}>Submit form</button>
          </Card>

          {/* E-commerce checkout */}
          <Card title="E-commerce checkout">
            <button style={btn} onClick={async () => {
              await toastAdvanced.promise(new Promise(r => setTimeout(r, 1000)), { loading: "Checking stock…", success: "Items reserved", error: "Out of stock" }).catch(() => {});
              await toastAdvanced.promise(new Promise(r => setTimeout(r, 1500)), { loading: "Processing payment…", success: "Payment approved", error: "Card declined" }).catch(() => {});
              await toastAdvanced.promise(new Promise(r => setTimeout(r, 800)),  { loading: "Confirming order…", success: "🎉 Order #8421 confirmed!", error: "Order failed" }).catch(() => {});
            }}>Checkout</button>
          </Card>

          {/* Git push deploy */}
          <Card title="Git push → deploy">
            <button style={btn} onClick={() => {
              const steps = [
                { msg: "Detected push to main", lvl: "info" as const, delay: 0 },
                { msg: "CI: running 48 tests…", lvl: "loading" as const, delay: 700 },
                { msg: "CI: all tests passed ✓", lvl: "success" as const, delay: 2200 },
                { msg: "Building Docker image…", lvl: "loading" as const, delay: 2800 },
                { msg: "Pushing to registry…",   lvl: "loading" as const, delay: 4200 },
                { msg: "Deploying to prod…",      lvl: "loading" as const, delay: 5400 },
                { msg: "🚀 Live at v2.4.1",       lvl: "success" as const, delay: 7000 },
              ];
              steps.forEach(({ msg, lvl, delay }) =>
                setTimeout(() => toastAdvanced.show({ message: msg, level: lvl }), delay)
              );
            }}>Push to main</button>
          </Card>

          {/* Document collaboration */}
          <Card title="Collaborative editing">
            <button style={btn} onClick={() => {
              const events = [
                { msg: "Alex joined the document",            lvl: "info" as const,    delay: 0 },
                { msg: "Maria is editing paragraph 3…",       lvl: "info" as const,    delay: 1200 },
                { msg: "Conflict detected — paragraph 3",     lvl: "warning" as const, delay: 2400 },
                { msg: "Conflict resolved automatically",      lvl: "success" as const, delay: 3600 },
                { msg: "Document auto-saved",                  lvl: "success" as const, delay: 5000 },
              ];
              events.forEach(({ msg, lvl, delay }) =>
                setTimeout(() => toastAdvanced.show({ message: msg, level: lvl }), delay)
              );
            }}>Simulate session</button>
          </Card>

          {/* SaaS onboarding */}
          <Card title="SaaS onboarding checklist">
            <button style={btn} onClick={() => {
              const steps = [
                "Profile set up ✓",
                "Team invited ✓",
                "Workspace configured ✓",
                "First project created ✓",
                "🎉 Onboarding complete!",
              ];
              steps.forEach((msg, i) =>
                setTimeout(() => toastAdvanced.show({ message: msg, level: i === steps.length - 1 ? "success" : "info" }), i * 900)
              );
            }}>Start onboarding</button>
          </Card>

          {/* File manager */}
          <Card title="File manager operations">
            <button style={btn} onClick={() => {
              toastAdvanced.show({
                title: "Move 3 files?",
                message: "Moving to /archive/2025",
                level: "info",
                duration: 10000,
                actions: [
                  {
                    label: "Move",
                    primary: true,
                    onClick: () => {
                      toastAdvanced.promise(
                        new Promise(r => setTimeout(r, 1500)),
                        { loading: "Moving files…", success: "3 files moved to /archive/2025", error: "Move failed" }
                      ).catch(() => {});
                    },
                  },
                  { label: "Cancel", onClick: () => {} },
                ],
              });
            }}>Move files</button>
          </Card>

          {/* Auth flow */}
          <Card title="Auth flow">
            <button style={btn} onClick={async () => {
              await toastAdvanced.promise(new Promise(r => setTimeout(r, 1200)), { loading: "Verifying credentials…", success: "Credentials valid", error: "Invalid credentials" }).catch(() => {});
              await toastAdvanced.promise(new Promise(r => setTimeout(r, 800)),  { loading: "Generating session…",    success: "Session created",    error: "Session error" }).catch(() => {});
              toastAdvanced.show({ title: "Signed in", message: "Welcome back, Alex!", level: "success", icon: "👋" });
            }}>Sign in</button>
          </Card>

          {/* Notification preferences saved */}
          <Card title="Settings saved">
            <button style={btn} onClick={() => {
              toastAdvanced.show({
                message: "Notification preferences saved.",
                level: "success",
                duration: 5000,
                actions: [{ label: "Undo", onClick: () => toastAdvanced.info("Changes reverted.") }],
              });
            }}>Save settings</button>
          </Card>

        </Grid>
      </Section>
    </Box>
  ),
};

// ─── 31. STRESS TEST ──────────────────────────────────────────────────────────

export const StressTest: Story = {
  name: "Stress Test",
  parameters: {
    docs: {
      description: {
        story: "High-volume and worst-case scenarios to verify the queue, animation engine, and GC behaviour under load.",
      },
    },
  },
  render: () => {
    const [running, setRunning] = useState(false);

    return (
      <Box style={{ padding: 20 }}>
        <Section label="Stress" title="High-volume & edge-case testing">
          <Grid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>

            <Card title="50 toasts, 50ms apart">
              <button
                style={running ? { ...btn, opacity: 0.5 } : btn}
                disabled={running}
                onClick={() => {
                  setRunning(true);
                  for (let i = 0; i < 50; i++) {
                    const lvl = (["info", "success", "error", "warning"] as const)[i % 4];
                    setTimeout(() => {
                      toastAdvanced.show({ message: `Toast #${i + 1}`, level: lvl });
                      if (i === 49) setRunning(false);
                    }, i * 50);
                  }
                }}
              >
                {running ? "Running…" : "Fire 50"}
              </button>
            </Card>

            <Card title="100 toasts, 20ms apart">
              <button
                style={running ? { ...btn, opacity: 0.5 } : btn}
                disabled={running}
                onClick={() => {
                  setRunning(true);
                  for (let i = 0; i < 100; i++) {
                    const lvl = (["info", "success", "error", "warning"] as const)[i % 4];
                    setTimeout(() => {
                      toastAdvanced.show({ message: `#${i + 1}`, level: lvl, duration: 3000 });
                      if (i === 99) setRunning(false);
                    }, i * 20);
                  }
                }}
              >
                {running ? "Running…" : "Fire 100"}
              </button>
            </Card>

            <Card title="Rapid update storm">
              <button
                style={btn}
                onClick={() => {
                  const t = toastAdvanced.loading("Starting…");
                  for (let i = 1; i <= 30; i++) {
                    setTimeout(() =>
                      toastAdvanced.update(t.id, {
                        message: `Update ${i}/30`,
                        level: i === 30 ? "success" : "loading",
                      }),
                    i * 30
                    );
                  }
                }}
              >
                30 rapid updates
              </button>
            </Card>

            <Card title="Concurrent promise storm">
              <button
                style={btn}
                onClick={() => {
                  for (let i = 0; i < 8; i++) {
                    const succeed = Math.random() > 0.4;
                    toastAdvanced
                      .promise(
                        new Promise((res, rej) =>
                          setTimeout(
                            () => (succeed ? res(`Job ${i + 1}`) : rej(new Error(`Job ${i + 1} failed`))),
                            800 + Math.random() * 2000
                          )
                        ),
                        {
                          loading: `Job ${i + 1} running…`,
                          success: d => `✓ ${d}`,
                          error: e => `✕ ${e.message}`,
                        }
                      )
                      .catch(() => {});
                  }
                }}
              >
                8 concurrent promises
              </button>
            </Card>

            <Card title="Mixed operation burst">
              <button
                style={btn}
                onClick={() => {
                  // Shows, updates, dismisses, and promise all firing simultaneously
                  const t1 = toastAdvanced.loading("Long-running job…");
                  toastAdvanced.success("Instant success");
                  toastAdvanced.error("Instant error");
                  setTimeout(() => toastAdvanced.update(t1.id, { message: "Job done!", level: "success" }), 2000);
                  toastAdvanced
                    .promise(new Promise(r => setTimeout(r, 1500)), { loading: "Promise op…", success: "Promise resolved", error: "Promise rejected" })
                    .catch(() => {});
                }}
              >
                Mixed burst
              </button>
            </Card>

            <Card title="Clear all mid-animation">
              <button
                style={btn}
                onClick={() => {
                  for (let i = 0; i < 10; i++) {
                    setTimeout(() => toastAdvanced.show({ message: `Toast ${i + 1}`, level: "info" }), i * 80);
                  }
                  setTimeout(() => toastAdvanced.clear(), 500);
                }}
              >
                Fire 10, clear at 500ms
              </button>
            </Card>

          </Grid>

          <div style={{ marginTop: 16 }}>
            <button style={btnRed} onClick={() => { toastAdvanced.clear(); setRunning(false); }}>
              Stop & clear all
            </button>
          </div>
        </Section>
      </Box>
    );
  },
};

// ─── 32. KITCHEN SINK ─────────────────────────────────────────────────────────

export const KitchenSink: Story = {
  name: "Kitchen Sink",
  parameters: {
    docs: {
      description: {
        story: "One story, every feature. A single scrollable page that gives QA and designers a full overview without jumping between stories.",
      },
    },
  },
  render: () => (
    <Box style={{ padding: 20, maxWidth: 900 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 4 }}>Kitchen Sink</h1>
      <p style={{ color: "#78716c", marginBottom: 32 }}>Every feature, one page.</p>

      {/* ── Basic ── */}
      <Section label="01" title="Basic types">
        <BtnRow>
          {(["info", "success", "error", "warning", "loading"] as const).map(lvl => (
            <button key={lvl} style={btn} onClick={() => toastAdvanced.show({ message: LEVEL_MESSAGES[lvl], level: lvl })}>{lvl}</button>
          ))}
        </BtnRow>
      </Section>

      {/* ── Content ── */}
      <Section label="02" title="Content richness">
        <BtnRow>
          <button style={btn} onClick={() => toastAdvanced.show({ title: "With title", message: "And a body message", level: "info" })}>Title</button>
          <button style={btn} onClick={() => toastAdvanced.show({ title: "Full", message: "Body text here", description: "Secondary detail · just now", level: "success" })}>Title + desc</button>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "Custom icon", level: "info", icon: "🚀" })}>Icon</button>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "With action", level: "warning", actions: [{ label: "Undo", onClick: () => {} }] })}>Action</button>
        </BtnRow>
      </Section>

      {/* ── Promise ── */}
      <Section label="03" title="Promise lifecycle">
        <BtnRow>
          <button style={btnGreen} onClick={() => toastAdvanced.promise(new Promise(r => setTimeout(r, 2000)), { loading: "Working…", success: "Done!", error: "Failed" }).catch(() => {})}>Resolve</button>
          <button style={btnRed}   onClick={() => toastAdvanced.promise(new Promise((_, r) => setTimeout(() => r(new Error("Timeout")), 2000)), { loading: "Working…", success: "Done!", error: e => e.message }).catch(() => {})}>Reject</button>
          <button style={btn}      onClick={() => { const t = toastAdvanced.loading("Saving…"); setTimeout(() => toastAdvanced.update(t.id, { message: "Saved!", level: "success" }), 2000); }}>Update</button>
        </BtnRow>
      </Section>

      {/* ── Progress ── */}
      <Section label="04" title="Progress bars">
        <BtnRow>
          <button style={btn} onClick={() => {
            const t = toastAdvanced.show({ message: "Processing…", level: "loading", progress: { value: 0, showPercentage: true } });
            let v = 0;
            const iv = setInterval(() => { v += 10; toastAdvanced.update(t.id, { progress: { value: v, showPercentage: true } }); if (v >= 100) { clearInterval(iv); toastAdvanced.update(t.id, { message: "Done!", level: "success", progress: undefined }); } }, 200);
          }}>Determinate</button>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "Indeterminate…", level: "loading", duration: 4000 })}>Indeterminate</button>
        </BtnRow>
      </Section>

      {/* ── Themes ── */}
      <Section label="05" title="Themes">
        <BtnRow>
          {THEMES.map(t => (
            <button key={t} style={btn} onClick={() => toastAdvanced.show({ message: `Theme: ${t}`, level: "success", theme: t as any })}>{t}</button>
          ))}
        </BtnRow>
      </Section>

      {/* ── Positions ── */}
      <Section label="06" title="Positions">
        <BtnRow>
          {POSITIONS.map(p => (
            <button key={p} style={btn} onClick={() => toastAdvanced.show({ message: p, level: "info", position: p })}>{p}</button>
          ))}
        </BtnRow>
      </Section>

      {/* ── Animations ── */}
      <Section label="07" title="Animations">
        <BtnRow>
          {(["spring", "bounce", "slide", "zoom", "flip", "fade", "elastic", "rotate"] as const).map(a => (
            <button key={a} style={btn} onClick={() => toastAdvanced.show({ message: a, level: "info", animation: { type: a } as any })}>{a}</button>
          ))}
        </BtnRow>
      </Section>

      {/* ── Interaction ── */}
      <Section label="08" title="Interaction">
        <BtnRow>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "Persistent — close manually", level: "info", persistent: true, closable: true })}>Persistent</button>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "No close button", level: "info", closable: false, duration: 3000 })}>No close</button>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "Swipe to dismiss", level: "info", swipeDismiss: true, duration: 8000 })}>Swipeable</button>
          <button style={btn} onClick={() => toastAdvanced.show({ message: "نص عربي", level: "info", rtl: true })}>RTL</button>
          <button style={btnRed} onClick={() => toastAdvanced.clear()}>Clear all</button>
        </BtnRow>
      </Section>

    </Box>
  ),
};
