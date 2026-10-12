import { BellIcon, HeartIcon, IconProvider, StarIcon, useIconContext } from '@editora/react-icons';

// Reads what the nearest IconProvider decided, as an icon would.
function Readout() {
  const { size, color, iconWeight } = useIconContext();
  return <code style={{ font: '12px ui-monospace, monospace', color: '#57606a' }}>size {String(size)}, {color}, weight {iconWeight ?? 'regular'}</code>;
}

const row = { display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0' };

export default function App() {
  return (
    <>
      <IconProvider value={{ size: 28, color: '#24292f' }}>
        <div style={row}>
          <BellIcon /> <StarIcon /> <HeartIcon />
          <Readout />
        </div>

        {/* A nested provider changes what it sets and keeps the rest. */}
        <IconProvider value={{ color: '#2563eb', iconWeight: 'bold' }}>
          <div style={row}>
            <BellIcon /> <StarIcon /> <HeartIcon />
            <Readout />
          </div>
        </IconProvider>
      </IconProvider>

      {/* A prop beats the provider. */}
      <IconProvider value={{ size: 28, color: '#24292f' }}>
        <div style={row}>
          <BellIcon /> <StarIcon color="#d97706" size={40} /> <HeartIcon variant="solid" color="#dc2626" />
        </div>
      </IconProvider>
    </>
  );
}
