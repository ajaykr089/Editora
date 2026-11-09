import React from 'react';
import { Breadcrumb } from '@editora/ui-react/Breadcrumb';
import { Button } from '@editora/ui-react/Button';
import { Card } from '@editora/ui-react/Card';
import { EmptyState } from '@editora/ui-react/EmptyState';
import { Input } from '@editora/ui-react/Input';
import { PageHeader } from '@editora/ui-react/PageHeader';
import { Select } from '@editora/ui-react/Select';
import { Skeleton } from '@editora/ui-react/Skeleton';
import { Switch } from '@editora/ui-react/Switch';
import { TagsInput } from '@editora/ui-react/TagsInput';
import { toastApi } from '@editora/ui-react/ToastAPI';
import { getArticle, saveArticle, type Article } from '../../../shared/data';
import { navigate, useTitle } from '../lib/router';
import { RichText } from '../lib/RichText';

const CATEGORIES = ['Shipping', 'Returns', 'Product care', 'Payments', 'Wholesale', 'Stories'];
const STARTER = '<h2>A heading for the first section</h2><p>Start with the one thing a reader should take away.</p>';

const words = (html: string) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

/** A post editor: the full Editora toolbar for the body, and post settings beside it. */
export function JournalEditor({ id }: { id: string | null }) {
  const [article, setArticle] = React.useState<Partial<Article> | null | undefined>(id ? undefined : { title: '', html: STARTER, status: 'draft', category: 'Stories', tags: [] });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState<'draft' | 'published' | null>(null);
  const [dirty, setDirty] = React.useState(false);
  useTitle(article?.title || (id ? 'Post' : 'New post'));

  React.useEffect(() => {
    if (id) getArticle(id).then(setArticle);
  }, [id]);

  // Leaving with unsaved changes asks first.
  React.useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (article === null) {
    return <div className="lk-screen lk-screen-narrow"><EmptyState title="Post not found" actionLabel="All posts" onAction={() => navigate('/journal')} /></div>;
  }

  const patch = (next: Partial<Article>) => { setArticle((a) => ({ ...a, ...next })); setDirty(true); };

  const save = async (status: 'draft' | 'published') => {
    if (!article) return;
    setSaving(status);
    const result = await saveArticle({ ...article, title: article.title || '', html: article.html || '', status });
    setSaving(null);
    if (!result.ok) {
      setErrors(result.errors);
      toastApi.error('Not saved: check the highlighted fields.');
      return;
    }
    setErrors({});
    setDirty(false);
    setArticle(result.article);
    toastApi.success(status === 'published' ? 'Published' : 'Draft saved');
    if (!id) navigate(`/journal/${result.article.id}`);
  };

  return (
    <div className="lk-screen">
      <Breadcrumb>
        <Breadcrumb.Item href="#/journal">Journal</Breadcrumb.Item>
        <Breadcrumb.Item>{id ? article?.title || 'Post' : 'New post'}</Breadcrumb.Item>
      </Breadcrumb>
      <PageHeader
        title={id ? 'Edit post' : 'New post'}
        subtitle={article ? `${words(article.html || '')} words${dirty ? ' · unsaved changes' : ''}` : 'Loading'}
        actions={
          <>
            <Button variant="secondary" loading={saving === 'draft'} disabled={!!saving || !article} onClick={() => save('draft')}>Save draft</Button>
            <Button icon="send" loading={saving === 'published'} disabled={!!saving || !article} onClick={() => save('published')}>{article?.status === 'published' ? 'Update' : 'Publish'}</Button>
          </>
        }
      />

      <div className="lk-aside-layout">
        <div className="lk-stack">
          {article ? (
            <>
              <Input label="Title" value={article.title || ''} onChange={(title) => patch({ title })} placeholder="Caring for linen" error={errors.title} size="lg" />
              <div className="lk-field">
                <span className="lk-field-label" id="post-body-label">Body</span>
                <RichText
                  className="lk-editor lk-editor-full" labelledBy="post-body-label"
                  variant="full"
                  value={article.html || ''}
                  onChange={(html) => patch({ html })}
                  placeholder="Write the post…"
                  minHeight={420}
                />
                {errors.html ? <span className="lk-field-error" role="alert">{errors.html}</span> : null}
              </div>
            </>
          ) : <Skeleton height="520px" />}
        </div>

        <div className="lk-stack">
          <Card>
            <Card.Header><Card.Title as="h2">Post settings</Card.Title></Card.Header>
            {article ? (
              <div className="lk-stack">
                <Input label="URL" value={article.slug || ''} onChange={(slug) => patch({ slug })} placeholder="made-from-the-title" error={errors.slug}>
                  <Input.Prefix>/journal/</Input.Prefix>
                </Input>
                <Select label="Category" value={article.category || 'Stories'} onChange={(category) => patch({ category })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
                <TagsInput label="Tags" value={article.tags || []} onChange={(tags) => patch({ tags })} description="Press Enter after each tag." />
                <Switch label="Show in the help centre" description="Also list this post under Help." checked={article.category !== 'Stories'} onChange={() => {}} />
              </div>
            ) : <Skeleton height="220px" />}
          </Card>
          <Card>
            <Card.Header><Card.Title as="h2">Preview</Card.Title><Card.Description>How the post reads on the store.</Card.Description></Card.Header>
            <div className="lk-rich lk-preview" dangerouslySetInnerHTML={{ __html: `<h1>${(article?.title || 'Untitled').replace(/</g, '&lt;')}</h1>${article?.html || ''}` }} />
          </Card>
        </div>
      </div>
    </div>
  );
}
