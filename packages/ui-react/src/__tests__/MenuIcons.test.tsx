import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Dropdown } from '../components/Dropdown';
import { Menu } from '../components/Menu';

describe('menu item icon names', () => {
  it('draws icon="settings" as an Editora icon in Dropdown.Item and Menu.Item', () => {
    const { container } = render(
      <>
        <Dropdown><Dropdown.Content><Dropdown.Item icon="settings">Settings</Dropdown.Item></Dropdown.Content></Dropdown>
        <Menu><Menu.Content><Menu.Item icon="logout">Sign out</Menu.Item></Menu.Content></Menu>
      </>
    );
    const icons = Array.from(container.querySelectorAll('.icon ui-icon')).map((el) => el.getAttribute('name'));
    expect(icons).toEqual(['settings', 'logout']);
    expect(container.querySelector('.icon')!.textContent).toBe('');
  });
});
