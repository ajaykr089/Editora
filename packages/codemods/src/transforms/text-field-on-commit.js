import ts from 'typescript';

/**
 * @editora/ui-react 0.2.0: `onChange` on Input and Textarea fires on every keystroke, as React's
 * <input> does. It used to fire when the edit was committed (blur or Enter); that is now
 * `onCommit`. Renaming `onChange` to `onCommit` keeps what the code did before.
 *
 * Only JSX for Input and Textarea imported from @editora/ui-react (the package root, `/client`, or
 * the `/Input` and `/Textarea` entries) is changed; other components named Input are left alone.
 */
export const name = 'text-field-on-commit';
export const description = 'Input and Textarea: rename onChange to onCommit to keep firing when an edit is committed (ui-react 0.2.0).';

const COMPONENTS = new Set(['Input', 'Textarea']);
const ROOT_SOURCES = new Set(['@editora/ui-react', '@editora/ui-react/client']);
const ENTRY_SOURCE = /^@editora\/ui-react\/(Input|Textarea)$/;

function scriptKind(filePath) {
  if (/\.tsx$/i.test(filePath)) return ts.ScriptKind.TSX;
  if (/\.ts$/i.test(filePath) || /\.[mc]ts$/i.test(filePath)) return ts.ScriptKind.TS;
  return ts.ScriptKind.JSX;
}

/**
 * @param {string} source
 * @param {string} filePath
 * @returns {{ output: string, changes: number, warnings: string[] }}
 */
export function transform(source, filePath = 'file.tsx') {
  if (!source.includes('@editora/ui-react')) return { output: source, changes: 0, warnings: [] };
  const file = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, scriptKind(filePath));

  /** local identifier -> component name */
  const locals = new Map();
  /** namespace imports: `import * as UI from '@editora/ui-react'` */
  const namespaces = new Set();

  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const from = statement.moduleSpecifier.text;
    const clause = statement.importClause;
    if (!clause || clause.isTypeOnly) continue;
    const entry = ENTRY_SOURCE.exec(from);
    if (entry && clause.name) locals.set(clause.name.text, entry[1]);
    if (!ROOT_SOURCES.has(from) && !entry) continue;
    const bindings = clause.namedBindings;
    if (bindings && ts.isNamespaceImport(bindings)) {
      if (ROOT_SOURCES.has(from)) namespaces.add(bindings.name.text);
    } else if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) {
        if (element.isTypeOnly) continue;
        const imported = (element.propertyName || element.name).text;
        if (COMPONENTS.has(imported)) locals.set(element.name.text, imported);
      }
    }
  }
  if (!locals.size && !namespaces.size) return { output: source, changes: 0, warnings: [] };

  const component = (tag) => {
    if (ts.isIdentifier(tag)) return locals.get(tag.text) || null;
    if (ts.isPropertyAccessExpression(tag) && ts.isIdentifier(tag.expression) && namespaces.has(tag.expression.text)) {
      return COMPONENTS.has(tag.name.text) ? tag.name.text : null;
    }
    return null;
  };

  /** @type {{ start: number, end: number, text: string }[]} */
  const edits = [];
  const warnings = [];
  const where = (node) => {
    const { line, character } = file.getLineAndCharacterOfPosition(node.getStart(file));
    return `${filePath}:${line + 1}:${character + 1}`;
  };

  const visit = (node) => {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const target = component(node.tagName);
      if (target) {
        const attributes = node.attributes.properties;
        const named = (attrName) => attributes.find((attr) => ts.isJsxAttribute(attr) && attr.name.getText(file) === attrName);
        const onChange = named('onChange');
        if (onChange && named('onCommit')) {
          warnings.push(`${where(onChange)} ${target} has both onChange and onCommit: onChange now fires on every keystroke. Check it by hand.`);
        } else if (onChange) {
          edits.push({ start: onChange.name.getStart(file), end: onChange.name.getEnd(), text: 'onCommit' });
        }
        if (attributes.some((attr) => ts.isJsxSpreadAttribute(attr)) && !onChange) {
          warnings.push(`${where(node)} ${target} spreads props: if they include onChange, it now fires on every keystroke (use onCommit for the old behaviour).`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);

  let output = source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    output = output.slice(0, edit.start) + edit.text + output.slice(edit.end);
  }
  return { output, changes: edits.length, warnings };
}
