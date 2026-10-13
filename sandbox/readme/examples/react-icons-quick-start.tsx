import { BellIcon, CheckIcon, ChartPieIcon, Icon, IconProvider, SearchIcon, SettingsIcon } from '@editora/react-icons';

const button = { display: 'grid', placeItems: 'center', width: 36, height: 36, padding: 0, border: '1px solid #d0d7de', borderRadius: 8, background: '#fff', color: '#24292f' };

export default function App() {
  return (
    <IconProvider value={{ size: 18 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {/* A labelled button: the icon in it is decorative, so it needs no name of its own. */}
        <button type="button" aria-label="Search" style={button}>
          <SearchIcon />
        </button>
        <button type="button" aria-label="Notifications" style={button}>
          <BellIcon variant="solid" color="#2563eb" />
        </button>
        <button type="button" aria-label="Settings" style={button}>
          <SettingsIcon />
        </button>
      </div>

      {/* An icon that stands alone gets a name. */}
      <p style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1a7f37' }}>
        <CheckIcon ariaLabel="Success" /> Changes saved
      </p>

      {/* Any icon by name, and the duotone variant of the few icons that have one. */}
      <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name="shield" variant="duotone" color="#2563eb" secondaryColor="#93c5fd" title="Protected" />
        <ChartPieIcon variant="duotone" color="#2563eb" secondaryColor="#93c5fd" size={24} />
      </p>
    </IconProvider>
  );
}
