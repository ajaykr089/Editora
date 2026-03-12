type ThemeScale = Record<string, string>;
type ThemeMode = 'light' | 'dark';

export type AccentPaletteName = 'amber' | 'blue' | 'green' | 'red' | 'gray';

export interface AccentPaletteTokens {
  scale: ThemeScale;
  alphaScale: ThemeScale;
  contrast: string;
  surface: string;
  indicator: string;
  track: string;
}

export interface ThemeTokens {
  colors: {
    primary: string;
    primaryHover?: string;
    foregroundOnPrimary?: string;
    background?: string;
    surface?: string;
    surfaceAlt?: string;
    text?: string;
    muted?: string;
    border?: string;
    focusRing?: string;
    success?: string;
    danger?: string;
    warning?: string;
  };
  palette?: {
    gray?: ThemeScale;
    grayAlpha?: ThemeScale;
    blackAlpha?: ThemeScale;
    whiteAlpha?: ThemeScale;
    accent?: ThemeScale;
    accentAlpha?: ThemeScale;
    accentContrast?: string;
    accentSurface?: string;
    accentIndicator?: string;
    accentTrack?: string;
  };
  surfaces?: {
    background?: string;
    surface?: string;
    panel?: string;
    panelSolid?: string;
    panelTranslucent?: string;
    overlay?: string;
    transparent?: string;
  };
  radius?: string;
  radiusScale?: ThemeScale;
  shadows?: {
    sm?: string;
    md?: string;
    lg?: string;
    '1'?: string;
    '2'?: string;
    '3'?: string;
    '4'?: string;
    '5'?: string;
    '6'?: string;
  };
  spacing?: { xs?: string; sm?: string; md?: string; lg?: string; xl?: string; xxl?: string };
  spaceScale?: ThemeScale;
  typography?: {
    family?: string;
    headingFamily?: string;
    codeFamily?: string;
    size?: { sm?: string; md?: string; lg?: string };
    fontScale?: ThemeScale;
    lineHeight?: ThemeScale;
    letterSpacing?: ThemeScale;
  };
  motion?: { durationShort?: string; durationBase?: string; durationLong?: string; easing?: string };
  effects?: { backdropFilterPanel?: string };
  components?: {
    button?: ThemeScale;
    badge?: ThemeScale;
    card?: ThemeScale;
    alert?: ThemeScale;
    alertDialog?: ThemeScale;
    appHeader?: ThemeScale;
    aspectRatio?: ThemeScale;
    avatar?: ThemeScale;
    menu?: ThemeScale;
    panel?: ThemeScale;
    input?: ThemeScale;
  };
  zIndex?: { modal?: number; overlay?: number; toast?: number };
  breakpoints?: { sm?: string; md?: string; lg?: string };
}

const blackAlphaScale: ThemeScale = {
  '1': '#0000000d',
  '2': '#0000001a',
  '3': '#00000026',
  '4': '#0003',
  '5': '#0000004d',
  '6': '#0006',
  '7': '#00000080',
  '8': '#0009',
  '9': '#000000b3',
  '10': '#000c',
  '11': '#000000e6',
  '12': '#000000f2'
};

const whiteAlphaScale: ThemeScale = {
  '1': '#ffffff0d',
  '2': '#ffffff1a',
  '3': '#ffffff26',
  '4': '#fff3',
  '5': '#ffffff4d',
  '6': '#fff6',
  '7': '#ffffff80',
  '8': '#fff9',
  '9': '#ffffffb3',
  '10': '#fffc',
  '11': '#ffffffe6',
  '12': '#fffffff2'
};

export const baselineAccentPalettes: Record<AccentPaletteName, Record<ThemeMode, AccentPaletteTokens>> = {
  amber: {
    light: {
      scale: {
        '1': '#fefdfb',
        '2': '#fefbe9',
        '3': '#fff7c2',
        '4': '#ffee9c',
        '5': '#fbe577',
        '6': '#f3d673',
        '7': '#e9c162',
        '8': '#e2a336',
        '9': '#ffc53d',
        '10': '#ffba18',
        '11': '#ab6400',
        '12': '#4f3422'
      },
      alphaScale: {
        '1': '#c0800004',
        '2': '#f4d10016',
        '3': '#ffde003d',
        '4': '#ffd40063',
        '5': '#f8cf0088',
        '6': '#eab5008c',
        '7': '#dc9b009d',
        '8': '#da8a00c9',
        '9': '#ffb300c2',
        '10': '#ffb300e7',
        '11': '#ab6400',
        '12': '#341500dd'
      },
      contrast: '#21201c',
      surface: '#fefae4cc',
      indicator: '#ffc53d',
      track: '#ffc53d'
    },
    dark: {
      scale: {
        '1': '#16120c',
        '2': '#1d180f',
        '3': '#302008',
        '4': '#3f2700',
        '5': '#4d3000',
        '6': '#5c3d05',
        '7': '#714f19',
        '8': '#8f6424',
        '9': '#ffc53d',
        '10': '#ffd60a',
        '11': '#ffca16',
        '12': '#ffe7b3'
      },
      alphaScale: {
        '1': '#e63c0006',
        '2': '#fd9b000d',
        '3': '#fa820022',
        '4': '#fc820032',
        '5': '#fd8b0041',
        '6': '#fd9b0051',
        '7': '#ffab2567',
        '8': '#ffae3587',
        '9': '#ffc53d',
        '10': '#ffd60a',
        '11': '#ffca16',
        '12': '#ffe7b3'
      },
      contrast: '#21201c',
      surface: '#271f1380',
      indicator: '#ffc53d',
      track: '#ffc53d'
    }
  },
  blue: {
    light: {
      scale: {
        '1': '#fbfdff',
        '2': '#f4faff',
        '3': '#e6f4fe',
        '4': '#d5efff',
        '5': '#c2e5ff',
        '6': '#acd8fc',
        '7': '#8ec8f6',
        '8': '#5eb1ef',
        '9': '#0090ff',
        '10': '#0588f0',
        '11': '#0d74ce',
        '12': '#113264'
      },
      alphaScale: {
        '1': '#0080ff04',
        '2': '#008cff0b',
        '3': '#008ff519',
        '4': '#009eff2a',
        '5': '#0093ff3d',
        '6': '#0088f653',
        '7': '#0083eb71',
        '8': '#0084e6a1',
        '9': '#0090ff',
        '10': '#0086f0fa',
        '11': '#006dcbf2',
        '12': '#002359ee'
      },
      contrast: '#ffffff',
      surface: '#f1f9ffcc',
      indicator: '#0090ff',
      track: '#0090ff'
    },
    dark: {
      scale: {
        '1': '#0d1520',
        '2': '#111927',
        '3': '#0d2847',
        '4': '#003362',
        '5': '#004074',
        '6': '#104d87',
        '7': '#205d9e',
        '8': '#2870bd',
        '9': '#0090ff',
        '10': '#3b9eff',
        '11': '#70b8ff',
        '12': '#c2e6ff'
      },
      alphaScale: {
        '1': '#004df211',
        '2': '#1166fb18',
        '3': '#0077ff3a',
        '4': '#0075ff57',
        '5': '#0081fd6b',
        '6': '#0f89fd7f',
        '7': '#2a91fe98',
        '8': '#3094feb9',
        '9': '#0090ff',
        '10': '#3b9eff',
        '11': '#70b8ff',
        '12': '#c2e6ff'
      },
      contrast: '#ffffff',
      surface: '#0f274380',
      indicator: '#0090ff',
      track: '#0090ff'
    }
  },
  green: {
    light: {
      scale: {
        '1': '#fbfefc',
        '2': '#f4fbf6',
        '3': '#e6f6eb',
        '4': '#d6f1df',
        '5': '#c4e8d1',
        '6': '#adddc0',
        '7': '#8eceaa',
        '8': '#5bb98b',
        '9': '#30a46c',
        '10': '#2b9a66',
        '11': '#218358',
        '12': '#193b2d'
      },
      alphaScale: {
        '1': '#00c04004',
        '2': '#00a32f0b',
        '3': '#00a43319',
        '4': '#00a83829',
        '5': '#019c393b',
        '6': '#00963c52',
        '7': '#00914071',
        '8': '#00924ba4',
        '9': '#008f4acf',
        '10': '#008647d4',
        '11': '#00713fde',
        '12': '#002616e6'
      },
      contrast: '#ffffff',
      surface: '#f1faf4cc',
      indicator: '#30a46c',
      track: '#30a46c'
    },
    dark: {
      scale: {
        '1': '#0e1512',
        '2': '#121b17',
        '3': '#132d21',
        '4': '#113b29',
        '5': '#174933',
        '6': '#20573e',
        '7': '#28684a',
        '8': '#2f7c57',
        '9': '#30a46c',
        '10': '#33b074',
        '11': '#3dd68c',
        '12': '#b1f1cb'
      },
      alphaScale: {
        '1': '#00de4505',
        '2': '#29f99d0b',
        '3': '#22ff991e',
        '4': '#11ff9930',
        '5': '#2bffa23f',
        '6': '#44ffaa4d',
        '7': '#50fdac5f',
        '8': '#54ffad75',
        '9': '#44ffa49f',
        '10': '#43fea4ab',
        '11': '#46fea5d4',
        '12': '#bbffd7ef'
      },
      contrast: '#0f1a14',
      surface: '#13281e80',
      indicator: '#30a46c',
      track: '#30a46c'
    }
  },
  red: {
    light: {
      scale: {
        '1': '#fffcfc',
        '2': '#fff7f7',
        '3': '#feebec',
        '4': '#ffdbdc',
        '5': '#ffcdce',
        '6': '#fdbdbe',
        '7': '#f4a9aa',
        '8': '#eb8e90',
        '9': '#e5484d',
        '10': '#dc3e42',
        '11': '#ce2c31',
        '12': '#641723'
      },
      alphaScale: {
        '1': '#ff000003',
        '2': '#ff000008',
        '3': '#f3000d14',
        '4': '#ff000824',
        '5': '#ff000632',
        '6': '#f8000442',
        '7': '#df000356',
        '8': '#d2000571',
        '9': '#db0007b7',
        '10': '#d10005c1',
        '11': '#c40006d3',
        '12': '#55000de8'
      },
      contrast: '#ffffff',
      surface: '#fff5f5cc',
      indicator: '#e5484d',
      track: '#e5484d'
    },
    dark: {
      scale: {
        '1': '#191111',
        '2': '#201314',
        '3': '#3b1219',
        '4': '#500f1c',
        '5': '#611623',
        '6': '#72232d',
        '7': '#8c333a',
        '8': '#b54548',
        '9': '#e5484d',
        '10': '#ec5d5e',
        '11': '#ff9592',
        '12': '#ffd1d9'
      },
      alphaScale: {
        '1': '#f4121209',
        '2': '#f22f3e11',
        '3': '#ff173f2d',
        '4': '#fe0a3b44',
        '5': '#ff204756',
        '6': '#ff3e5668',
        '7': '#ff536184',
        '8': '#ff5d61b0',
        '9': '#fe4e54e4',
        '10': '#ff6465eb',
        '11': '#ff9592',
        '12': '#ffd1d9'
      },
      contrast: '#ffffff',
      surface: '#32141780',
      indicator: '#e5484d',
      track: '#e5484d'
    }
  },
  gray: {
    light: {
      scale: {
        '1': '#fcfcfc',
        '2': '#f9f9f9',
        '3': '#f0f0f0',
        '4': '#e8e8e8',
        '5': '#e0e0e0',
        '6': '#d9d9d9',
        '7': '#cecece',
        '8': '#bbb',
        '9': '#8d8d8d',
        '10': '#838383',
        '11': '#646464',
        '12': '#202020'
      },
      alphaScale: {
        '1': '#00000003',
        '2': '#00000006',
        '3': '#0000000f',
        '4': '#00000017',
        '5': '#0000001f',
        '6': '#00000026',
        '7': '#00000031',
        '8': '#00000044',
        '9': '#00000072',
        '10': '#0000007c',
        '11': '#0000009b',
        '12': '#000000df'
      },
      contrast: '#ffffff',
      surface: '#f8f8f8cc',
      indicator: '#8d8d8d',
      track: '#8d8d8d'
    },
    dark: {
      scale: {
        '1': '#111',
        '2': '#191919',
        '3': '#222',
        '4': '#2a2a2a',
        '5': '#313131',
        '6': '#3a3a3a',
        '7': '#484848',
        '8': '#606060',
        '9': '#6e6e6e',
        '10': '#7b7b7b',
        '11': '#b4b4b4',
        '12': '#eee'
      },
      alphaScale: {
        '1': '#0000',
        '2': '#ffffff09',
        '3': '#ffffff12',
        '4': '#ffffff1b',
        '5': '#ffffff22',
        '6': '#ffffff2c',
        '7': '#ffffff3b',
        '8': '#ffffff55',
        '9': '#ffffff64',
        '10': '#ffffff72',
        '11': '#ffffffaf',
        '12': '#ffffffed'
      },
      contrast: '#111111',
      surface: '#1d1d1d80',
      indicator: '#7b7b7b',
      track: '#7b7b7b'
    }
  }
};

const baselineLightComponentTokens: NonNullable<ThemeTokens['components']> = {
  button: {
    'height-sm': '32px',
    'height-md': '36px',
    'height-lg': '44px',
    'classic-after-inset': '2px',
    'classic-box-shadow-top': 'inset 0 0 0 1px var(--gray-a5), inset 0 1px 1px var(--white-a10)',
    'classic-box-shadow-bottom': 'inset 0 4px 2px -2px var(--white-a9), inset 0 2px 1px -1px var(--white-a9)',
    'classic-disabled-box-shadow': 'inset 0 0 0 1px var(--gray-a4), inset 0 1px 1px var(--gray-a1)',
    'classic-active-filter': 'brightness(0.985) saturate(0.98)',
    'solid-active-filter': 'brightness(0.96) saturate(1.02)'
  },
  badge: {
    radius: '999px',
    shadow: 'none',
    'font-size': '12px',
    'font-weight': '600',
    gap: '6px',
    'padding-block': '5px',
    'padding-inline': '10px',
    'border-width': '1px'
  },
  card: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 82%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-2)',
    'hover-shadow': 'var(--shadow-3)',
    'active-shadow': 'var(--shadow-2)',
    'classic-shadow': 'var(--shadow-2)',
    'classic-hover-shadow': 'var(--shadow-3)',
    'classic-active-shadow': 'var(--shadow-2)'
  },
  alert: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 82%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-2)',
    'padding-x': '16px',
    'padding-y': '14px',
    gap: 'var(--ui-default-gap)',
    'icon-size': '26px',
    'dismiss-size': '28px'
  },
  alertDialog: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 82%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-4)',
    backdrop: 'var(--color-overlay)',
    padding: '20px',
    gap: 'var(--ui-default-gap)',
    'min-width': '360px',
    'max-width': 'min(90vw, 560px)',
    'header-gap': '10px',
    'footer-gap': '10px'
  },
  appHeader: {
    bg: 'var(--color-panel)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 78%, transparent)',
    radius: '0px',
    shadow: 'none',
    padding: '16px',
    gap: '12px',
    height: '64px',
    'height-dense': '52px',
    'control-radius': 'var(--ui-radius)'
  },
  aspectRatio: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 82%, transparent)',
    radius: 'var(--radius-4)',
    shadow: 'none',
    'empty-bg': 'color-mix(in srgb, var(--accent-a3) 24%, transparent)',
    'badge-radius': '999px'
  },
  avatar: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 82%, transparent)',
    radius: '999px',
    shadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 24px rgba(15, 23, 42, 0.12)',
    'size-sm': '30px',
    'size-md': '40px',
    'size-lg': '52px',
    'badge-radius': '999px',
    'status-border': '2px solid var(--color-panel-solid)'
  },
  menu: {
    bg: 'var(--color-panel)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 78%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-4)',
    backdrop: 'var(--backdrop-filter-panel)',
    'content-padding': 'var(--ui-default-gap)',
    'item-height': '36px',
    'item-padding-x': 'var(--ui-default-gap)',
    'item-radius': 'var(--ui-radius)'
  },
  panel: {
    bg: 'var(--color-panel)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 72%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-4)',
    backdrop: 'var(--backdrop-filter-panel)',
    padding: 'var(--ui-default-gap)'
  },
  input: {
    'height-sm': '32px',
    'height-md': '36px',
    'height-lg': '44px',
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a5) 84%, transparent)',
    'focus-ring': '0 0 0 3px color-mix(in srgb, var(--accent-a5) 48%, transparent)'
  }
};

const baselineDarkComponentTokens: NonNullable<ThemeTokens['components']> = {
  button: {
    'height-sm': '32px',
    'height-md': '36px',
    'height-lg': '44px',
    'classic-after-inset': '1px',
    'classic-box-shadow-top': 'inset 0 0 0 1px var(--white-a2), inset 0 4px 2px -2px var(--white-a3), inset 0 1px 1px var(--white-a6), inset 0 -1px 1px var(--black-a6)',
    'classic-box-shadow-bottom': 'inset 0 0 0 1px var(--black-a4), inset 0 -1px 1px var(--black-a8)',
    'classic-disabled-box-shadow': 'inset 0 0 0 1px var(--gray-a5), inset 0 4px 2px -2px var(--gray-a2), inset 0 1px 1px var(--gray-a5), inset 0 -1px 1px var(--black-a3), inset 0 0 0 1px var(--gray-a2)',
    'classic-active-filter': 'brightness(0.94) saturate(0.95)',
    'solid-active-filter': 'brightness(0.92) saturate(1.04)'
  },
  badge: {
    radius: '999px',
    shadow: 'none',
    'font-size': '12px',
    'font-weight': '600',
    gap: '6px',
    'padding-block': '5px',
    'padding-inline': '10px',
    'border-width': '1px'
  },
  card: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 88%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-2)',
    'hover-shadow': 'var(--shadow-3)',
    'active-shadow': 'var(--shadow-2)',
    'classic-shadow': 'var(--shadow-2)',
    'classic-hover-shadow': 'var(--shadow-3)',
    'classic-active-shadow': 'var(--shadow-2)'
  },
  alert: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 88%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-2)',
    'padding-x': '16px',
    'padding-y': '14px',
    gap: 'var(--ui-default-gap)',
    'icon-size': '26px',
    'dismiss-size': '28px'
  },
  alertDialog: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 88%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-4)',
    backdrop: 'var(--color-overlay)',
    padding: '20px',
    gap: 'var(--ui-default-gap)',
    'min-width': '360px',
    'max-width': 'min(90vw, 560px)',
    'header-gap': '10px',
    'footer-gap': '10px'
  },
  appHeader: {
    bg: 'var(--color-panel)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 82%, transparent)',
    radius: '0px',
    shadow: 'none',
    padding: '16px',
    gap: '12px',
    height: '64px',
    'height-dense': '52px',
    'control-radius': 'var(--ui-radius)'
  },
  aspectRatio: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 88%, transparent)',
    radius: 'var(--radius-4)',
    shadow: 'none',
    'empty-bg': 'color-mix(in srgb, var(--accent-a3) 20%, transparent)',
    'badge-radius': '999px'
  },
  avatar: {
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 88%, transparent)',
    radius: '999px',
    shadow: '0 1px 2px rgba(2, 6, 23, 0.18), 0 12px 24px rgba(2, 6, 23, 0.28)',
    'size-sm': '30px',
    'size-md': '40px',
    'size-lg': '52px',
    'badge-radius': '999px',
    'status-border': '2px solid var(--color-panel-solid)'
  },
  menu: {
    bg: 'var(--color-panel)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 82%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-4)',
    backdrop: 'var(--backdrop-filter-panel)',
    'content-padding': 'var(--ui-default-gap)',
    'item-height': '36px',
    'item-padding-x': 'var(--ui-default-gap)',
    'item-radius': 'var(--ui-radius)'
  },
  panel: {
    bg: 'var(--color-panel)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 84%, transparent)',
    radius: 'var(--ui-radius)',
    shadow: 'var(--shadow-4)',
    backdrop: 'var(--backdrop-filter-panel)',
    padding: 'var(--ui-default-gap)'
  },
  input: {
    'height-sm': '32px',
    'height-md': '36px',
    'height-lg': '44px',
    bg: 'var(--color-panel-solid)',
    border: '1px solid color-mix(in srgb, var(--gray-a6) 88%, transparent)',
    'focus-ring': '0 0 0 3px color-mix(in srgb, var(--accent-a6) 42%, transparent)'
  }
};

function createAccentColorTokens(palette: AccentPaletteTokens) {
  return {
    primary: palette.scale['9'],
    primaryHover: palette.scale['10'] || palette.scale['9'],
    foregroundOnPrimary: palette.contrast,
    focusRing: palette.scale['8'] || palette.scale['9'],
    warning: palette.scale['9']
  };
}

export const baselineLightTokens: ThemeTokens = {
  colors: {
    primary: '#ffc53d',
    primaryHover: '#ffba18',
    foregroundOnPrimary: '#21201c',
    background: '#ffffff',
    surface: '#fcfcfc',
    surfaceAlt: '#f9f9f9',
    text: '#202020',
    muted: '#646464',
    border: '#0000001f',
    focusRing: '#e2a336',
    success: '#30a46c',
    danger: '#e5484d',
    warning: '#ffc53d'
  },
  palette: {
    gray: {
      '1': '#fcfcfc',
      '2': '#f9f9f9',
      '3': '#f0f0f0',
      '4': '#e8e8e8',
      '5': '#e0e0e0',
      '6': '#d9d9d9',
      '7': '#cecece',
      '8': '#bbb',
      '9': '#8d8d8d',
      '10': '#838383',
      '11': '#646464',
      '12': '#202020'
    },
    grayAlpha: {
      '1': '#00000003',
      '2': '#00000006',
      '3': '#0000000f',
      '4': '#00000017',
      '5': '#0000001f',
      '6': '#00000026',
      '7': '#00000031',
      '8': '#00000044',
      '9': '#00000072',
      '10': '#0000007c',
      '11': '#0000009b',
      '12': '#000000df'
    },
    blackAlpha: blackAlphaScale,
    whiteAlpha: whiteAlphaScale,
    accent: {
      ...baselineAccentPalettes.amber.light.scale
    },
    accentAlpha: {
      ...baselineAccentPalettes.amber.light.alphaScale
    },
    accentContrast: baselineAccentPalettes.amber.light.contrast,
    accentSurface: baselineAccentPalettes.amber.light.surface,
    accentIndicator: baselineAccentPalettes.amber.light.indicator,
    accentTrack: baselineAccentPalettes.amber.light.track
  },
  surfaces: {
    background: '#ffffff',
    surface: '#fcfcfc',
    panel: '#ffffffcc',
    panelSolid: '#ffffff',
    panelTranslucent: '#ffffffcc',
    overlay: 'rgba(2, 6, 23, 0.52)',
    transparent: 'transparent'
  },
  radius: '4px',
  radiusScale: {
    '1': '3px',
    '2': '4px',
    '3': '6px',
    '4': '8px',
    '5': '12px',
    '6': '16px'
  },
  shadows: {
    sm: '0 0 0 1px var(--gray-a3),0 0 0 0.5px var(--black-a1),0 1px 1px 0 var(--gray-a2),0 2px 1px -1px var(--black-a1),0 1px 3px 0 var(--black-a1)',
    md: '0 0 0 1px var(--gray-a3),0 2px 3px -2px var(--gray-a3),0 3px 12px -4px var(--black-a2),0 4px 16px -8px var(--black-a2)',
    lg: '0 0 0 1px var(--gray-a3),0 8px 40px var(--black-a1),0 12px 32px -16px var(--gray-a3)',
    '1': 'inset 0 0 0 1px var(--gray-a5),inset 0 1.5px 2px 0 var(--gray-a2),inset 0 1.5px 2px 0 var(--black-a2)',
    '2': '0 0 0 1px var(--gray-a3),0 0 0 0.5px var(--black-a1),0 1px 1px 0 var(--gray-a2),0 2px 1px -1px var(--black-a1),0 1px 3px 0 var(--black-a1)',
    '3': '0 0 0 1px var(--gray-a3),0 2px 3px -2px var(--gray-a3),0 3px 12px -4px var(--black-a2),0 4px 16px -8px var(--black-a2)',
    '4': '0 0 0 1px var(--gray-a3),0 8px 40px var(--black-a1),0 12px 32px -16px var(--gray-a3)',
    '5': '0 0 0 1px var(--gray-a3),0 12px 60px var(--black-a3),0 12px 32px -16px var(--gray-a5)',
    '6': '0 0 0 1px var(--gray-a3),0 12px 60px var(--black-a3),0 16px 64px var(--gray-a2),0 16px 36px -20px var(--gray-a7)'
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  spaceScale: {
    '1': '4px',
    '2': '8px',
    '3': '12px',
    '4': '16px',
    '5': '24px',
    '6': '32px',
    '7': '40px',
    '8': '48px',
    '9': '64px'
  },
  typography: {
    family:
      '-apple-system,BlinkMacSystemFont,"Segoe UI (Custom)",Roboto,"Helvetica Neue","Open Sans (Custom)",system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    headingFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI (Custom)",Roboto,"Helvetica Neue","Open Sans (Custom)",system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
    codeFamily:
      '"Menlo","Consolas (Custom)","Bitstream Vera Sans Mono",monospace,"Apple Color Emoji","Segoe UI Emoji"',
    size: { sm: '12px', md: '14px', lg: '16px' },
    fontScale: {
      '1': '12px',
      '2': '14px',
      '3': '16px',
      '4': '18px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '35px',
      '9': '60px'
    },
    lineHeight: {
      '1': '16px',
      '2': '20px',
      '3': '24px',
      '4': '26px',
      '5': '28px',
      '6': '30px',
      '7': '36px',
      '8': '40px',
      '9': '60px'
    },
    letterSpacing: {
      '1': '0.0025em',
      '2': '0em',
      '3': '0em',
      '4': '-0.0025em',
      '5': '-0.005em',
      '6': '-0.00625em',
      '7': '-0.0075em',
      '8': '-0.01em',
      '9': '-0.025em'
    }
  },
  motion: {
    durationShort: '120ms',
    durationBase: '180ms',
    durationLong: '260ms',
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)'
  },
  effects: {
    backdropFilterPanel: 'blur(64px)'
  },
  components: baselineLightComponentTokens,
  zIndex: { modal: 1000, overlay: 900, toast: 1100 },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px' }
};

export const baselineDarkTokens: ThemeTokens = {
  ...baselineLightTokens,
  colors: {
    primary: '#ffc53d',
    primaryHover: '#ffd60a',
    foregroundOnPrimary: '#21201c',
    background: '#111111',
    surface: '#111111',
    surfaceAlt: '#191919',
    text: '#eeeeee',
    muted: '#b4b4b4',
    border: '#ffffff22',
    focusRing: '#ffc53d',
    success: '#30a46c',
    danger: '#e5484d',
    warning: '#ffc53d'
  },
  palette: {
    ...baselineLightTokens.palette,
    gray: {
      '1': '#111',
      '2': '#191919',
      '3': '#222',
      '4': '#2a2a2a',
      '5': '#313131',
      '6': '#3a3a3a',
      '7': '#484848',
      '8': '#606060',
      '9': '#6e6e6e',
      '10': '#7b7b7b',
      '11': '#b4b4b4',
      '12': '#eee'
    },
    grayAlpha: {
      '1': '#0000',
      '2': '#ffffff09',
      '3': '#ffffff12',
      '4': '#ffffff1b',
      '5': '#ffffff22',
      '6': '#ffffff2c',
      '7': '#ffffff3b',
      '8': '#ffffff55',
      '9': '#ffffff64',
      '10': '#ffffff72',
      '11': '#ffffffaf',
      '12': '#ffffffed'
    },
    blackAlpha: blackAlphaScale,
    whiteAlpha: whiteAlphaScale,
    accent: {
      ...baselineAccentPalettes.amber.dark.scale
    },
    accentAlpha: {
      ...baselineAccentPalettes.amber.dark.alphaScale
    },
    accentContrast: baselineAccentPalettes.amber.dark.contrast,
    accentSurface: baselineAccentPalettes.amber.dark.surface,
    accentIndicator: baselineAccentPalettes.amber.dark.indicator,
    accentTrack: baselineAccentPalettes.amber.dark.track
  },
  surfaces: {
    background: '#111111',
    surface: '#111111',
    panel: '#21212180',
    panelSolid: '#191919',
    panelTranslucent: '#21212180',
    overlay: 'rgba(0, 0, 0, 0.72)',
    transparent: 'transparent'
  },
  shadows: {
    sm: '0 0 0 1px var(--gray-a6),0 0 0 0.5px var(--black-a3),0 1px 1px 0 var(--black-a6),0 2px 1px -1px var(--black-a6),0 1px 3px 0 var(--black-a5)',
    md: '0 0 0 1px var(--gray-a6),0 2px 3px -2px var(--black-a3),0 3px 8px -2px var(--black-a6),0 4px 12px -4px var(--black-a7)',
    lg: '0 0 0 1px var(--gray-a6),0 8px 40px var(--black-a3),0 12px 32px -16px var(--black-a5)',
    '1': 'inset 0 -1px 1px 0 var(--gray-a3),inset 0 0 0 1px var(--gray-a3),inset 0 3px 4px 0 var(--black-a5),inset 0 0 0 1px var(--gray-a4)',
    '2': '0 0 0 1px var(--gray-a6),0 0 0 0.5px var(--black-a3),0 1px 1px 0 var(--black-a6),0 2px 1px -1px var(--black-a6),0 1px 3px 0 var(--black-a5)',
    '3': '0 0 0 1px var(--gray-a6),0 2px 3px -2px var(--black-a3),0 3px 8px -2px var(--black-a6),0 4px 12px -4px var(--black-a7)',
    '4': '0 0 0 1px var(--gray-a6),0 8px 40px var(--black-a3),0 12px 32px -16px var(--black-a5)',
    '5': '0 0 0 1px var(--gray-a6),0 12px 60px var(--black-a5),0 12px 32px -16px var(--black-a7)',
    '6': '0 0 0 1px var(--gray-a6),0 12px 60px var(--black-a4),0 16px 64px var(--black-a6),0 16px 36px -20px var(--black-a11)'
  },
  components: baselineDarkComponentTokens
};

export const defaultTokens: ThemeTokens = baselineLightTokens;

const registeredHosts = new Set<HTMLElement>();

function mergeScale(base?: ThemeScale | null, patch?: ThemeScale | null): ThemeScale | undefined {
  if (!base && !patch) return undefined;
  return { ...(base || {}), ...(patch || {}) };
}

export function createThemeTokens(overrides?: Partial<ThemeTokens>, options?: { accentPalette?: AccentPaletteName; mode?: ThemeMode }): ThemeTokens {
  const mode = options?.mode || 'light';
  const base = mode === 'dark' ? baselineDarkTokens : baselineLightTokens;
  const paletteName = options?.accentPalette;
  const accentPalette = paletteName ? baselineAccentPalettes[paletteName][mode] : null;
  const accentPatch = accentPalette
    ? {
        colors: {
          ...createAccentColorTokens(accentPalette)
        },
        palette: {
          accent: accentPalette.scale,
          accentAlpha: accentPalette.alphaScale,
          accentContrast: accentPalette.contrast,
          accentSurface: accentPalette.surface,
          accentIndicator: accentPalette.indicator,
          accentTrack: accentPalette.track
        }
      }
    : null;

  const merged = {
    ...base,
    ...overrides,
    colors: {
      ...base.colors,
      ...(accentPatch?.colors || {}),
      ...(overrides?.colors || {})
    },
    palette: {
      ...(base.palette || {}),
      ...(accentPatch?.palette || {}),
      ...(overrides?.palette || {}),
      gray: mergeScale(base.palette?.gray, overrides?.palette?.gray),
      grayAlpha: mergeScale(base.palette?.grayAlpha, overrides?.palette?.grayAlpha),
      blackAlpha: mergeScale(base.palette?.blackAlpha, overrides?.palette?.blackAlpha),
      whiteAlpha: mergeScale(base.palette?.whiteAlpha, overrides?.palette?.whiteAlpha),
      accent: mergeScale(accentPalette?.scale || base.palette?.accent, overrides?.palette?.accent),
      accentAlpha: mergeScale(accentPalette?.alphaScale || base.palette?.accentAlpha, overrides?.palette?.accentAlpha)
    },
    surfaces: {
      ...(base.surfaces || {}),
      ...(overrides?.surfaces || {})
    },
    shadows: {
      ...(base.shadows || {}),
      ...(overrides?.shadows || {})
    },
    spacing: {
      ...(base.spacing || {}),
      ...(overrides?.spacing || {})
    },
    spaceScale: mergeScale(base.spaceScale, overrides?.spaceScale),
    radiusScale: mergeScale(base.radiusScale, overrides?.radiusScale),
    typography: {
      ...(base.typography || {}),
      ...(overrides?.typography || {}),
      size: {
        ...(base.typography?.size || {}),
        ...(overrides?.typography?.size || {})
      },
      fontScale: mergeScale(base.typography?.fontScale, overrides?.typography?.fontScale),
      lineHeight: mergeScale(base.typography?.lineHeight, overrides?.typography?.lineHeight),
      letterSpacing: mergeScale(base.typography?.letterSpacing, overrides?.typography?.letterSpacing)
    },
    motion: {
      ...(base.motion || {}),
      ...(overrides?.motion || {})
    },
    effects: {
      ...(base.effects || {}),
      ...(overrides?.effects || {})
    },
    components: {
      ...(base.components || {}),
      ...(overrides?.components || {}),
      button: mergeScale(base.components?.button, overrides?.components?.button),
      badge: mergeScale(base.components?.badge, overrides?.components?.badge),
      card: mergeScale(base.components?.card, overrides?.components?.card),
      alert: mergeScale(base.components?.alert, overrides?.components?.alert),
      alertDialog: mergeScale(base.components?.alertDialog, overrides?.components?.alertDialog),
      appHeader: mergeScale(base.components?.appHeader, overrides?.components?.appHeader),
      aspectRatio: mergeScale(base.components?.aspectRatio, overrides?.components?.aspectRatio),
      avatar: mergeScale(base.components?.avatar, overrides?.components?.avatar),
      menu: mergeScale(base.components?.menu, overrides?.components?.menu),
      panel: mergeScale(base.components?.panel, overrides?.components?.panel),
      input: mergeScale(base.components?.input, overrides?.components?.input)
    },
    zIndex: {
      ...(base.zIndex || {}),
      ...(overrides?.zIndex || {})
    },
    breakpoints: {
      ...(base.breakpoints || {}),
      ...(overrides?.breakpoints || {})
    }
  } satisfies ThemeTokens;

  return merged;
}

export function withAccentPalette(tokens: ThemeTokens | Partial<ThemeTokens>, palette: AccentPaletteName, mode: ThemeMode = 'light'): ThemeTokens {
  const paletteTokens = baselineAccentPalettes[palette][mode];
  const next = tokens as Partial<ThemeTokens>;
  return createThemeTokens(
    {
      ...next,
      colors: {
        ...(next.colors || {}),
        ...createAccentColorTokens(paletteTokens)
      },
      palette: {
        ...(next.palette || {}),
        accent: paletteTokens.scale,
        accentAlpha: paletteTokens.alphaScale,
        accentContrast: paletteTokens.contrast,
        accentSurface: paletteTokens.surface,
        accentIndicator: paletteTokens.indicator,
        accentTrack: paletteTokens.track
      }
    },
    { mode }
  );
}

function setOn(target: HTMLElement, name: string, value: string) {
  try {
    target.style.setProperty(name, value);
  } catch {
    // no-op
  }
}

function addScaleVariables(target: HTMLElement, prefix: string, scale?: ThemeScale | null) {
  if (!scale) return;
  Object.entries(scale).forEach(([key, value]) => {
    if (typeof value === 'string' && value) {
      target.style.setProperty(`${prefix}${key}`, value);
    }
  });
}

export function registerThemeHost(el: HTMLElement) {
  if (!el) return;
  registeredHosts.add(el);
}

function applyThemeToTarget(target: HTMLElement, next: ThemeTokens) {
  setOn(target, '--ui-color-primary', next.colors.primary);
  setOn(target, '--ui-color-primary-hover', next.colors.primaryHover || next.colors.primary);
  setOn(target, '--ui-color-foreground-on-primary', next.colors.foregroundOnPrimary || '#ffffff');
  setOn(target, '--ui-color-background', next.colors.background || '#ffffff');
  setOn(target, '--ui-color-surface', next.colors.surface || next.colors.background || '#ffffff');
  setOn(target, '--ui-color-surface-alt', next.colors.surfaceAlt || next.colors.surface || '#f9f9f9');
  setOn(target, '--ui-color-text', next.colors.text || '#202020');
  setOn(target, '--ui-color-muted', next.colors.muted || '#646464');
  setOn(target, '--ui-color-border', next.colors.border || '#0000001f');
  setOn(target, '--ui-color-focus-ring', next.colors.focusRing || next.colors.primary);
  setOn(target, '--ui-color-success', next.colors.success || '#30a46c');
  setOn(target, '--ui-color-danger', next.colors.danger || '#e5484d');
  setOn(target, '--ui-color-warning', next.colors.warning || next.colors.primary);

  setOn(target, '--ui-primary', next.colors.primary);
  setOn(target, '--ui-primary-hover', next.colors.primaryHover || next.colors.primary);
  setOn(target, '--ui-foreground', next.colors.foregroundOnPrimary || '#ffffff');
  setOn(target, '--ui-background', next.colors.background || '#ffffff');
  setOn(target, '--ui-surface', next.colors.surface || next.colors.background || '#ffffff');
  setOn(target, '--ui-surface-alt', next.colors.surfaceAlt || next.colors.surface || '#f9f9f9');
  setOn(target, '--ui-text', next.colors.text || '#202020');
  setOn(target, '--ui-muted', next.colors.muted || '#646464');
  setOn(target, '--ui-border', next.colors.border || '#0000001f');
  setOn(target, '--ui-focus-ring', next.colors.focusRing || next.colors.primary);
  setOn(target, '--ui-success', next.colors.success || '#30a46c');
  setOn(target, '--ui-error', next.colors.danger || '#e5484d');
  setOn(target, '--ui-warning', next.colors.warning || next.colors.primary);

  setOn(target, '--ui-radius', next.radius || '4px');
  setOn(target, '--ui-space-xs', next.spacing?.xs || '4px');
  setOn(target, '--ui-space-sm', next.spacing?.sm || '8px');
  setOn(target, '--ui-space-md', next.spacing?.md || '12px');
  setOn(target, '--ui-space-lg', next.spacing?.lg || '24px');
  setOn(target, '--ui-space-xl', next.spacing?.xl || '32px');
  setOn(target, '--ui-space-xxl', next.spacing?.xxl || '48px');
  setOn(target, '--ui-default-gap', next.spacing?.sm || next.spaceScale?.['2'] || '8px');

  setOn(target, '--ui-shadow-sm', next.shadows?.sm || next.shadows?.['2'] || 'none');
  setOn(target, '--ui-shadow-md', next.shadows?.md || next.shadows?.['3'] || 'none');
  setOn(target, '--ui-shadow-lg', next.shadows?.lg || next.shadows?.['4'] || 'none');

  setOn(target, '--ui-font-family', next.typography?.family || 'system-ui, sans-serif');
  setOn(target, '--ui-font-family-heading', next.typography?.headingFamily || next.typography?.family || 'system-ui, sans-serif');
  setOn(target, '--ui-font-family-code', next.typography?.codeFamily || 'monospace');
  setOn(target, '--ui-font-size-sm', next.typography?.size?.sm || '12px');
  setOn(target, '--ui-font-size-md', next.typography?.size?.md || '14px');
  setOn(target, '--ui-font-size-lg', next.typography?.size?.lg || '16px');
  setOn(target, '--ui-default-font-size', next.typography?.size?.md || next.typography?.fontScale?.['2'] || '14px');
  setOn(target, '--ui-default-line-height', next.typography?.lineHeight?.['2'] || '20px');
  setOn(target, '--ui-default-letter-spacing', next.typography?.letterSpacing?.['2'] || '0em');

  setOn(target, '--ui-motion-short', next.motion?.durationShort || '120ms');
  setOn(target, '--ui-motion-base', next.motion?.durationBase || '180ms');
  setOn(target, '--ui-motion-long', next.motion?.durationLong || '260ms');
  setOn(target, '--ui-motion-easing', next.motion?.easing || 'cubic-bezier(0.2, 0.8, 0.2, 1)');

  setOn(target, '--ui-z-modal', String(next.zIndex?.modal ?? 1000));
  setOn(target, '--ui-z-overlay', String(next.zIndex?.overlay ?? 900));
  setOn(target, '--ui-z-toast', String(next.zIndex?.toast ?? 1100));
  setOn(target, '--ui-breakpoint-sm', next.breakpoints?.sm || '640px');
  setOn(target, '--ui-breakpoint-md', next.breakpoints?.md || '768px');
  setOn(target, '--ui-breakpoint-lg', next.breakpoints?.lg || '1024px');

  setOn(target, '--color-background', next.surfaces?.background || next.colors.background || '#ffffff');
  setOn(target, '--color-surface', next.surfaces?.surface || next.colors.surface || '#fcfcfc');
  setOn(target, '--color-panel', next.surfaces?.panel || next.surfaces?.panelTranslucent || '#ffffffcc');
  setOn(target, '--color-panel-solid', next.surfaces?.panelSolid || next.colors.surface || '#ffffff');
  setOn(target, '--color-panel-translucent', next.surfaces?.panelTranslucent || '#ffffffcc');
  setOn(target, '--color-overlay', next.surfaces?.overlay || 'rgba(2, 6, 23, 0.52)');
  setOn(target, '--color-transparent', next.surfaces?.transparent || 'transparent');
  setOn(target, '--backdrop-filter-panel', next.effects?.backdropFilterPanel || 'blur(64px)');

  if (next.palette?.accentContrast) setOn(target, '--accent-contrast', next.palette.accentContrast);
  if (next.palette?.accentSurface) setOn(target, '--accent-surface', next.palette.accentSurface);
  if (next.palette?.accentIndicator) setOn(target, '--accent-indicator', next.palette.accentIndicator);
  if (next.palette?.accentTrack) setOn(target, '--accent-track', next.palette.accentTrack);

  addScaleVariables(target, '--gray-', next.palette?.gray);
  addScaleVariables(target, '--gray-a', next.palette?.grayAlpha);
  addScaleVariables(target, '--black-a', next.palette?.blackAlpha);
  addScaleVariables(target, '--white-a', next.palette?.whiteAlpha);
  addScaleVariables(target, '--accent-', next.palette?.accent);
  addScaleVariables(target, '--accent-a', next.palette?.accentAlpha);
  addScaleVariables(target, '--space-', next.spaceScale);
  addScaleVariables(target, '--radius-', next.radiusScale);
  addScaleVariables(target, '--font-size-', next.typography?.fontScale);
  addScaleVariables(target, '--line-height-', next.typography?.lineHeight);
  addScaleVariables(target, '--letter-spacing-', next.typography?.letterSpacing);
  addScaleVariables(target, '--shadow-', next.shadows as ThemeScale | undefined);
  addScaleVariables(target, '--base-button-', next.components?.button);
  addScaleVariables(target, '--base-badge-', next.components?.badge);
  addScaleVariables(target, '--base-card-', next.components?.card);
  addScaleVariables(target, '--base-alert-', next.components?.alert);
  addScaleVariables(target, '--base-alert-dialog-', next.components?.alertDialog);
  addScaleVariables(target, '--base-app-header-', next.components?.appHeader);
  addScaleVariables(target, '--base-aspect-ratio-', next.components?.aspectRatio);
  addScaleVariables(target, '--base-avatar-', next.components?.avatar);
  addScaleVariables(target, '--base-menu-', next.components?.menu);
  addScaleVariables(target, '--base-panel-', next.components?.panel);
  addScaleVariables(target, '--base-input-', next.components?.input);
}

export function applyTheme(
  tokens: ThemeTokens,
  root: ShadowRoot | Document | HTMLElement | null = typeof document !== 'undefined' ? document : null
) {
  if (!root) return;
  const next = createThemeTokens(tokens);
  const isGlobalRoot = root === document || root instanceof ShadowRoot;

  let styleRoot: HTMLElement;
  if (root === document) {
    styleRoot = document.documentElement;
  } else if (root instanceof ShadowRoot) {
    styleRoot = root.host as HTMLElement;
  } else {
    styleRoot = root as HTMLElement;
  }

  applyThemeToTarget(styleRoot, next);

  if (isGlobalRoot) {
    for (const host of registeredHosts) {
      try {
        applyThemeToTarget(host, next);
      } catch {
        // no-op
      }
    }
  }
}
