/**
 * Apply a theme to an element
 */
declare function applyTheme(element: HTMLElement, themeName: ThemeName): void;
/**
 * Get CSS content for a theme
 */
declare function getThemeCSS(themeName: ThemeName): string;
/**
 * Set global theme for the document
 */
declare function setGlobalTheme(themeName: ThemeName): void;
/**
 * Get the current theme
 */
declare function getCurrentTheme(): ThemeName;
/**
 * Toggle between light and dark themes
 */
declare function toggleTheme(): ThemeName;
/**
 * Check if dark theme is active
 */
declare function isDarkTheme(): boolean;
/**
 * Check if light theme is active
 */
declare function isLightTheme(): boolean;

/**
 * Available theme presets
 */
declare const themes: {
    readonly light: "light";
    readonly dark: "dark";
};
type ThemeName = keyof typeof themes;

export { applyTheme, getCurrentTheme, getThemeCSS, isDarkTheme, isLightTheme, setGlobalTheme, themes, toggleTheme };
export type { ThemeName };
