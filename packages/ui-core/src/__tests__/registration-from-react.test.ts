import '@editora/ui-react';

describe('cross-package registration', () => {
  it('registers ui-button when @editora/ui-react is imported', () => {
    const ctor = (global as any).customElements.get('ui-button');
    expect(ctor).toBeDefined();
  });
});