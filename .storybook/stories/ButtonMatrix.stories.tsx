import React from 'react';
import type { Meta } from '@storybook/react';
import { Button } from '@editora/ui-react';
import type { ThemeTokens } from '@editora/ui-core';
import { createThemeTokens } from '@editora/ui-core';
import { ArrowRightIcon } from '@editora/react-icons';
import { ShowcasePage, ShowcaseSection, showcasePanelStyle } from './storybook-showcase';

const meta: Meta = {
  title: 'UI/Button Matrices',
  parameters: {
    docs: {
      description: {
        component: 'Heavy theme and sizing matrices for button recipes. Kept separate from the main button docs to preserve Storybook performance.'
      }
    }
  }
};

export default meta;

const BUTTON_MATRIX_TABS = [
  { id: 'theme-colors', label: 'Theme colors' },
  { id: 'all-colors', label: 'All colors' },
  { id: 'all-sizes', label: 'All sizes' }
] as const;

type MatrixRecipe = {
  id: string;
  label: string;
  variant: React.ComponentProps<typeof Button>['variant'];
  recipe: React.ComponentProps<typeof Button>['recipe'];
};

function buttonThemeDeclarations(tokens: ThemeTokens) {
  return [
    `--ui-color-primary: ${tokens.colors.primary};`,
    `--ui-color-primary-hover: ${tokens.colors.primaryHover || tokens.colors.primary};`,
    `--ui-color-foreground-on-primary: ${tokens.colors.foregroundOnPrimary || '#ffffff'};`,
    `--ui-color-background: ${tokens.colors.background || '#ffffff'};`,
    `--ui-color-surface: ${tokens.colors.surface || tokens.colors.background || '#ffffff'};`,
    `--ui-color-surface-alt: ${tokens.colors.surfaceAlt || tokens.colors.surface || '#f8fafc'};`,
    `--ui-color-text: ${tokens.colors.text || '#111827'};`,
    `--ui-color-muted: ${tokens.colors.muted || '#64748b'};`,
    `--ui-color-border: ${tokens.colors.border || 'rgba(15,23,42,0.16)'};`,
    `--ui-color-focus-ring: ${tokens.colors.focusRing || tokens.colors.primary};`,
    `--color-panel-solid: ${tokens.surfaces?.panelSolid || tokens.colors.surface || '#ffffff'};`,
    `--color-panel: ${tokens.surfaces?.panel || tokens.surfaces?.panelTranslucent || '#ffffffcc'};`,
    `--shadow-1: ${tokens.shadows?.['1'] || 'none'};`
  ].join(' ');
}

function buttonThemeRule(themeId: string, tokens: ThemeTokens) {
  return `#button-theme-matrix ui-button[data-button-theme="${themeId}"] { ${buttonThemeDeclarations(tokens)} }`;
}

const accentLightTokens = createThemeTokens({}, { accentPalette: 'blue', mode: 'light' });
const accentDarkTokens = createThemeTokens({}, { accentPalette: 'blue', mode: 'dark' });
const grayLightTokens = createThemeTokens({}, { accentPalette: 'gray', mode: 'light' });
const grayDarkTokens = createThemeTokens({}, { accentPalette: 'gray', mode: 'dark' });

function makeStoryPalette(label: string, light: string, dark: string, solidText = '#ffffff') {
  const lightTokens = createThemeTokens({
    colors: {
      primary: light,
      primaryHover: dark,
      foregroundOnPrimary: solidText,
      focusRing: light
    }
  });

  const darkTokens = createThemeTokens(
    {
      colors: {
        primary: dark,
        primaryHover: dark,
        foregroundOnPrimary: '#ffffff',
        focusRing: light,
        background: '#0f172a',
        surface: '#0f172a',
        surfaceAlt: '#111827',
        text: '#f8fafc',
        muted: '#94a3b8',
        border: 'rgba(255,255,255,0.12)'
      },
      surfaces: {
        background: '#0f172a',
        surface: '#111827',
        panel: '#0f172acc',
        panelSolid: '#111827',
        panelTranslucent: '#0f172acc',
        overlay: 'rgba(2, 6, 23, 0.6)'
      }
    },
    { mode: 'dark' }
  );

  return {
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    lightTokens,
    darkTokens
  };
}

const paletteRows = [
  makeStoryPalette('Gray', '#8d8d8d', '#202020'),
  makeStoryPalette('Gold', '#b89b68', '#3f3421'),
  makeStoryPalette('Bronze', '#b48b79', '#4d392f'),
  makeStoryPalette('Brown', '#b88756', '#43362b'),
  makeStoryPalette('Yellow', '#d2ad00', '#5a4b14'),
  makeStoryPalette('Amber', '#f2b600', '#6d4615', '#231b06'),
  makeStoryPalette('Orange', '#f97316', '#6a3318'),
  makeStoryPalette('Tomato', '#ea5a47', '#6a2a1e'),
  makeStoryPalette('Red', '#e5484d', '#6e1f2e'),
  makeStoryPalette('Ruby', '#e54666', '#7a1d4f'),
  makeStoryPalette('Crimson', '#e93d82', '#7d184f'),
  makeStoryPalette('Pink', '#d6409f', '#6f2b68'),
  makeStoryPalette('Plum', '#ab4aba', '#5f2c7a'),
  makeStoryPalette('Purple', '#8e4ec6', '#4d2d7a'),
  makeStoryPalette('Violet', '#6e56cf', '#39307a'),
  makeStoryPalette('Iris', '#5b5bd6', '#29416f'),
  makeStoryPalette('Indigo', '#3e63dd', '#203b7a'),
  makeStoryPalette('Blue', '#0090ff', '#174ea6'),
  makeStoryPalette('Cyan', '#05a2c2', '#145369'),
  makeStoryPalette('Teal', '#12a594', '#0f5c56'),
  makeStoryPalette('Jade', '#29a383', '#1d5b48'),
  makeStoryPalette('Green', '#30a46c', '#1f5a36'),
  makeStoryPalette('Grass', '#46a758', '#365314'),
  makeStoryPalette('Lime', '#9bb300', '#465b18', '#1a1f08'),
  makeStoryPalette('Mint', '#2db8a0', '#105a53'),
  makeStoryPalette('Sky', '#4cc9f0', '#174e67', '#0f2430')
] as const;

const radiusColumns = [
  { id: '0', label: '0', radius: '0' },
  { id: '4', label: '4', radius: '4' },
  { id: '8', label: '8', radius: '8' },
  { id: '12', label: '12', radius: '12' },
  { id: 'full', label: 'Full', radius: 'full' }
] as const;

const sizeRows = [
  { id: '1', label: 'Size 1', scale: '1' as const },
  { id: '2', label: 'Size 2', scale: '2' as const },
  { id: '3', label: 'Size 3', scale: '3' as const },
  { id: '4', label: 'Size 4', scale: '4' as const }
] as const;

const matrixRecipes: MatrixRecipe[] = [
  { id: 'classic', label: 'Classic', variant: 'primary', recipe: 'classic' },
  { id: 'solid', label: 'Solid', variant: 'primary', recipe: 'solid' },
  { id: 'soft', label: 'Soft', variant: 'secondary', recipe: 'soft' },
  { id: 'surface', label: 'Surface', variant: 'secondary', recipe: 'surface' },
  { id: 'outline', label: 'Outline', variant: 'secondary', recipe: 'outline' },
  { id: 'ghost', label: 'Ghost', variant: 'ghost', recipe: 'ghost' }
];

function ThemeMatrixStory() {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const themeCss = React.useMemo(() => {
    const themeEntries: Array<[string, ThemeTokens]> = [
      ['accent-light', accentLightTokens],
      ['accent-dark', accentDarkTokens],
      ['gray-light', grayLightTokens],
      ['gray-dark', grayDarkTokens],
      ...paletteRows.flatMap((palette) => [
        [`${palette.id}-light`, palette.lightTokens] as [string, ThemeTokens],
        [`${palette.id}-dark`, palette.darkTokens] as [string, ThemeTokens]
      ])
    ];

    return themeEntries.map(([id, tokens]) => buttonThemeRule(id, tokens)).join('\n');
  }, []);

  const headerGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '120px repeat(6, minmax(120px, 1fr))',
    gap: 10,
    alignItems: 'center',
    color: '#5b6672',
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: 600
  };

  const rowGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '120px repeat(6, minmax(120px, 1fr))',
    gap: 10,
    alignItems: 'center'
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: '20px',
    fontWeight: 600,
    color: '#5b6672'
  };

  const tabsSurfaceStyle: React.CSSProperties = {
    ...showcasePanelStyle,
    gap: 16,
    padding: 18
  };

  const cellStyle = (dark = false): React.CSSProperties => ({
    padding: 10,
    borderRadius: 12,
    background: dark ? '#121826' : '#f8fafc',
    border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'}`,
    minHeight: 72,
    display: 'grid',
    placeItems: 'center'
  });

  const matrixTabListStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    marginBottom: 14,
    borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
    flexWrap: 'wrap'
  };

  const matrixTabButtonStyle = (active: boolean): React.CSSProperties => ({
    border: '1px solid transparent',
    background: active ? '#ffffff' : 'transparent',
    color: active ? '#111827' : '#5b6672',
    borderColor: active ? 'rgba(37, 99, 235, 0.35)' : 'transparent',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    lineHeight: '20px',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: active ? 'inset 0 -2px 0 #2563eb' : 'none'
  });

  const compactHeaderStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(6, minmax(170px, 1fr))',
    gap: 14,
    alignItems: 'center',
    color: '#5b6672',
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 600
  };

  const compactRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(6, minmax(170px, 1fr))',
    gap: 14,
    alignItems: 'center'
  };

  const pairCellStyle: React.CSSProperties = {
    minHeight: 56,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'nowrap'
  };

  const sizeHeaderStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(5, minmax(140px, 1fr))',
    gap: 22,
    alignItems: 'center',
    color: '#5b6672',
    fontSize: 12,
    lineHeight: '18px',
    fontWeight: 600
  };

  const sizeRowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '72px repeat(5, minmax(140px, 1fr))',
    gap: 22,
    alignItems: 'center'
  };

  const sizeCellStyle: React.CSSProperties = {
    minHeight: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  };

  const renderRecipeButton = (
    recipe: MatrixRecipe,
    themeId: string,
    extraProps?: Partial<React.ComponentProps<typeof Button>>
  ) => (
    <Button
      data-button-theme={themeId}
      variant={recipe.variant}
      recipe={recipe.recipe}
      endIcon={<ArrowRightIcon size={16} />}
      {...extraProps}
    >
      Next
    </Button>
  );

  const renderThemeColorsMatrix = () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={headerGridStyle}>
        <div />
        <div style={{ textAlign: 'center' }}>Accent / Light</div>
        <div style={{ textAlign: 'center' }}>Accent / Dark</div>
        <div style={{ textAlign: 'center' }}>Gray / Light</div>
        <div style={{ textAlign: 'center' }}>Gray / Dark</div>
        <div style={{ textAlign: 'center' }}>Disabled</div>
        <div style={{ textAlign: 'center' }}>Loading</div>
      </div>

      {matrixRecipes.map((recipe) => (
        <div key={recipe.id} style={rowGridStyle}>
          <div style={labelStyle}>{recipe.label}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'accent-light')}</div>
          <div style={cellStyle(true)}>{renderRecipeButton(recipe, 'accent-dark')}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'gray-light')}</div>
          <div style={cellStyle(true)}>{renderRecipeButton(recipe, 'gray-dark')}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'accent-light', { disabled: true })}</div>
          <div style={cellStyle(false)}>{renderRecipeButton(recipe, 'accent-light', { loading: true, ariaLabel: `${recipe.label} loading` })}</div>
        </div>
      ))}
    </div>
  );

  const renderAllColorsMatrix = () => (
    <div style={{ display: 'grid', gap: 10 }}>
      <div style={compactHeaderStyle}>
        <div />
        {matrixRecipes.map((recipe) => (
          <div key={recipe.id}>{recipe.label}</div>
        ))}
      </div>

      {paletteRows.map((palette) => (
        <div key={palette.id} style={compactRowStyle}>
          <div style={{ ...labelStyle, fontWeight: 500 }}>{palette.label}</div>
          {matrixRecipes.map((recipe) => (
            <div key={recipe.id} style={pairCellStyle}>
              {renderRecipeButton(recipe, `${palette.id}-light`)}
              {renderRecipeButton(recipe, `${palette.id}-dark`, { theme: 'dark' })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderAllSizesMatrix = () => (
    <div style={{ display: 'grid', gap: 26 }}>
      <div style={sizeHeaderStyle}>
        <div />
        {radiusColumns.map((column) => (
          <div key={column.id}>{column.label}</div>
        ))}
      </div>

      {matrixRecipes.map((recipe, recipeIndex) => (
        <div key={recipe.id} style={{ display: 'grid', gap: 14 }}>
          {recipeIndex > 0 ? <div style={{ height: 1, background: 'rgba(15, 23, 42, 0.08)', margin: '6px 0 2px' }} /> : null}
          <div
            style={{
              fontSize: 12,
              lineHeight: '18px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#64748b',
              fontWeight: 700
            }}
          >
            {recipe.label}
          </div>
          {sizeRows.map((sizeRow) => (
            <div key={`${recipe.id}-${sizeRow.id}`} style={sizeRowStyle}>
              <div style={{ ...labelStyle, fontWeight: 500 }}>{sizeRow.label}</div>
              {radiusColumns.map((column) => (
                <div key={column.id} style={sizeCellStyle}>
                  {renderRecipeButton(recipe, 'accent-light', { radius: column.radius, scale: sizeRow.scale })}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );

  const activePanel =
    selectedTab === 0 ? renderThemeColorsMatrix() : selectedTab === 1 ? renderAllColorsMatrix() : renderAllSizesMatrix();

  return (
    <ShowcasePage
      eyebrow="Token Matrix"
      title="Theme-Driven Button Patterns"
      description="Heavy reference matrices for recipe, palette, and size coverage. This story is isolated from the main button docs to keep the primary button surface responsive."
      meta={[
        { label: 'Accent Palette', value: 'Blue' },
        { label: 'Neutral Palette', value: 'Gray' },
        { label: 'Rows', value: '26 Colors' },
        { label: 'Tabs', value: '3 Matrices' }
      ]}
    >
      <ShowcaseSection
        eyebrow="Button Grammar"
        title="Tabbed Matrix Recipes"
        description="Use the tabs to inspect recipe behavior by theme state, palette coverage, and size/radius combinations."
      >
        <div id="button-theme-matrix" style={tabsSurfaceStyle}>
          <style>{themeCss}</style>
          <div role="tablist" aria-label="Button matrix tabs" style={matrixTabListStyle}>
            {BUTTON_MATRIX_TABS.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selectedTab === index}
                onClick={() => setSelectedTab(index)}
                style={matrixTabButtonStyle(selectedTab === index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div role="tabpanel">{activePanel}</div>
        </div>
      </ShowcaseSection>
    </ShowcasePage>
  );
}

export const ThemeTokenMatrix = ThemeMatrixStory.bind({});
