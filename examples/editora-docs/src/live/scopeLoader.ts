// Loads the packages a live code block needs, on demand, in the browser.
//
// The @editora packages used to be required straight from ReactLiveScope,
// which put the whole ui-react barrel into the JavaScript of every docs page,
// live block or not. Each group below is its own webpack chunk instead, and a
// block loads only the groups its code mentions: a ui-react demo never
// downloads the editor, and a page without live blocks downloads nothing.
//
// The packages also define custom elements at import time (`class X extends
// HTMLElement`), which throws under Node, so nothing here may run during
// `docusaurus build`: callers only reach these loaders from an effect.

export type LiveScope = Record<string, unknown>;

type Group = {
  name: string;
  // Does this block's code need the group?
  test: (code: string) => boolean;
  load: () => Promise<LiveScope>;
  // Replace names already in the scope (otherwise the group only adds names).
  override?: boolean;
};

const groups: Group[] = [
  {
    // ui-react and react-icons: what the component docs use.
    name: 'ui',
    test: () => true,
    override: true,
    load: () => import(/* webpackChunkName: "live-scope-ui" */ './scopes/ui').then((m) => m.default),
  },
  {
    // The React editor with every plugin factory (BoldPlugin(), TablePlugin()...).
    name: 'editor',
    test: (code) => /\b(EditoraEditor|RichTextEditor)\b|\b[A-Z]\w*Plugin\s*\(/.test(code),
    load: () =>
      import(/* webpackChunkName: "live-scope-editor" */ './scopes/editor').then((m) => m.ready.then(() => m.default)),
  },
  {
    // @editora/toast/react: its `toast` takes JSX, and it has <Toaster />.
    // ui-react exports a `toast` of its own (the text-only one), which every
    // other block keeps.
    name: 'toast-react',
    test: (code) => /\bToaster\b|toast\.custom\(/.test(code),
    load: () => import(/* webpackChunkName: "live-scope-toast" */ './scopes/toastReact').then((m) => m.default),
    override: true,
  },
  {
    // The <editora-editor> custom element.
    name: 'webcomponent',
    test: (code) => code.includes('editora-editor'),
    load: () =>
      import(/* webpackChunkName: "live-scope-webcomponent" */ './scopes/webcomponent').then((m) =>
        m.ready.then(() => m.default),
      ),
  },
];

const loaded = new Map<string, Promise<LiveScope>>();

function loadGroup(group: Group): Promise<LiveScope> {
  let promise = loaded.get(group.name);
  if (!promise) {
    promise = group.load();
    // A failed chunk (offline, a deploy replaced the files) may be retried.
    promise.catch(() => loaded.delete(group.name));
    loaded.set(group.name, promise);
  }
  return promise;
}

// Groups merge in the order above. ui-react's exports are the names the
// component docs expect, so a group replaces names already in the scope only
// when it says so (`override`); otherwise it just adds the names it owns.
export async function loadScope(code: string, base: LiveScope): Promise<LiveScope> {
  const wanted = groups.filter((g) => g.test(code));
  const parts = await Promise.all(wanted.map(loadGroup));
  const merged: LiveScope = { ...base };
  wanted.forEach((group, i) => {
    for (const [key, value] of Object.entries(parts[i])) {
      if (group.override || !(key in merged)) merged[key] = value;
    }
  });
  return merged;
}
