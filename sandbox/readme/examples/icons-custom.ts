import { hasIcon, iconToDataUri, registerIcon, renderIconSvg, type IconDefinition } from '@editora/icons';

// Nodes without a stroke or a fill are drawn as an outline in the icon's colour, so a few paths are enough.
const invoice: IconDefinition = {
  name: 'invoice',
  aliases: ['bill'],
  viewBox: '0 0 24 24',
  variants: {
    outline: {
      nodes: [
        { tag: 'path', attrs: { d: 'M6 3h12v18l-3-2-3 2-3-2-3 2z' } },
        { tag: 'line', attrs: { x1: 9, y1: 8, x2: 15, y2: 8 } },
        { tag: 'line', attrs: { x1: 9, y1: 12, x2: 15, y2: 12 } },
      ],
    },
  },
};

registerIcon(invoice);
console.log(hasIcon('invoice'), hasIcon('bill')); // true true

// As markup, by its name or by an alias...
const markup = renderIconSvg('bill', { size: 32, color: '#2563eb' });

// ...or as a data URI, for an <img> or a CSS background.
const uri = iconToDataUri('invoice', { size: 32, color: '#16a34a' });

document.getElementById('editor')!.innerHTML = `
  <div style="display: flex; align-items: center; gap: 24px">
    <span id="markup">${markup}</span>
    <img id="image" src="${uri}" width="32" height="32" alt="" />
    <span id="background" style="width: 32px; height: 32px; background: url('${uri}') center / contain no-repeat"></span>
  </div>`;
