describe('@editora/ui-react registration', () => {
  it('registers ui-button custom element during module import', async () => {
    await import('../index');
    const ctor = (global as any).customElements.get('ui-button');
    expect(ctor).toBeDefined();
  });
});
