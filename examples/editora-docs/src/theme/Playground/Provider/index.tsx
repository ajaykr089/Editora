import React, { useEffect, useState, type ReactNode } from 'react';
import { LiveProvider } from 'react-live';
import { usePrismTheme } from '@docusaurus/theme-common';
import { loadScope, type LiveScope } from '@site/src/live/scopeLoader';

// The theme's Playground/Provider, plus: each block loads the @editora
// packages its code uses (src/live/scopeLoader.ts) before its preview runs.
//
// Until that scope is in, the preview runs a placeholder instead of the
// block's code: against the bare React scope it would only flash
// "ThemeProvider is not defined". react-live runs the code again when `scope`
// or `transformCode` change, so the real preview follows as soon as the chunks
// arrive. The editor stays read-only meanwhile, since react-live would then
// re-run the original code over an edit made before the scope arrived.
//
// The transforms are module constants: react-live re-runs on every new
// transformCode identity (facebook/docusaurus#9630).
const DEFAULT_TRANSFORM_CODE = (code: string) => `${code};`;
const LOADING = '<div>Loading...</div>';
const FAILED = '<div role="alert">This example could not load. Reload the page to try again.</div>';
const LOADING_INLINE = () => LOADING;
const LOADING_NO_INLINE = () => `render(${LOADING});`;
const FAILED_INLINE = () => FAILED;
const FAILED_NO_INLINE = () => `render(${FAILED});`;

type Props = {
  code?: string;
  children?: ReactNode;
  metastring?: string;
  scope?: LiveScope;
  transformCode?: (code: string) => string;
  [key: string]: unknown;
};

export default function PlaygroundProvider({ code, children, ...props }: Props) {
  const prismTheme = usePrismTheme();
  const noInline = props.metastring?.includes('noInline') ?? false;
  const source = code?.replace(/\n$/, '') ?? '';
  const [state, setState] = useState<{ scope?: LiveScope; failed?: boolean }>({});

  useEffect(() => {
    let active = true;
    loadScope(source, props.scope ?? {}).then(
      (scope) => active && setState({ scope }),
      (error) => {
        console.error('Live example: could not load its packages', error);
        if (active) setState({ failed: true });
      },
    );
    return () => {
      active = false;
    };
    // A block's source and base scope are fixed for the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  const transformCode = state.scope
    ? (props.transformCode ?? DEFAULT_TRANSFORM_CODE)
    : state.failed
      ? (noInline ? FAILED_NO_INLINE : FAILED_INLINE)
      : (noInline ? LOADING_NO_INLINE : LOADING_INLINE);

  return (
    <LiveProvider
      noInline={noInline}
      theme={prismTheme}
      {...props}
      scope={state.scope ?? props.scope}
      code={source}
      transformCode={transformCode}
      disabled={!state.scope || Boolean(props.disabled)}>
      {children}
    </LiveProvider>
  );
}
