import { listIconAliases, listIcons, renderIconSvg } from '@editora/icons';

const names = listIcons();

// Every alias points at an icon: 'tick' and 'done' are other names for 'check'.
const aliasesOf = new Map<string, string[]>();
for (const [alias, target] of Object.entries(listIconAliases())) {
  aliasesOf.set(target, [...(aliasesOf.get(target) ?? []), alias]);
}

const root = document.getElementById('editor')!;
root.innerHTML = `
  <style>
    .catalog input { box-sizing: border-box; width: 100%; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 8px; font: 15px system-ui, sans-serif; }
    .catalog .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); grid-auto-rows: 76px; gap: 8px; max-height: 328px; margin-top: 12px; overflow: auto; }
    .catalog .cell { display: grid; justify-items: center; align-content: center; gap: 8px; min-width: 0; border-radius: 8px; color: #24292f; background: #f6f8fa; font: 11px ui-monospace, monospace; }
    .catalog .cell span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  </style>
  <div class="catalog">
    <input type="search" placeholder="Search ${names.length} icons" aria-label="Search icons" />
    <div class="grid"></div>
  </div>`;

const grid = root.querySelector('.grid')!;
const show = (query: string) => {
  const q = query.trim().toLowerCase();
  const matches = names.filter((name) => !q || name.includes(q) || (aliasesOf.get(name) ?? []).some((alias) => alias.includes(q)));
  grid.innerHTML = matches
    .map((name) => `<div class="cell" title="${name}">${renderIconSvg(name, { size: 28 })}<span>${name}</span></div>`)
    .join('');
};

root.querySelector('input')!.addEventListener('input', (event) => show((event.target as HTMLInputElement).value));
show('');
