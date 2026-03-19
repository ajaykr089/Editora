import React from "react";
import {
  Box,
  Button,
  Field,
  Flex,
  Input,
  Select,
  Textarea,
} from "@editora/ui-react";
import { Wizard } from "@editora/ui-react";

export default {
  title: "UI/Wizard",
  component: Wizard,
  argTypes: {
    linear: { control: "boolean" },
    keepMounted: { control: "boolean" },
    variant: {
      control: "select",
      options: ["default", "soft", "glass", "flat", "contrast", "minimal"],
    },
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    density: {
      control: "select",
      options: ["default", "compact", "comfortable"],
    },
    shape: { control: "select", options: ["rounded", "square", "pill"] },
    showProgress: { control: "boolean" },
    busy: { control: "boolean" },
  },
};

export const EnterpriseOnboarding = (args: any) => {
  const [value, setValue] = React.useState("org");
  const [busy, setBusy] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState("idle");
  const [orgName, setOrgName] = React.useState("Northstar Hospital");
  const [module, setModule] = React.useState("hospital");
  const [policy, setPolicy] = React.useState("7 years for records");

  const canReview = orgName.trim().length > 0 && module.trim().length > 0;

  return (
    <Box style={{ maxWidth: 920, display: "grid", gap: 12 }}>
      <Wizard
        value={value}
        linear={args.linear}
        keepMounted={args.keepMounted}
        variant={args.variant || "glass"}
        orientation={args.orientation || "horizontal"}
        density={args.density || "default"}
        shape={args.shape || "rounded"}
        showProgress={args.showProgress ?? true}
        busy={busy || args.busy}
        title="Workspace Provisioning"
        description="Configure tenant profile, modules, and policy in a guided enterprise flow."
        onBeforeChange={(detail) => {
          if (detail.nextValue === "review" && !canReview) {
            setLastEvent("blocked:review");
            return false;
          }
          return true;
        }}
        onChange={(detail) => {
          setValue(detail.value);
          setLastEvent(`step:${detail.value}`);
        }}
        onStepChange={(detail) => {
          setLastEvent(`step-change:${detail.value}`);
        }}
        onComplete={() => {
          setBusy(true);
          setLastEvent("publishing");
          window.setTimeout(() => {
            setBusy(false);
            setLastEvent("complete");
          }, 1100);
        }}
      >
        <Wizard.Step
          value="org"
          title="Organization"
          description="Tenant profile"
          state={orgName ? "success" : "default"}
        >
          <Field label="Organization name" htmlFor="wizard-org-name" required>
            <Input
              id="wizard-org-name"
              placeholder="Northstar Hospital"
              value={orgName}
              onChange={(event: any) => setOrgName(event?.target?.value ?? "")}
              required
            />
          </Field>
        </Wizard.Step>

        <Wizard.Step
          value="modules"
          title="Modules"
          description="Feature toggles"
          state={module ? "complete" : "default"}
        >
          <Field label="Primary module" htmlFor="wizard-module">
            <Select
              id="wizard-module"
              value={module}
              onChange={(event: any) => setModule(event?.target?.value ?? "")}
            >
              <option value="hospital">Hospital management</option>
              <option value="school">School management</option>
              <option value="commerce">E-commerce operations</option>
            </Select>
          </Field>
        </Wizard.Step>

        <Wizard.Step
          value="policy"
          title="Policy"
          description="Validation rules"
        >
          <Field label="Retention policy" htmlFor="wizard-policy">
            <Textarea
              id="wizard-policy"
              rows={3}
              value={policy}
              onChange={(event: any) => setPolicy(event?.target?.value ?? "")}
            />
          </Field>
        </Wizard.Step>

        <Wizard.Step
          value="review"
          title="Review"
          description="Ready to ship"
          state={canReview ? "success" : "warning"}
        >
          <Box style={{ display: "grid", gap: 10 }}>
            <Box
              style={{
                fontSize: "var(--ui-font-size-md, 14px)",
                color: "var(--ui-color-muted, #64748b)",
              }}
            >
              Review all fields and click Finish to publish this admin
              workspace.
            </Box>

            <Box
              style={{
                border: "1px solid var(--ui-color-border, #e2e8f0)",
                borderRadius: 12,
                padding: 12,
                display: "grid",
                gap: 8,
              }}
            >
              <Box>
                <strong>Organization:</strong> {orgName || "—"}
              </Box>
              <Box>
                <strong>Primary module:</strong> {module || "—"}
              </Box>
              <Box>
                <strong>Retention policy:</strong> {policy || "—"}
              </Box>
            </Box>
          </Box>
        </Wizard.Step>
      </Wizard>

      <Flex
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <Box
          style={{
            fontSize: "var(--ui-font-size-md, 14px)",
            color: "var(--ui-color-muted, #64748b)",
          }}
        >
          Current value: <strong>{value}</strong> • Event:{" "}
          <strong>{lastEvent}</strong>
        </Box>
        <Flex style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setValue("org");
              setLastEvent("reset");
            }}
          >
            Reset
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setValue("modules")}
          >
            Go modules
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (canReview) setValue("review");
              else setLastEvent("blocked:review");
            }}
          >
            Jump review
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

EnterpriseOnboarding.args = {
  linear: true,
  keepMounted: false,
  variant: "glass",
  orientation: "horizontal",
  density: "default",
  shape: "rounded",
  showProgress: true,
  busy: false,
};

export const VerticalClinicalChecklist = () => {
  const [value, setValue] = React.useState("triage");

  return (
    <Box style={{ maxWidth: 340 }}>
      <Wizard
        value={value}
        onChange={(detail) => setValue(detail.value)}
        orientation="vertical"
        linear
        variant="soft"
        density="compact"
        title="Clinical Intake"
        description="Guided patient onboarding checklist"
        finishLabel="Complete intake"
      >
        <Wizard.Step
          value="register"
          title="Registration"
          description="Identity and insurance"
          state="success"
        >
          <Box style={{ fontSize: "13px" }}>Registration data captured.</Box>
        </Wizard.Step>
        <Wizard.Step
          value="triage"
          title="Triage"
          description="Vitals and severity"
          state="warning"
        >
          <Box style={{ fontSize: "13px" }}>Vitals pending manual review.</Box>
        </Wizard.Step>
        <Wizard.Step
          value="doctor"
          title="Doctor"
          description="Assign physician"
        >
          <Box style={{ fontSize: "13px" }}>Physician assignment queued.</Box>
        </Wizard.Step>
        <Wizard.Step
          value="admit"
          title="Admission"
          description="Finalize care plan"
          optional
        >
          <Box style={{ fontSize: "13px" }}>Optional for outpatient cases.</Box>
        </Wizard.Step>
      </Wizard>
    </Box>
  );
};

export const ContrastReview = () => {
  const [value, setValue] = React.useState("2");

  return (
    <Box variant="contrast" p="12px" radius="lg" style={{ maxWidth: 920 }}>
      <Wizard
        value={value}
        onChange={(detail) => setValue(detail.value)}
        variant="contrast"
        linear
        title="Deployment Control"
        description="Secure release workflow"
      >
        <Wizard.Step
          value="1"
          title="Data import"
          description="Source mapping"
          state="success"
        >
          <Box style={{ fontSize: "var(--ui-font-size-md, 14px)" }}>
            Import source selected.
          </Box>
        </Wizard.Step>
        <Wizard.Step
          value="2"
          title="Schema"
          description="Validate entities"
          state="complete"
        >
          <Box style={{ fontSize: "var(--ui-font-size-md, 14px)" }}>
            Schema validation in progress.
          </Box>
        </Wizard.Step>
        <Wizard.Step
          value="3"
          title="Permissions"
          description="RBAC rules"
          state="error"
        >
          <Box style={{ fontSize: "var(--ui-font-size-md, 14px)" }}>
            Permissions policy conflict detected.
          </Box>
        </Wizard.Step>
      </Wizard>
    </Box>
  );
};

export const KeepMountedPanels = () => {
  const [value, setValue] = React.useState("profile");
  const [notes, setNotes] = React.useState(
    "This draft should stay when panels are hidden.",
  );

  return (
    <Box style={{ maxWidth: 820, display: "grid", gap: 12 }}>
      <Wizard
        value={value}
        onChange={(detail) => setValue(detail.value)}
        keepMounted
        title="Persistent Panels"
        description="Demonstrates panel state preservation when switching steps."
        variant="default"
      >
        <Wizard.Step
          value="profile"
          title="Profile"
          description="Basic information"
        >
          <Field label="Workspace label" htmlFor="wizard-keep-profile">
            <Input id="wizard-keep-profile" defaultValue="Acme Workspace" />
          </Field>
        </Wizard.Step>

        <Wizard.Step value="notes" title="Notes" description="Draft content">
          <Field label="Notes" htmlFor="wizard-keep-notes">
            <Textarea
              id="wizard-keep-notes"
              rows={4}
              value={notes}
              onChange={(event: any) => setNotes(event?.target?.value ?? "")}
            />
          </Field>
        </Wizard.Step>

        <Wizard.Step
          value="review"
          title="Review"
          description="Persistent check"
        >
          <Box
            style={{
              fontSize: "14px",
              color: "var(--ui-color-muted, #64748b)",
            }}
          >
            Current draft note:
          </Box>
          <Box
            style={{
              border: "1px solid var(--ui-color-border, #e2e8f0)",
              borderRadius: 12,
              padding: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            {notes}
          </Box>
        </Wizard.Step>
      </Wizard>
    </Box>
  );
};

export const KeepMountedWithState = () => {
  const [value, setValue] = React.useState("account");
  const [notes, setNotes] = React.useState("Initial draft note");

  return (
    <Box style={{ maxWidth: 820, display: "grid", gap: 12 }}>
      <Wizard
        value={value}
        onChange={(detail) => setValue(detail.value)}
        keepMounted
        variant="glass"
        title="Keep Mounted Demo"
        description="Switch between steps and confirm local state is preserved."
      >
        <Wizard.Step value="account" title="Account" description="Basic setup">
          <Field label="Workspace name" htmlFor="wm-name">
            <Input id="wm-name" defaultValue="Northstar Workspace" />
          </Field>
        </Wizard.Step>

        <Wizard.Step value="notes" title="Notes" description="Stateful content">
          <Field label="Notes" htmlFor="wm-notes">
            <Textarea
              id="wm-notes"
              rows={4}
              value={notes}
              onChange={(event: any) => setNotes(event?.target?.value ?? "")}
            />
          </Field>
        </Wizard.Step>

        <Wizard.Step value="review" title="Review" description="State check">
          <Box style={{ whiteSpace: "pre-wrap" }}>{notes}</Box>
        </Wizard.Step>
      </Wizard>
    </Box>
  );
};
export const EmptyState = () => (
  <Box style={{ maxWidth: 700 }}>
    <Wizard
      title="New Flow"
      description="No steps attached yet."
      emptyLabel="Add <Wizard.Step> panels to initialize this wizard."
    />
  </Box>
);

export const EnterpriseValidatedLazyMount = () => {
  const [value, setValue] = React.useState("account");
  const [org, setOrg] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [eventLabel, setEventLabel] = React.useState("idle");

  const isAccountValid = org.trim().length >= 3 && email.trim().includes("@");

  return (
    <Box style={{ maxWidth: 920, display: "grid", gap: 12 }}>
      <Wizard
        value={value}
        onChange={(detail) => {
          setValue(detail.value);
          setEventLabel(`change:${detail.value}`);
        }}
        onBlockedNext={(detail) => {
          setEventLabel(`blocked:${detail.reason}`);
        }}
        onBeforeChange={(detail) => {
          if (
            detail.currentValue === "account" &&
            detail.nextValue === "details" &&
            !isAccountValid
          ) {
            return false;
          }
          return true;
        }}
        linear
        keepMounted
        lazyMount
        variant="glass"
        showProgress
        title="Enterprise Onboarding"
        description="Validation, blocked transitions, lazy mount, and preserved state."
      >
        <Wizard.Step
          value="account"
          title="Account"
          description="Required fields"
          invalid={!isAccountValid}
          state={isAccountValid ? "success" : "warning"}
        >
          <Box style={{ display: "grid", gap: 12 }}>
            <Field label="Organization name" htmlFor="lazy-org" required>
              <Input
                id="lazy-org"
                value={org}
                onChange={(e: any) => setOrg(e?.target?.value ?? "")}
                placeholder="Northstar Health"
              />
            </Field>

            <Field label="Admin email" htmlFor="lazy-email" required>
              <Input
                id="lazy-email"
                value={email}
                onChange={(e: any) => setEmail(e?.target?.value ?? "")}
                placeholder="admin@northstar.com"
              />
            </Field>
          </Box>
        </Wizard.Step>

        <Wizard.Step value="details" title="Details" description="Large form">
          <Field label="Implementation notes" htmlFor="lazy-notes">
            <Textarea
              id="lazy-notes"
              rows={5}
              value={notes}
              onChange={(e: any) => setNotes(e?.target?.value ?? "")}
              placeholder="Type here, move away, come back — text remains."
            />
          </Field>
        </Wizard.Step>

        <Wizard.Step
          value="review"
          title="Review"
          description="Final confirmation"
          state="complete"
        >
          <Box style={{ display: "grid", gap: 8 }}>
            <Box>
              <strong>Organization:</strong> {org || "—"}
            </Box>
            <Box>
              <strong>Email:</strong> {email || "—"}
            </Box>
            <Box>
              <strong>Notes:</strong> {notes || "—"}
            </Box>
          </Box>
        </Wizard.Step>
      </Wizard>

      <Box
        style={{ fontSize: "14px", color: "var(--ui-color-muted, #64748b)" }}
      >
        Event: <strong>{eventLabel}</strong>
      </Box>
    </Box>
  );
};
