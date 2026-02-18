import '@editora/ui-react';

describe('@editora/ui-react registration', () => {
  it('registers ui-button custom element when package is imported', () => {
    const ctor = (global as any).customElements.get('ui-button');
    expect(ctor).toBeDefined();
  });
});