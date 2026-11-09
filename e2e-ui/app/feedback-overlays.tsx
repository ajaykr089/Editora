import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@editora/ui-react/ThemeProvider';
import { applyTheme, createThemeTokens } from '@editora/ui-core';
import { Menu } from '@editora/ui-react/Menu';
import { Popover } from '@editora/ui-react/Popover';
import { Tooltip } from '@editora/ui-react/Tooltip';
import { SplitButton } from '@editora/ui-react/SplitButton';
import { ContextMenu } from '@editora/ui-react/ContextMenu';
import { Button } from '@editora/ui-react/Button';
import { PinInput } from '@editora/ui-react/PinInput';
import { Checkbox } from '@editora/ui-react/Checkbox';
import { RadioGroup } from '@editora/ui-react/RadioGroup';
import { Switch } from '@editora/ui-react/Switch';
import { Slider } from '@editora/ui-react/Slider';

// Overlays inside a wrapper with its own theme (applyTheme on the wrapper, as a scoped theme
// does), over a busy background: their panels must be opaque, keep their own border and padding,
// and take the wrapper's colours.
const scopedTheme = createThemeTokens({ colors: { primary: '#7c3aed', surface: '#fdf4ff', background: '#fdf4ff' } as any, surfaces: { panelSolid: '#fdf4ff' } as any });

function App() {
  const [context, setContext] = React.useState(false);
  const scope = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (scope.current) applyTheme(scopedTheme, scope.current);
  }, []);
  return (
    <>
      <div id="scope" ref={scope} className="stripes" style={{ display: 'flex', gap: 16, alignItems: 'start', minHeight: 260 }}>
        <Menu id="menu"><Menu.Trigger><Button>Menu</Button></Menu.Trigger><Menu.Content><Menu.Item>Rename</Menu.Item><Menu.Item>Duplicate</Menu.Item></Menu.Content></Menu>
        <Popover id="popover"><Popover.Trigger><Button>Popover</Button></Popover.Trigger><Popover.Content>Popover body</Popover.Content></Popover>
        <Tooltip id="tooltip" text="Tooltip text"><Button>Tooltip</Button></Tooltip>
        <SplitButton id="split" label="Split" items={[{ value: 'a', label: 'Alpha' }]} />
        <button id="context-open" onClick={() => setContext(true)}>Context</button>
        <ContextMenu id="context" open={context} anchorPoint={{ x: 120, y: 200 }} items={[{ label: 'Alpha' }, { label: 'Beta' }] as any} onClose={() => setContext(false)} />
      </div>
      <div id="controls" style={{ display: 'grid', gap: 12, width: 320, marginTop: 16 }}>
        <PinInput id="pin" length={4} />
        <Checkbox id="checkbox">Checkbox</Checkbox>
        <RadioGroup id="radio" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] as any} />
        <Switch id="switch">Switch</Switch>
        <Slider id="slider" value={30} />
      </div>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<ThemeProvider storageKey=""><App /></ThemeProvider>);
