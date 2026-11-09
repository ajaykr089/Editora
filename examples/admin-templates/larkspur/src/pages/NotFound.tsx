import { Button } from '@editora/ui-react/Button';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { navigate, useTitle } from '../lib/router';

export function NotFound({ path }: { path: string }) {
  useTitle('Page not found');
  return (
    <div className="lk-screen lk-screen-narrow lk-not-found">
      <p className="lk-404" aria-hidden="true">404</p>
      <h1 className="sr-only">Page not found</h1>
      <EmptyState title="This page does not exist" description={`Nothing lives at ${path}. It may have moved, or the link has a typo.`}>
        <div className="lk-actions lk-center">
          <Button variant="secondary" onClick={() => window.history.back()}>Go back</Button>
          <Button onClick={() => navigate('/')}>Dashboard</Button>
        </div>
      </EmptyState>
    </div>
  );
}
