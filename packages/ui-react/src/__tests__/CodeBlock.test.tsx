import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CodeBlock } from '../components/CodeBlock';
import { CodeSnippet } from '../components/CodeSnippet';

describe('Code surfaces', () => {
  it('renders code block metadata, actions, and code content', () => {
    render(
      <CodeBlock
        actions={<button type="button">Copy</button>}
        code={"npm install @editora/ui-react\nnpm run build"}
        description="Install and build"
        language="bash"
        title="Quick start"
      />
    );

    expect(screen.getByText('Quick start')).toBeTruthy();
    expect(screen.getByText('Install and build')).toBeTruthy();
    expect(screen.getByText('bash')).toBeTruthy();
    expect(screen.getByText('Copy')).toBeTruthy();
    expect(screen.getByText(/npm install @editora\/ui-react/)).toBeTruthy();
  });

  it('renders inline and block snippets', () => {
    const { container } = render(
      <>
        <CodeSnippet code="npm run dev" />
        <CodeSnippet block code={'const value = 42;'} />
      </>
    );

    expect(screen.getByText('npm run dev')).toBeTruthy();
    expect(screen.getByText('const value = 42;')).toBeTruthy();
    expect(container.querySelectorAll('code')).toHaveLength(2);
  });
});
