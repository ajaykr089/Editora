'use client';

import React from 'react';
import {
  Box,
  Calendar,
  DateField,
  DatePicker,
  DateRangePicker,
  DateRangeTimePicker,
  DateTimePicker,
  DirectionProvider,
  Grid,
  TimeField,
  TimePicker,
} from '@editora/ui-react/client';
import { ShowcaseCard, ShowcaseShell, eyebrowStyle, scrollerStyle } from '../showcase/shared';

const startAlignedScrollerStyle: React.CSSProperties = {
  ...scrollerStyle,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
};

export default function DatesPage() {
  const [calendarDate, setCalendarDate] = React.useState('2026-03-27');
  const [dateFieldValue, setDateFieldValue] = React.useState('2026-03-27');
  const [timeFieldValue, setTimeFieldValue] = React.useState('09:30');
  const [datePickerValue, setDatePickerValue] = React.useState('2026-03-28');
  const [dateRangeValue, setDateRangeValue] = React.useState('{"start":"2026-03-29","end":"2026-04-01"}');
  const [dateTimeValue, setDateTimeValue] = React.useState('2026-03-27T14:30');
  const [dateRangeTimeValue, setDateRangeTimeValue] = React.useState('{"start":"2026-03-27T09:00","end":"2026-03-27T17:30"}');
  const [timePickerValue, setTimePickerValue] = React.useState('14:45');

  return (
    <DirectionProvider dir="ltr">
      <ShowcaseShell
        currentHref="/dates"
        eyebrow="Date & Time"
        title="Calendars and picker wrappers"
        description="This route exists specifically to keep the larger calendar and picker widgets from crowding the rest of the demo. Each wrapper sits inside a scroll-safe surface."
      >
        <Grid
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 18,
            justifyContent: 'start',
            justifyItems: 'stretch',
            alignItems: 'start',
          }}
        >
          <ShowcaseCard
            eyebrow="Calendar"
            title="Calendar, DateField, and TimeField"
            description="A compact route for the calendar primitives and the smaller field-style wrappers."
          >
            <Box style={{ display: 'grid', gap: 14 }}>
              <Box style={startAlignedScrollerStyle}>
                <Calendar
                  value={calendarDate}
                  size="sm"
                  style={{ display: 'block', minWidth: 320 }}
                  events={[
                    { date: '2026-03-27', title: 'Fixture review', tone: 'info' },
                    { date: '2026-04-02', title: 'Launch check', tone: 'success' },
                  ]}
                  onValueChange={setCalendarDate}
                />
              </Box>

              <Grid style={{ display: 'grid', gap: 12, justifyItems: 'stretch', alignItems: 'start' }}>
                <Box style={eyebrowStyle}>Field variants</Box>
                <DateField value={dateFieldValue} label="DateField" onValueChange={(next) => setDateFieldValue(next ?? '')} />
                <TimeField value={timeFieldValue} label="TimeField" onValueChange={(next) => setTimeFieldValue(next ?? '')} />
              </Grid>
            </Box>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Pickers"
            title="Date and time picker surfaces"
            description="Each picker stays inside its own card and uses inline mode so you can inspect the full UI immediately."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={startAlignedScrollerStyle}>
                <DatePicker
                  value={datePickerValue}
                  label="DatePicker"
                  mode="inline"
                  size="sm"
                  defaultOpen
                  showFooter
                  style={{ display: 'block', minWidth: 320 }}
                  onValueChange={(next) => setDatePickerValue(next ?? '')}
                />
              </Box>

              <Box style={startAlignedScrollerStyle}>
                <TimePicker
                  value={timePickerValue}
                  label="TimePicker"
                  mode="inline"
                  defaultOpen
                  style={{ display: 'block', minWidth: 320 }}
                  onValueChange={(next) => setTimePickerValue(next ?? '')}
                />
              </Box>
            </Grid>
          </ShowcaseCard>

          <ShowcaseCard
            eyebrow="Ranges"
            title="Range and date-time pickers"
            description="The more spacious picker wrappers get their own route card with explicit min widths so they remain readable."
          >
            <Grid style={{ display: 'grid', gap: 16, justifyItems: 'stretch', alignItems: 'start' }}>
              <Box style={startAlignedScrollerStyle}>
                <DateRangePicker
                  value={dateRangeValue}
                  label="DateRangePicker"
                  mode="inline"
                  size="sm"
                  defaultOpen
                  showFooter
                  style={{ display: 'block', minWidth: 340 }}
                  onValueChange={(next) => setDateRangeValue(next ?? '')}
                />
              </Box>

              <Box style={startAlignedScrollerStyle}>
                <DateTimePicker
                  value={dateTimeValue}
                  label="DateTimePicker"
                  mode="inline"
                  size="sm"
                  defaultOpen
                  showFooter
                  style={{ display: 'block', minWidth: 360 }}
                  onValueChange={(next) => setDateTimeValue(next ?? '')}
                />
              </Box>

              <Box style={startAlignedScrollerStyle}>
                <DateRangeTimePicker
                  value={dateRangeTimeValue}
                  label="DateRangeTimePicker"
                  mode="inline"
                  size="sm"
                  defaultOpen
                  showFooter
                  style={{ display: 'block', minWidth: 360 }}
                  onValueChange={(next) => setDateRangeTimeValue(next ?? '')}
                />
              </Box>
            </Grid>
          </ShowcaseCard>
        </Grid>
      </ShowcaseShell>
    </DirectionProvider>
  );
}
