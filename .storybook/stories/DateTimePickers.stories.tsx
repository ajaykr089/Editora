import React from 'react';
import {
  Badge,
  Box,
  Button,
  DatePicker,
  DateRangePicker,
  DateRangeTimePicker,
  DateTimePicker,
  Grid,
  TimePicker
} from '@editora/ui-react';

export default {
  title: 'UI/Date Time Pickers'
};

function useForcedMobileSheet(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;
    const original = window.matchMedia;
    const forced = ((query: string) => {
      if (query.includes('(max-width: 639px)')) {
        return {
          matches: true,
          media: query,
          onchange: null,
          addListener() {},
          removeListener() {},
          addEventListener() {},
          removeEventListener() {},
          dispatchEvent() {
            return false;
          }
        } as MediaQueryList;
      }
      return original.call(window, query);
    }) as typeof window.matchMedia;

    window.matchMedia = forced;
    return () => {
      window.matchMedia = original;
    };
  }, [enabled]);
}

export const SingleDate = () => {
  const [value, setValue] = React.useState<string | null>('2026-02-23');

  return (
    <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="purple">Single date picker</Badge>
        <DatePicker
          // label="Admission date"
          hint="Accepts ISO and locale-like input."
          value={value || undefined}
          min="2026-01-01"
          max="2026-12-31"
          onValueChange={(next:any) => setValue(next)}
          clearable
          bare
          showFooter={false}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || "null"}
        </Box>
      </Grid>
    </Box>
  );
};

export const DatePickerEnterpriseStates = () => {
  const [value, setValue] = React.useState<string | null>('2026-08-14');
  const [invalidReason, setInvalidReason] = React.useState('');

  return (
    <Grid gap="12px" style={{ maxWidth: 960 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="purple">Enterprise date picker states</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Includes loading/success visuals, square + soft shape variants, and reversed min/max safety.
          </Box>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Default</Badge>
            <DatePicker
              label="Procedure date"
              hint="Normal popover interaction"
              value={value || undefined}
              clearable
              onValueChange={(next) => setValue(next)}
              onInvalid={(detail) => setInvalidReason(detail.reason)}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Loading</Badge>
            <DatePicker
              label="Syncing schedule"
              state="loading"
              hint="Interaction is blocked while loading."
              value={value || undefined}
              shape="square"
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Success + Soft</Badge>
            <DatePicker
              label="Confirmed date"
              state="success"
              hint="Soft corners for dashboard surfaces."
              value={value || undefined}
              shape="soft"
            />
          </Grid>
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="danger">Edge case: reversed bounds</Badge>
          <DatePicker
            label="Auto-corrected bounds"
            hint="`min` is intentionally later than `max`; component normalizes internally."
            min="2026-12-31"
            max="2026-01-01"
            defaultValue="2026-06-15"
            clearable
          />
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '12px' }}>
            Last invalid reason: {invalidReason || 'none'}
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
};

export const DateRange = () => {
  const [value, setValue] = React.useState('{"start":"2026-02-10","end":"2026-02-18"}');

  return (
    <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="success">Date range picker</Badge>
        <DateRangePicker
          label="Billing cycle"
          hint="Choose a range for reports."
          value={value}
          rangeVariant="two-fields"
          closeOnSelect={false}
          onValueChange={(next) => setValue(next || "")}
          bare
          showFooter={false}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || "null"}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateRangeEnterpriseStates = () => {
  const [value, setValue] = React.useState('{"start":"2026-09-01","end":"2026-09-07"}');
  const [invalidReason, setInvalidReason] = React.useState('');

  return (
    <Grid gap="12px" style={{ maxWidth: 980 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="purple">Enterprise date range states</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Covers loading/success states, single-field parsing, and reversed min/max normalization.
          </Box>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Two-field default</Badge>
            <DateRangePicker
              label="Coverage window"
              hint="Operational range for claims analysis."
              value={value}
              onValueChange={(next) => setValue(next || '')}
              onInvalid={(detail) => setInvalidReason(detail.reason)}
              clearable
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Loading + square</Badge>
            <DateRangePicker
              label="Syncing date range"
              hint="Inputs/actions are blocked during background sync."
              value={value}
              state="loading"
              shape="square"
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Single-field + soft</Badge>
            <DateRangePicker
              label="Review range"
              hint="Single-field parser accepts: `Sep 1 2026 — Sep 7 2026`."
              value={value}
              rangeVariant="single-field"
              state="success"
              shape="soft"
            />
          </Grid>
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="danger">Edge case: reversed bounds + strict rules</Badge>
          <DateRangePicker
            label="Strict range"
            hint="`min` is later than `max`, and same-day/partial ranges are disabled."
            min="2026-12-31"
            max="2026-01-01"
            defaultValue='{"start":"2026-06-15","end":"2026-06-20"}'
            allowPartial={false}
            allowSameDay={false}
            clearable
          />
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '12px' }}>
            Last invalid reason: {invalidReason || 'none'}
          </Box>
        </Grid>
      </Box>
    </Grid>
  );
};

export const TimeOnly = () => {
  const [value, setValue] = React.useState<string | null>('09:30');

  return (
    <Box w="min(560px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="warning">Time picker</Badge>
        <TimePicker
          label="Shift start"
          hint="Arrow up/down steps by configured minutes."
          value={value || undefined}
          format="24h"
          step={5}
          min="06:00"
          max="23:00"
          onValueChange={(next) => setValue(next)}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateTime = () => {
  const [value, setValue] = React.useState<string | null>('2026-02-23T09:30');

  return (
    <Box w="min(760px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="purple">Date-time picker</Badge>
        <DateTimePicker
          label="Procedure schedule"
          value={value || undefined}
          step={10}
          min="2026-02-01T08:00"
          max="2026-03-15T20:00"
          onValueChange={(next) => setValue(next)}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const DateRangeTime = () => {
  const [value, setValue] = React.useState(
    '{"start":"2026-02-23T09:00","end":"2026-02-23T12:30"}'
  );

  return (
    <Box w="min(860px, 100%)" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="danger">Range date-time picker</Badge>
        <DateRangeTimePicker
          label="Operating room slot"
          hint="Complete range with date and time."
          value={value}
          step={15}
          autoNormalize
          allowPartial={false}
          min="2026-02-01T06:00"
          max="2026-12-31T23:00"
          onValueChange={(next) => setValue(next || '')}
        />
        <Box bg="surface" p="10px" radius="lg">
          Current value: {value || 'null'}
        </Box>
      </Grid>
    </Box>
  );
};

export const BareAndFooterVariants = () => {
  const [singleValue, setSingleValue] = React.useState<string | null>('2026-04-10');
  const [rangeValue, setRangeValue] = React.useState('{"start":"2026-04-08","end":"2026-04-14"}');
  const [dateTimeValue, setDateTimeValue] = React.useState<string | null>('2026-04-10T10:30');
  const [rangeTimeValue, setRangeTimeValue] = React.useState(
    '{"start":"2026-04-10T08:00","end":"2026-04-10T12:00"}'
  );

  return (
    <Grid gap="12px" style={{ maxWidth: 1100 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="8px">
          <Badge tone="purple">`bare` + `showFooter` configuration</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Use <code>bare</code> for flat/no-panel chrome and <code>showFooter</code> to control actions.
            Calendar-only inline layouts use <code>showFooter=&#123;false&#125;</code>.
          </Box>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="info">Date picker: calendar-only</Badge>
            <DatePicker
              mode="inline"
              bare
              showFooter={false}
              label="Flat admission calendar"
              value={singleValue || undefined}
              onValueChange={(next) => setSingleValue(next)}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="success">Range picker: calendar-only</Badge>
            <DateRangePicker
              mode="inline"
              bare
              showFooter={false}
              label="Flat reporting range"
              value={rangeValue}
              onValueChange={(next) => setRangeValue(next || '')}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="warning">Date-time: flat with actions</Badge>
            <DateTimePicker
              mode="inline"
              bare
              showFooter
              label="Flat schedule editor"
              value={dateTimeValue || undefined}
              step={10}
              onValueChange={(next) => setDateTimeValue(next)}
            />
          </Grid>
        </Box>

        <Box variant="elevated" p="14px" radius="lg">
          <Grid gap="8px">
            <Badge tone="danger">Range date-time: flat + no footer</Badge>
            <DateRangeTimePicker
              mode="inline"
              bare
              showFooter={false}
              label="Flat operating slot"
              value={rangeTimeValue}
              step={15}
              onValueChange={(next) => setRangeTimeValue(next || '')}
            />
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export const Localization = () => {
  const [locale, setLocale] = React.useState<'en-US' | 'zh-CN' | 'fr-FR'>('en-US');
  const [dateValue, setDateValue] = React.useState<string | null>('2026-05-14');
  const [rangeValue, setRangeValue] = React.useState('{"start":"2026-05-10","end":"2026-05-18"}');
  const [timeValue, setTimeValue] = React.useState<string | null>('14:30');
  const [dateTimeValue, setDateTimeValue] = React.useState<string | null>('2026-05-14T14:30');
  const [rangeTimeValue, setRangeTimeValue] = React.useState(
    '{"start":"2026-05-14T09:00","end":"2026-05-14T12:30"}'
  );

  const customFrenchTranslations = JSON.stringify({
    fr: {
      today: 'Aujourd hui (Clinique)',
      apply: 'Valider',
      clear: 'Reinitialiser',
      startTime: 'Debut de service',
      endTime: 'Fin de service'
    }
  });

  const localeOptions: Array<{ value: 'en-US' | 'zh-CN' | 'fr-FR'; label: string }> = [
    { value: 'en-US', label: 'English' },
    { value: 'zh-CN', label: 'Chinese' },
    { value: 'fr-FR', label: 'French' }
  ];

  return (
    <Grid gap="12px" style={{ maxWidth: 1100 }}>
      <Box variant="elevated" p="16px" radius="xl">
        <Grid gap="10px">
          <Badge tone="purple">Localization demo</Badge>
          <Box style={{ color: 'var(--ui-color-muted, #64748b)', fontSize: '14px' }}>
            Built-in localization supports English, Chinese, and French. Switch locale and inspect calendar labels,
            time labels, and action text.
          </Box>
          <Grid style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {localeOptions.map((option) => (
              <Button
                key={option.value}
                size="sm"
                variant={locale === option.value ? undefined : 'secondary'}
                onClick={() => setLocale(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </Grid>
        </Grid>
      </Box>

      <Grid style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
        <Box variant="elevated" p="14px" radius="lg">
          <DatePicker
            label="Admission date"
            locale={locale}
            value={dateValue || undefined}
            onValueChange={(next) => setDateValue(next)}
            clearable
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateRangePicker
            label="Billing range"
            locale={locale}
            value={rangeValue}
            onValueChange={(next) => setRangeValue(next || '')}
            closeOnSelect={false}
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <TimePicker
            label="Shift start"
            locale={locale}
            value={timeValue || undefined}
            onValueChange={(next) => setTimeValue(next)}
            clearable
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateTimePicker
            label="Procedure schedule"
            locale={locale}
            value={dateTimeValue || undefined}
            onValueChange={(next) => setDateTimeValue(next)}
            step={10}
          />
        </Box>
        <Box variant="elevated" p="14px" radius="lg">
          <DateRangeTimePicker
            label="Operating slot"
            locale={locale}
            value={rangeTimeValue}
            onValueChange={(next) => setRangeTimeValue(next || '')}
            step={15}
            closeOnSelect={false}
          />
        </Box>
      </Grid>

      <Box variant="elevated" p="14px" radius="lg">
        <Grid gap="8px">
          <Badge tone="info">Custom translation override (French)</Badge>
          <DateRangeTimePicker
            locale="fr-FR"
            label="Bloc operatoire"
            value='{"start":"2026-05-20T08:00","end":"2026-05-20T11:00"}'
            translations={customFrenchTranslations}
            step={15}
            closeOnSelect={false}
          />
        </Grid>
      </Box>
    </Grid>
  );
};

export const MobileSheetBehavior = () => {
  useForcedMobileSheet(true);
  const [value, setValue] = React.useState<string | null>('2026-02-23');

  return (
    <Box w="360px" variant="elevated" p="14px" radius="xl">
      <Grid gap="10px">
        <Badge tone="purple">Forced mobile sheet preview</Badge>
        <DatePicker
          label="Mobile sheet date picker"
          value={value || undefined}
          onValueChange={(next) => setValue(next)}
          closeOnSelect={false}
          hint="This story forces mobile media query to validate bottom-sheet spacing."
        />
        <DateRangePicker
          label="Mobile range picker"
          value='{"start":"2026-02-20","end":"2026-02-24"}'
          closeOnSelect={false}
          hint="Check footer actions and scroll-lock behavior."
        />
      </Grid>
    </Box>
  );
};
