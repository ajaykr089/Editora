import { renderIconSvg, type IconRenderOptions } from '@editora/icons';

const samples: Array<[label: string, name: string, options: IconRenderOptions]> = [
  ['default', 'bell', {}],
  ['size: 40', 'bell', { size: 40 }],
  ['color', 'bell', { size: 40, color: '#2563eb' }],
  ['iconWeight: thin', 'bell', { size: 40, iconWeight: 'thin' }],
  ['iconWeight: bold', 'bell', { size: 40, iconWeight: 'bold' }],
  ['strokeWidth: 2.5', 'bell', { size: 40, strokeWidth: 2.5 }],
  ['variant: solid', 'bell', { size: 40, variant: 'solid', color: '#2563eb' }],
  ['variant: duotone', 'shield', { size: 40, variant: 'duotone', color: '#2563eb', secondaryColor: '#93c5fd' }],
  ['arrow-right', 'arrow-right', { size: 40 }],
  ['rotate: 90', 'arrow-right', { size: 40, rotate: 90 }],
  ['flip: horizontal', 'arrow-right', { size: 40, flip: 'horizontal' }],
  ['rtl: true', 'arrow-right', { size: 40, rtl: true }],
];

document.getElementById('editor')!.innerHTML = `
  <style>
    .samples { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
    .samples figure { display: grid; grid-template-rows: 40px auto; justify-items: center; align-items: center; gap: 12px; margin: 0; padding: 16px 8px 12px; border: 1px solid #d0d7de; border-radius: 10px; color: #24292f; }
    .samples figcaption { font: 12px ui-monospace, monospace; color: #57606a; }
  </style>
  <div class="samples">
    ${samples.map(([label, name, options]) => `<figure>${renderIconSvg(name, options)}<figcaption>${label}</figcaption></figure>`).join('')}
  </div>`;
