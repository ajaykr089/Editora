export function makeMediaResizable() {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
      target.setAttribute('contenteditable', 'false');
      target.style.resize = 'both';
      target.style.overflow = 'auto';
      target.style.display = 'inline-block';
    }
  });
}
