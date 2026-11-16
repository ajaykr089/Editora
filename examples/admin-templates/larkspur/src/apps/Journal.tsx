import React from 'react';
import { Badge } from '@editora/ui-react/Badge';
import { Button } from '@editora/ui-react/Button';
import { DataTable } from '@editora/ui-react/DataTable';
import { FiltersBar } from '@editora/ui-react/FiltersBar';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { ARTICLE_TONE, listArticles, shortDate } from '../../../shared/data';
import { useLoad } from '../lib/ui';
import { navigate, useTitle } from '../lib/router';

const STATUS_LABEL = { published: 'Published', draft: 'Draft', review: 'In review' } as const;

/** The journal (blog / help articles): a list that opens each post in the editor. */
export function Journal() {
  useTitle('Journal');
  const [query, setQuery] = React.useState('');
  const [status, setStatus] = React.useState('');
  const { data, loading } = useLoad(() => listArticles(query, status), [query, status]);

  return (
    <div className="lk-screen">
      <PageHeader title="Journal" subtitle="Stories and care guides for the store. Written in the Editora editor." actions={<Button icon="pencil" onClick={() => navigate('/journal/new')}>Write a post</Button>} />
      <FiltersBar
        search={query}
        onSearchChange={setQuery}
        searchPlaceholder="Title or category"
        status={status}
        statusOptions={Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }))}
        statusPlaceholder="Any status"
        onStatusChange={setStatus}
        clearDisabled={!query && !status}
        onClear={() => { setQuery(''); setStatus(''); }}
      />
      <DataTable hover sortable aria-label="Journal posts" state={loading ? 'loading' : 'idle'} emptyText="No posts match.">
        <table>
          <thead>
            <tr>
              <th data-key="title" style={{ width: '42%' }}>Post</th>
              <th data-key="author" style={{ width: '18%' }}>Author</th>
              <th data-key="updated" style={{ width: '14%' }}>Updated</th>
              <th data-key="views" data-align="end" style={{ width: '12%' }}>Views</th>
              <th data-key="status" style={{ width: '14%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((article) => (
              <tr key={article.id} data-id={article.id} data-href={`#/journal/${article.id}`}>
                <td><a className="cell-title row-link" href={`#/journal/${article.id}`}>{article.title}</a><span className="cell-sub">{article.category} · /{article.slug}</span></td>
                <td>{article.author}</td>
                <td data-value={article.updated}>{shortDate(article.updated)}</td>
                <td data-align="end" data-value={article.views}>{article.views.toLocaleString('en-US')}</td>
                <td><Badge tone={ARTICLE_TONE[article.status]} variant="soft" size="sm">{STATUS_LABEL[article.status]}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  );
}
