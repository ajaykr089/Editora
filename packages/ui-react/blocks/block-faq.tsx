// block: A frequently asked questions section: an accordion of questions with a contact link.
import * as React from 'react';
import { Accordion, Box, Heading, Text } from '@editora/ui-react';

const LINK: React.CSSProperties = { color: 'inherit', textDecoration: 'underline' };

export type FaqItem = { question: string; answer: React.ReactNode };

export type FaqBlockProps = {
  title?: string;
  items?: FaqItem[];
  contactHref?: string;
};

const DEFAULT_ITEMS: FaqItem[] = [
  { question: 'Can I use it for free?', answer: 'Yes. The core packages are MIT licensed and free for commercial use.' },
  { question: 'Does it work without React?', answer: 'Yes. The components are web components; React, Vue, Svelte and Angular can all use them.' },
  { question: 'How do I theme it?', answer: 'Set the --ui-* design tokens, or use the Tailwind preset. Dark mode comes with the default theme.' },
  { question: 'Can I edit the component code?', answer: 'Copy any component into your project with editora add <name> --copy, then change it as you like.' },
];

/** Questions and answers in an accordion. */
export function FaqBlock({ title = 'Frequently asked questions', items = DEFAULT_ITEMS, contactHref = '#contact' }: FaqBlockProps) {
  return (
    <section aria-labelledby="faq-title" style={{ display: 'grid', gap: 16, maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <Heading level={2} size="2xl" id="faq-title">{title}</Heading>
      <Accordion collapsible>
        {items.map((item) => (
          <Accordion.Item key={item.question}>
            <Accordion.Trigger>{item.question}</Accordion.Trigger>
            <Accordion.Panel>{typeof item.answer === 'string' ? <Text>{item.answer}</Text> : item.answer}</Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Text variant="muted">Still have a question? <a href={contactHref} style={LINK}>Get in touch</a>.</Text>
    </section>
  );
}

export default FaqBlock;
