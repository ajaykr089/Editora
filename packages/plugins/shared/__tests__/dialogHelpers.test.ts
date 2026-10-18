import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { focusPanel, initDialogOverlay, keepPanelFocus, panelHasFocus } from '../dialogHelpers';

let editorField: HTMLElement;

/** What a plugin does: make the overlay, call the helper, fill it, attach it. */
function open(html: string, overlayAttrs: Record<string, string> = {}): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'plugin-overlay';
  Object.entries(overlayAttrs).forEach(([name, value]) => overlay.setAttribute(name, value));
  initDialogOverlay(overlay);
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  vi.advanceTimersByTime(5);
  return overlay;
}
const box = (overlay: HTMLElement) => overlay.firstElementChild as HTMLElement;
const key = (target: Element, init: KeyboardEventInit) => {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(event);
  return event;
};

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = '<div id="editor" contenteditable="true" tabindex="0">text</div>';
  editorField = document.getElementById('editor') as HTMLElement;
  editorField.focus();
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('dialog role and name', () => {
  it('gives the box a dialog role and says it is modal', () => {
    const overlay = open('<div class="box"><h3>Add Anchor</h3><input></div>');
    expect(box(overlay).getAttribute('role')).toBe('dialog');
    expect(box(overlay).getAttribute('aria-modal')).toBe('true');
  });

  it('names it from the heading, leaving out the close button in the heading bar', () => {
    const overlay = open('<div class="box"><div class="header">Insert Image <button aria-label="Close">×</button></div><input></div>');
    expect(box(overlay).getAttribute('aria-label')).toBe('Insert Image');
  });

  it('names it from an h2', () => {
    const overlay = open('<div class="box"><h2>Insert Math Formula</h2><textarea></textarea></div>');
    expect(box(overlay).getAttribute('aria-label')).toBe('Insert Math Formula');
  });

  it('leaves a role and a name the plugin already gave it', () => {
    const overlay = open('<div class="box" role="dialog" aria-label="Mine"><h3>Other</h3><input></div>');
    expect(box(overlay).getAttribute('aria-label')).toBe('Mine');
    expect(box(overlay).getAttribute('role')).toBe('dialog');
  });

  it('keeps an aria-labelledby that points at a real element', () => {
    const overlay = open('<div class="box" role="dialog" aria-labelledby="t"><h3 id="t">Real</h3><input></div>');
    expect(box(overlay).getAttribute('aria-labelledby')).toBe('t');
    expect(box(overlay).hasAttribute('aria-label')).toBe(false);
  });

  it('replaces an aria-labelledby that points at nothing', () => {
    const overlay = open('<div class="box" role="dialog" aria-labelledby="missing"><h3>Heading</h3><input></div>');
    expect(box(overlay).hasAttribute('aria-labelledby')).toBe(false);
    expect(box(overlay).getAttribute('aria-label')).toBe('Heading');
  });

  it('uses the overlay when the plugin put the role there', () => {
    const overlay = open('<div class="box"><div class="title">Preview Editor</div><button>OK</button></div>', { role: 'dialog' });
    expect(overlay.getAttribute('aria-label')).toBe('Preview Editor');
    expect(box(overlay).hasAttribute('role')).toBe(false);
  });

  it('adds no name when there is no heading to take one from', () => {
    const overlay = open('<div class="box"><input></div>');
    expect(box(overlay).getAttribute('role')).toBe('dialog');
    expect(box(overlay).hasAttribute('aria-label')).toBe(false);
  });
});

describe('dialog focus', () => {
  it('moves focus to the first field instead of leaving it behind the dialog', () => {
    open('<div class="box"><h3>Title</h3><input id="a"><input id="b"></div>');
    expect(document.activeElement?.id).toBe('a');
  });

  it('skips the close button at the top and starts at the first control after it', () => {
    open('<div class="box"><div><span>Title</span><button class="dlg-close" aria-label="Close">×</button></div><button id="go">Go</button></div>');
    expect(document.activeElement?.id).toBe('go');
  });

  it('skips a close button that is only a multiplication sign', () => {
    open('<div class="box"><button id="x">×</button><input id="field"></div>');
    expect(document.activeElement?.id).toBe('field');
  });

  it('does not move focus that the plugin has already put on one of its own fields', () => {
    const overlay = document.createElement('div');
    initDialogOverlay(overlay);
    overlay.innerHTML = '<div class="box"><input id="a"><input id="mine"></div>';
    document.body.appendChild(overlay);
    (overlay.querySelector('#mine') as HTMLElement).focus();
    vi.advanceTimersByTime(5);
    expect(document.activeElement?.id).toBe('mine');
  });

  it('ignores hidden and disabled controls', () => {
    open('<div class="box"><input type="hidden"><input id="off" disabled><div hidden><input id="hid"></div><input id="shown"></div>');
    expect(document.activeElement?.id).toBe('shown');
  });

  it('puts focus on the dialog itself when it has nothing to focus', () => {
    const overlay = open('<div class="box"><p>Just a message</p></div>');
    expect(document.activeElement).toBe(box(overlay));
    expect(box(overlay).getAttribute('tabindex')).toBe('-1');
  });

  it('copes with an overlay the plugin never attaches', () => {
    const overlay = document.createElement('div');
    initDialogOverlay(overlay);
    expect(() => vi.advanceTimersByTime(500)).not.toThrow();
    expect(document.activeElement).toBe(editorField);
  });
});

describe('keeping Tab inside the dialog', () => {
  const html = '<div class="box"><h3>T</h3><input id="first"><button id="mid">m</button><button id="last">l</button></div>';

  it('goes from the last control back to the first', () => {
    open(html);
    (document.getElementById('last') as HTMLElement).focus();
    const event = key(document.getElementById('last')!, { key: 'Tab' });
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('first');
  });

  it('goes from the first control back to the last with Shift+Tab', () => {
    open(html);
    const event = key(document.getElementById('first')!, { key: 'Tab', shiftKey: true });
    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement?.id).toBe('last');
  });

  it('leaves Tab between the controls in the middle to the browser', () => {
    open(html);
    (document.getElementById('mid') as HTMLElement).focus();
    expect(key(document.getElementById('mid')!, { key: 'Tab' }).defaultPrevented).toBe(false);
    expect(key(document.getElementById('mid')!, { key: 'Tab', shiftKey: true }).defaultPrevented).toBe(false);
  });

  it('brings focus back in when it has strayed outside the dialog', () => {
    open(html);
    editorField.focus();
    const overlay = document.querySelector('.plugin-overlay') as HTMLElement;
    key(overlay, { key: 'Tab' });
    expect(document.activeElement?.id).toBe('first');
  });

  it('does not touch other keys', () => {
    open(html);
    expect(key(document.getElementById('first')!, { key: 'a' }).defaultPrevented).toBe(false);
  });

  it('keeps focus on a dialog with nothing to tab to', () => {
    const overlay = open('<div class="box"><p>message</p></div>');
    expect(key(box(overlay), { key: 'Tab' }).defaultPrevented).toBe(true);
  });
});

describe('focus when the dialog closes', () => {
  const settle = async () => {
    await Promise.resolve();
    vi.advanceTimersByTime(5);
  };

  it('returns to where it was when the dialog is removed and the plugin did not refocus', async () => {
    const overlay = open('<div class="box"><input id="a"></div>');
    expect(document.activeElement?.id).toBe('a');
    overlay.remove();
    await settle();
    expect(document.activeElement).toBe(editorField);
  });

  it('leaves focus alone when the plugin has already put it somewhere', async () => {
    document.body.insertAdjacentHTML('beforeend', '<input id="elsewhere">');
    const overlay = open('<div class="box"><input id="a"></div>');
    const elsewhere = document.getElementById('elsewhere') as HTMLElement;
    overlay.remove();
    elsewhere.focus();
    await settle();
    expect(document.activeElement).toBe(elsewhere);
  });

  it('does not return focus to an element that has gone', async () => {
    const overlay = open('<div class="box"><input id="a"></div>');
    editorField.remove();
    overlay.remove();
    await settle();
    expect(document.activeElement).toBe(document.body);
  });
});

describe('the caret after a dialog that changed nothing', () => {
  const settle = async () => {
    await Promise.resolve();
    vi.advanceTimersByTime(5);
  };
  const place = (node: Node, offset: number) => {
    const range = document.createRange();
    range.setStart(node, offset);
    range.collapse(true);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
  };

  beforeEach(() => {
    editorField.innerHTML = '<p>Alpha beta gamma</p>';
  });

  const caret = () => {
    const range = window.getSelection()!.getRangeAt(0);
    return { text: range.startContainer.textContent, offset: range.startOffset };
  };

  it('puts the caret back where it was when the dialog is closed without changing the text', async () => {
    const text = editorField.querySelector('p')!.firstChild!;
    place(text, 11);
    const overlay = open('<div class="box"><input id="a"></div>');
    // The dialog's field has the focus now, and the selection went with it.
    place(document.getElementById('a')!.parentElement!, 0);
    overlay.remove();
    await settle();

    expect(document.activeElement).toBe(editorField);
    expect(caret()).toEqual({ text: 'Alpha beta gamma', offset: 11 });
  });

  it('puts a selection of text back, not only a caret', async () => {
    const text = editorField.querySelector('p')!.firstChild!;
    const range = document.createRange();
    range.setStart(text, 6);
    range.setEnd(text, 10);
    window.getSelection()!.removeAllRanges();
    window.getSelection()!.addRange(range);
    const overlay = open('<div class="box"><input id="a"></div>');
    place(document.getElementById('a')!.parentElement!, 0);
    overlay.remove();
    await settle();

    expect(window.getSelection()!.toString()).toBe('beta');
  });

  it('fixes a caret that the plugin itself moved to the start when it refocused the editor', async () => {
    const text = editorField.querySelector('p')!.firstChild!;
    place(text, 11);
    const overlay = open('<div class="box"><input id="a"></div>');
    overlay.remove();
    editorField.focus();
    place(editorField.querySelector('p')!.firstChild!, 0);
    await settle();

    expect(caret()).toEqual({ text: 'Alpha beta gamma', offset: 11 });
  });

  it('leaves the caret to the plugin when the dialog changed the text', async () => {
    const text = editorField.querySelector('p')!.firstChild!;
    place(text, 11);
    const overlay = open('<div class="box"><input id="a"></div>');
    // The plugin inserts something and puts the caret after it.
    editorField.querySelector('p')!.firstChild!.textContent = 'Alpha beta INSERTED gamma';
    overlay.remove();
    editorField.focus();
    place(editorField.querySelector('p')!.firstChild!, 18);
    await settle();

    expect(caret()).toEqual({ text: 'Alpha beta INSERTED gamma', offset: 18 });
  });

  it('does nothing when there was no selection in editable text to begin with', async () => {
    window.getSelection()!.removeAllRanges();
    const overlay = open('<div class="box"><input id="a"></div>');
    overlay.remove();
    await settle();

    expect(document.activeElement).toBe(editorField);
  });
});

describe('side panels', () => {
  let panel: HTMLElement;
  const make = (html: string) => {
    panel = document.createElement('aside');
    panel.innerHTML = html;
    document.body.appendChild(panel);
    return panel;
  };

  describe('focusPanel', () => {
    it('focuses the first control that is not the close button', () => {
      make('<button class="x-close" aria-label="Close panel">x</button><button id="first">Run</button><button id="second">More</button>');
      focusPanel(panel);
      expect(document.activeElement?.id).toBe('first');
    });

    it('falls back to the close button when it is the only control', () => {
      make('<button id="only" aria-label="Close">x</button>');
      focusPanel(panel);
      expect(document.activeElement?.id).toBe('only');
    });

    it('focuses the panel itself when it has nothing to focus', () => {
      make('<p>Nothing to do here</p>');
      focusPanel(panel);
      expect(document.activeElement).toBe(panel);
      expect(panel.getAttribute('tabindex')).toBe('-1');
    });

    it('ignores a missing or detached panel', () => {
      expect(() => focusPanel(null)).not.toThrow();
      const detached = document.createElement('div');
      expect(() => focusPanel(detached)).not.toThrow();
      expect(document.activeElement).toBe(editorField);
    });
  });

  describe('panelHasFocus', () => {
    it('says whether the focus is in the panel', () => {
      make('<button id="inside">in</button>');
      expect(panelHasFocus(panel)).toBe(false);
      document.getElementById('inside')!.focus();
      expect(panelHasFocus(panel)).toBe(true);
      expect(panelHasFocus(null)).toBe(false);
    });
  });

  describe('keepPanelFocus', () => {
    const rebuild = (html: string) => () => {
      panel.innerHTML = html;
    };
    const LIST = (n: number) =>
      '<button class="x-close" aria-label="Close">x</button>' +
      Array.from({ length: n }, (_, i) => `<button class="item-btn" data-action="ignore" data-id="w${i}">Ignore ${i}</button>`).join('');

    it('puts the focus on the same control of the rebuilt panel', () => {
      make(LIST(3));
      (panel.querySelectorAll('.item-btn')[1] as HTMLElement).focus();
      keepPanelFocus(panel, rebuild(LIST(3)));
      expect(document.activeElement?.getAttribute('data-id')).toBe('w1');
    });

    it('moves to the control that is now at that place when the one it was on has gone', () => {
      make('<button class="x-close" aria-label="Close">x</button><button class="item-btn" data-action="ignore">A</button><button class="item-btn" data-action="ignore">B</button>');
      (panel.querySelectorAll('.item-btn')[0] as HTMLElement).focus();
      // The first item was dealt with and left the list.
      keepPanelFocus(panel, rebuild('<button class="x-close" aria-label="Close">x</button><button class="item-btn" data-action="ignore">B</button>'));
      expect(document.activeElement?.textContent).toBe('B');
    });

    it('goes to the last control of that kind when there are fewer than before', () => {
      make(LIST(3));
      (panel.querySelectorAll('.item-btn')[2] as HTMLElement).focus();
      keepPanelFocus(panel, rebuild(LIST(1)));
      expect(document.activeElement?.getAttribute('data-id')).toBe('w0');
    });

    it('goes to the first control when no control of that kind is left', () => {
      make('<button id="keep">Keep</button><button class="item-btn" data-action="ignore">A</button>');
      (panel.querySelector('.item-btn') as HTMLElement).focus();
      keepPanelFocus(panel, rebuild('<button id="keep">Keep</button>'));
      expect(document.activeElement?.id).toBe('keep');
    });

    it('does not choose a control that is hidden, such as a button in a collapsed section', () => {
      make('<button id="top">Top</button><div hidden><button class="item-btn" data-action="ignore">Hidden</button></div><button class="item-btn" data-action="ignore">Shown</button>');
      // The focused one is the second of its kind; rebuilt, the one now at that place is in a collapsed section.
      (panel.querySelectorAll('.item-btn')[1] as HTMLElement).focus();
      keepPanelFocus(panel, rebuild('<button id="top">Top</button><div hidden><button class="item-btn" data-action="ignore">Hidden</button></div><button class="item-btn" data-action="ignore">Shown again</button>'));
      expect(document.activeElement?.textContent).toBe('Shown again');
    });

    it('falls back to the first control when every control of that kind is hidden', () => {
      make('<button id="top">Top</button><button class="item-btn" data-action="ignore">A</button>');
      (panel.querySelector('.item-btn') as HTMLElement).focus();
      keepPanelFocus(panel, rebuild('<button id="top">Top</button><div hidden><button class="item-btn" data-action="ignore">A</button></div>'));
      expect(document.activeElement?.id).toBe('top');
    });

    it('moves the focus off the panel itself and onto a control once the panel has contents', () => {
      make('<p>Loading</p>');
      focusPanel(panel);
      expect(document.activeElement).toBe(panel);
      keepPanelFocus(panel, rebuild('<button class="x-close" aria-label="Close">x</button><textarea id="note"></textarea>'));
      expect(document.activeElement?.id).toBe('note');
    });

    it('does not touch the focus when it was not in the panel', () => {
      make(LIST(2));
      keepPanelFocus(panel, rebuild(LIST(2)));
      expect(document.activeElement).toBe(editorField);
    });

    it('leaves the focus where it is when the rebuild keeps the focused element', () => {
      make(LIST(2));
      const kept = panel.querySelectorAll('.item-btn')[0] as HTMLElement;
      kept.focus();
      keepPanelFocus(panel, () => {
        panel.querySelectorAll('.item-btn')[1].textContent = 'changed';
      });
      expect(document.activeElement).toBe(kept);
    });

    it('copes with a null panel', () => {
      let ran = false;
      keepPanelFocus(null, () => {
        ran = true;
      });
      expect(ran).toBe(true);
    });
  });
});
