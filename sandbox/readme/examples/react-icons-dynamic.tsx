import { registerIcon } from '@editora/icons';
import { createIcon, getIconComponent, Icon, type IconName } from '@editora/react-icons';

// Your own icon: register it once, and give it a component if you like.
registerIcon({
  name: 'brand-mark',
  variants: {
    outline: {
      nodes: [
        { tag: 'path', attrs: { d: 'M12 3l8 4.5v9L12 21l-8-4.5v-9z' } },
        { tag: 'path', attrs: { d: 'M12 8v8M8.5 10l7 4' } },
      ],
    },
  },
});
export const BrandIcon = createIcon('brand-mark', 'BrandIcon');

// Names that come from data are typed: a typo is a compile error.
type Item = { label: string; icon: IconName };

const items: Item[] = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Orders', icon: 'order' },
  { label: 'Reports', icon: 'report' },
  { label: 'Settings', icon: 'settings' },
];

// A component looked up by name, for a UI whose icons are configured elsewhere.
function PluginIcon({ name }: { name: IconName }) {
  const Component = getIconComponent(name);
  return <Component size={16} />;
}

export default function App() {
  return (
    <nav style={{ width: 220, font: '14px system-ui, sans-serif', color: '#24292f' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', fontWeight: 600 }}>
        <BrandIcon size={20} color="#2563eb" title="Brand" /> Acme
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item) => (
          <li key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
            <Icon name={item.icon} size={16} />
            {item.label}
          </li>
        ))}
        <li style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
          <PluginIcon name="command" />
          Command palette
        </li>
      </ul>
    </nav>
  );
}
