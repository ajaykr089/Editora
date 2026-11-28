// block: A 404 page: what happened, a search box, and links back to safe places.
import * as React from 'react';
import { Box, Button, Flex, Heading, Input, Text } from '@editora/ui-react';

export type NotFoundBlockProps = {
  homeHref?: string;
  links?: Array<{ label: string; href: string }>;
  onSearch?: (query: string) => void;
};

/** A friendly "page not found" page. */
export function NotFoundBlock({ homeHref = '/', links = [{ label: 'Documentation', href: '/docs' }, { label: 'Status', href: '/status' }, { label: 'Contact support', href: '/support' }], onSearch }: NotFoundBlockProps) {
  return (
    <main style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24 }}>
      <div style={{ display: 'grid', gap: 16, maxWidth: 480, textAlign: 'center', justifyItems: 'center' }}>
        <Text size="sm" weight="bold" tone="brand">404</Text>
        <Heading level={1} size="2xl">We can't find that page</Heading>
        <Text variant="muted">It may have moved, or the link may be wrong. Search for it, or go somewhere you know.</Text>
        <form
          role="search"
          style={{ display: 'flex', gap: 8, width: '100%', alignItems: 'end' }}
          onSubmit={(event) => {
            event.preventDefault();
            onSearch?.(String(new FormData(event.currentTarget).get('q') || ''));
          }}
        >
          <div style={{ flex: 1 }}><Input name="q" type="search" label="Search the site" /></div>
          <Button type="submit" variant="secondary">Search</Button>
        </form>
        <Flex style={{ gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button href={homeHref}>Go home</Button>
          {links.map((link) => <a key={link.href} href={link.href} style={{ alignSelf: 'center', color: 'inherit', textDecoration: 'underline' }}>{link.label}</a>)}
        </Flex>
      </div>
    </main>
  );
}

export default NotFoundBlock;
