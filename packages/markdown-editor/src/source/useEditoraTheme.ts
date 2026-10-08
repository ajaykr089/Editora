import { useEffect, useState, type RefObject } from 'react';

export type EditoraTheme = 'light' | 'dark';

/** The selectors `@editora/themes` recognises for its dark theme. */
export const DARK_THEME_SELECTOR = '.dark, [data-theme="dark"], .editora-theme-dark';

export const readEditoraTheme = (element: Element | null): EditoraTheme =>
  element?.closest(DARK_THEME_SELECTOR) ? 'dark' : 'light';

/**
 * The Editora theme in effect for an element. The editors that draw themselves from `--rte-*` variables
 * follow a dark class on any ancestor by themselves; the code editor has its own light and dark palettes,
 * so it has to be told. This watches the element's ancestors, so toggling the class at runtime is picked up.
 */
export function useEditoraTheme(ref: RefObject<HTMLElement>): EditoraTheme {
  const [theme, setTheme] = useState<EditoraTheme>('light');

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => setTheme(readEditoraTheme(element));
    update();

    if (typeof MutationObserver === 'undefined') return undefined;
    const observer = new MutationObserver(update);
    for (let node: HTMLElement | null = element; node; node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    }
    return () => observer.disconnect();
  }, [ref]);

  return theme;
}
