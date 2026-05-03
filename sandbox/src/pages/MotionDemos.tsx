import React, { useState, useEffect } from 'react';
import { AnimatedBeam, AnimatedList, AnimatedNumber, AnimatedText, Box, Button, Card, Dock, Flex, Grid, Marquee, Orbiter, SpinningText, Badge } from '@editora/ui-react';
import { BellIcon, CloudSyncIcon, FileIcon, FolderIcon, MailIcon, ServerIcon, SparklesIcon, UserIcon } from '@editora/react-icons';

const panel: React.CSSProperties = { border: '1px solid #e2e8f0', borderRadius: 16, padding: 20, background: '#fff', marginBottom: 20 };
const h2: React.CSSProperties = { fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#0f172a' };
const h3: React.CSSProperties = { fontSize: 15, fontWeight: 650, marginBottom: 12, color: '#334155' };

function LogoGlyph({ icon: Icon, color }: { icon: any; color: string }) {
  return (
    <Box style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', borderRadius: '999px', background: 'rgba(255,255,255,0.9)', boxShadow: 'inset 0 0 0 1px rgba(148,163,184,0.2)' }}>
      <Icon size="1em" color={color} />
    </Box>
  );
}

function HubGlyph() {
  return (
    <Box style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#0f172a' }}>
      <SparklesIcon size="1em" />
      <span style={{ fontSize: '0.3em', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>Hub</span>
    </Box>
  );
}

export function AnimatedBeamDemo() {
  return (
    <div>
      <h2 style={h2}>AnimatedBeam</h2>
      <div style={panel}>
        <h3 style={h3}>Integration Hub</h3>
        <Box style={{ padding: 20, borderRadius: 16, background: 'radial-gradient(circle at top left, rgba(59,130,246,0.08), transparent 34%), linear-gradient(180deg,#fcfdff,#f4f8ff)', border: '1px solid rgba(148,163,184,0.18)' }}>
          <AnimatedBeam variant="minimal" tone="brand" size="md" columns={3} rows={5} padding={20} columnGap={180} rowGap={56} minHeight={380} nodeSize={64} hubSize={84} duration={2400} beamWidth={4} trailWidth={3} beamFactor={0.2} colorStart="#8b5cf6" colorEnd="#fb923c" trailColor="rgba(148,163,184,0.2)" glow path>
            <AnimatedBeam.Node nodeId="user" column={1} row={3}><LogoGlyph icon={UserIcon} color="#0f172a" /></AnimatedBeam.Node>
            <AnimatedBeam.Hub nodeId="hub" column={2} row={3}><HubGlyph /></AnimatedBeam.Hub>
            <AnimatedBeam.Node nodeId="drive" column={3} row={1}><LogoGlyph icon={FolderIcon} color="#16a34a" /></AnimatedBeam.Node>
            <AnimatedBeam.Node nodeId="docs" column={3} row={2}><LogoGlyph icon={FileIcon} color="#2563eb" /></AnimatedBeam.Node>
            <AnimatedBeam.Node nodeId="alerts" column={3} row={3}><LogoGlyph icon={BellIcon} color="#22c55e" /></AnimatedBeam.Node>
            <AnimatedBeam.Node nodeId="mail" column={3} row={4}><LogoGlyph icon={MailIcon} color="#a855f7" /></AnimatedBeam.Node>
            <AnimatedBeam.Node nodeId="storage" column={3} row={5}><LogoGlyph icon={CloudSyncIcon} color="#0f172a" /></AnimatedBeam.Node>
            <AnimatedBeam.Connection from="user" to="hub" curve="straight" />
            <AnimatedBeam.Connection from="hub" to="drive" curve="arc" />
            <AnimatedBeam.Connection from="hub" to="docs" curve="soft" />
            <AnimatedBeam.Connection from="hub" to="alerts" curve="straight" />
            <AnimatedBeam.Connection from="hub" to="mail" curve="soft" reverse />
            <AnimatedBeam.Connection from="hub" to="storage" curve="arc" reverse />
          </AnimatedBeam>
        </Box>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variant Comparison</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
          {([['surface','brand'],['soft','success'],['glass','info'],['contrast','warning']] as const).map(([variant, tone]) => (
            <Card key={variant} variant="surface" radius={14} style={{ padding: 12 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 8 }}>{variant}</div>
              <AnimatedBeam variant={variant as any} tone={tone as any} columns={3} rows={3} minHeight={180} columnGap={72} rowGap={32} nodeSize={44} hubSize={56} beamWidth={3} trailWidth={2} duration={2000} path glow autoFit>
                <AnimatedBeam.Node nodeId={`s-${variant}`} column={1} row={2}><LogoGlyph icon={UserIcon} color="#0f172a" /></AnimatedBeam.Node>
                <AnimatedBeam.Hub nodeId={`h-${variant}`} column={2} row={2}><Box style={{ width:'100%',height:'100%',display:'grid',placeItems:'center' }}><SparklesIcon size="1em" /></Box></AnimatedBeam.Hub>
                <AnimatedBeam.Node nodeId={`t-${variant}`} column={3} row={2}><LogoGlyph icon={ServerIcon} color="#0f172a" /></AnimatedBeam.Node>
                <AnimatedBeam.Connection from={`s-${variant}`} to={`h-${variant}`} curve="soft" />
                <AnimatedBeam.Connection from={`h-${variant}`} to={`t-${variant}`} curve="soft" />
              </AnimatedBeam>
            </Card>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function AnimatedListDemo() {
  return (
    <div>
      <h2 style={h2}>AnimatedList</h2>
      <div style={panel}>
        <h3 style={h3}>Default</h3>
        <AnimatedList style={{ maxWidth: 480 }}>
          <div>Deployment to eu-west completed successfully</div>
          <div>Security scan passed — no vulnerabilities found</div>
          <div>Cache invalidated across 3 edge nodes</div>
          <div>Backup snapshot created at 03:00 UTC</div>
          <div>Webhook delivery confirmed for all subscribers</div>
        </AnimatedList>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))' }}>
          {(['surface','soft','outline'] as const).map((v) => (
            <div key={v}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>{v}</div>
              <AnimatedList variant={v} tone="info" radius={10}>
                <div>Item alpha</div>
                <div>Item beta</div>
                <div>Item gamma</div>
              </AnimatedList>
            </div>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function AnimatedNumberDemo() {
  const [value, setValue] = useState(4200);

  return (
    <div>
      <h2 style={h2}>AnimatedNumber</h2>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>
          {([['odometer','#f8fafc','#0f172a'],['inline','#fff','#0f172a'],['digital','#020617','rgba(226,232,240,0.9)'],['analog','#f8f4e8','rgba(63,47,30,0.85)']] as const).map(([variant, bg, color]) => (
            <Box key={variant} style={{ padding: 16, borderRadius: 14, background: bg, border: '1px solid rgba(148,163,184,0.18)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color, opacity: 0.65, marginBottom: 6 }}>{variant}</div>
              <AnimatedNumber value={12845} variant={variant as any} size="lg" animate animateOnMount duration={1200} theme={variant === 'digital' ? 'dark' : undefined} />
            </Box>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Interactive</h3>
        <Flex style={{ gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          <Button onClick={() => setValue((v) => v - 125)}>− 125</Button>
          <AnimatedNumber value={value} variant="inline" format="currency" currency="USD" size="lg" animate fractionDigits={0} />
          <Button onClick={() => setValue((v) => v + 125)}>+ 125</Button>
        </Flex>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))' }}>
          <Box><div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>Odometer</div><AnimatedNumber value={value} variant="odometer" animate /></Box>
          <Box><div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>Digital</div><AnimatedNumber value={value} variant="digital" theme="dark" animate animation="linear" duration={480} /></Box>
          <Box><div style={{ fontSize: 11, opacity: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>Analog</div><AnimatedNumber value={value} variant="analog" animate animation="ease-out" duration={1300} /></Box>
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Formatting</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))' }}>
          <Box><div style={{ fontWeight: 600, marginBottom: 6 }}>Currency</div><AnimatedNumber value={24580.7} variant="odometer" format="currency" currency="USD" locale="en-US" fractionDigits={2} /></Box>
          <Box><div style={{ fontWeight: 600, marginBottom: 6 }}>Percent</div><AnimatedNumber value={0.342} variant="inline" format="percent" fractionDigits={1} tone="success" /></Box>
          <Box><div style={{ fontWeight: 600, marginBottom: 6 }}>Compact</div><AnimatedNumber value={1245000} variant="digital" notation="compact" tone="brand" animation="linear" duration={500} /></Box>
        </Grid>
      </div>
    </div>
  );
}

export function AnimatedTextDemo() {
  return (
    <div>
      <h2 style={h2}>AnimatedText</h2>
      <div style={panel}>
        <h3 style={h3}>Effect Gallery</h3>
        <Grid style={{ gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>
          {(['fade-up','fade-down','slide-left','blur','blur-up','pop','wave','zoom-in','rotate-in','flip-up','glow','typewriter'] as const).map((effect, i) => (
            <Card key={effect} variant={i % 2 === 0 ? 'surface' : 'soft'} tone="brand" radius={14} style={{ padding: 14, minHeight: 100 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', marginBottom: 8 }}>{effect}</div>
              <AnimatedText effect={effect} split={effect === 'typewriter' ? 'chars' : 'words'} variant="minimal" size="sm">{`${effect} animation`}</AnimatedText>
            </Card>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Gradient Hero</h3>
        <AnimatedText effect="blur" variant="gradient" size="xl">Bring motion to system headlines without sacrificing readability.</AnimatedText>
      </div>
    </div>
  );
}

export function MarqueeDemo() {
  return (
    <div>
      <h2 style={h2}>Marquee</h2>
      <div style={panel}>
        <h3 style={h3}>Horizontal</h3>
        <Marquee style={{ gap: 16 }}>
          {['React','TypeScript','Vite','Tailwind','Radix','Storybook','Vitest','Rollup','ESBuild','SWC'].map((t) => (
            <Badge key={t} variant="soft" tone="brand" style={{ marginRight: 8 }}>{t}</Badge>
          ))}
        </Marquee>
      </div>
      <div style={panel}>
        <h3 style={h3}>Reverse</h3>
        <Marquee reverse style={{ gap: 16 }}>
          {['Accordion','Alert','Button','Card','Dialog','Drawer','Input','Select','Tabs','Tree'].map((t) => (
            <Badge key={t} variant="soft" tone="info" style={{ marginRight: 8 }}>{t}</Badge>
          ))}
        </Marquee>
      </div>
    </div>
  );
}

export function NumberTickerDemo() {
  return (
    <div>
      <h2 style={h2}>NumberTicker</h2>
      <div style={panel}>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))' }}>
          {[1000, 25000, 99.9, 1234567].map((v) => (
            <Box key={v} style={{ padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>Value</div>
              <AnimatedNumber value={v} variant="inline" size="lg" animate animateOnMount />
            </Box>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function OrbiterDemo() {
  return (
    <div>
      <h2 style={h2}>Orbiter</h2>
      <div style={panel}>
        <h3 style={h3}>Default — items orbit a center hub</h3>
        <Flex style={{ justifyContent: 'center', padding: 40 }}>
          <Orbiter size="md" duration={8} pauseOnHover>
            <Orbiter.Center>
              <Box style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                <SparklesIcon size={28} />
              </Box>
            </Orbiter.Center>
            {['React', 'TS', 'Vite', 'CSS', 'Node', 'Git'].map((label) => (
              <Orbiter.Item key={label}>
                <Box style={{ padding: '4px 10px', borderRadius: 999, background: '#e0e7ff', fontSize: 12, fontWeight: 600, color: '#2563eb', whiteSpace: 'nowrap' }}>
                  {label}
                </Box>
              </Orbiter.Item>
            ))}
          </Orbiter>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))' }}>
          {(['surface', 'soft', 'glass', 'contrast'] as const).map((v) => (
            <Box key={v} style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
              <Orbiter variant={v} size="sm" duration={6} pauseOnHover>
                <Orbiter.Center>
                  <Box style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{v}</Box>
                </Orbiter.Center>
                {['A', 'B', 'C', 'D'].map((l) => (
                  <Orbiter.Item key={l}>
                    <Box style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0e7ff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: '#2563eb' }}>{l}</Box>
                  </Orbiter.Item>
                ))}
              </Orbiter>
            </Box>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function SpinningTextDemo() {
  return (
    <div>
      <h2 style={h2}>SpinningText</h2>
      <div style={panel}>
        <h3 style={h3}>Default</h3>
        <Flex style={{ justifyContent: 'center', padding: 40 }}>
          <SpinningText duration={8}>
            Editora · Rich Text · Open Source · Free ·{' '}
          </SpinningText>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))' }}>
          {(['surface', 'soft', 'solid', 'contrast'] as const).map((v) => (
            <Flex key={v} style={{ justifyContent: 'center', padding: 20 }}>
              <SpinningText variant={v} tone="brand" size="sm" duration={6}>
                {v} · spinning ·{' '}
              </SpinningText>
            </Flex>
          ))}
        </Grid>
      </div>
    </div>
  );
}

export function DockDemo() {
  return (
    <div>
      <h2 style={h2}>Dock</h2>
      <div style={panel}>
        <h3 style={h3}>Horizontal (default)</h3>
        <Flex style={{ justifyContent: 'center', padding: '20px 0' }}>
          <Dock labelMode="hover" magnification={1.5} size="md">
            <Dock.Item label="Home" icon={<span>🏠</span>} />
            <Dock.Item label="Search" icon={<span>🔍</span>} />
            <Dock.Item label="Notifications" icon={<span>🔔</span>} badge={<span>3</span>} />
            <Dock.Item label="Messages" icon={<span>💬</span>} />
            <Dock.Item label="Settings" icon={<span>⚙️</span>} />
          </Dock>
        </Flex>
      </div>
      <div style={panel}>
        <h3 style={h3}>Variants</h3>
        <Grid style={{ gap: 16 }}>
          {(['surface', 'soft', 'glass', 'contrast'] as const).map((v) => (
            <div key={v}>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', fontWeight: 600 }}>{v}</div>
              <Flex style={{ justifyContent: 'center' }}>
                <Dock variant={v} labelMode="always" size="sm">
                  <Dock.Item label="Home" icon={<span>🏠</span>} active />
                  <Dock.Item label="Files" icon={<span>📁</span>} />
                  <Dock.Item label="Settings" icon={<span>⚙️</span>} />
                </Dock>
              </Flex>
            </div>
          ))}
        </Grid>
      </div>
      <div style={panel}>
        <h3 style={h3}>Vertical</h3>
        <Flex style={{ justifyContent: 'center', padding: '20px 0' }}>
          <Dock orientation="vertical" labelMode="hover" size="md">
            <Dock.Item label="Dashboard" icon={<span>📊</span>} active />
            <Dock.Item label="Projects" icon={<span>📂</span>} />
            <Dock.Item label="Team" icon={<span>👥</span>} />
            <Dock.Item label="Analytics" icon={<span>📈</span>} />
            <Dock.Item label="Settings" icon={<span>⚙️</span>} />
          </Dock>
        </Flex>
      </div>
    </div>
  );
}
