import type { MediaItem, MediaPage, MediaProvider, StockPhoto, StockProvider } from '../../types/media';

/** The credit that goes under a stock photo: the provider's, or "Photo by <author> on <service>". */
export const creditFor = (stock: StockProvider, photo: StockPhoto): string | null => {
  if (stock.caption === false) return null;
  if (typeof stock.caption === 'function') return stock.caption(photo)?.trim() || null;
  return photo.author ? `Photo by ${photo.author} on ${stock.name}` : null;
};

export const photoToItem = (stock: StockProvider, photo: StockPhoto): MediaItem => ({
  id: `stock-${photo.id}`,
  name: photo.description?.trim() || photo.author || `Photo ${photo.id}`,
  type: 'image',
  src: photo.url,
  thumbnailUrl: photo.thumbnailUrl,
  size: 0,
  width: photo.width,
  height: photo.height,
  mime: 'image/jpeg',
  createdAt: 0,
  alt: photo.description?.trim() || undefined,
  metadata: { stock: true, caption: creditFor(stock, photo), sourceUrl: photo.sourceUrl, author: photo.author },
});

/**
 * A stock service as something the library grid can list. Services rarely say how many results there are in all,
 * so when a page comes back full there is taken to be one more page.
 */
export const stockAsList = (stock: StockProvider): Pick<MediaProvider, 'list'> => ({
  async list(query = {}, context = {}): Promise<MediaPage> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 24;
    const result = await stock.search({ search: query.search ?? '', page, limit }, { signal: context.signal });
    const items = result.items.map((photo) => photoToItem(stock, photo));
    const seen = (page - 1) * limit + items.length;
    return { items, total: result.total ?? seen + (items.length >= limit ? 1 : 0) };
  },
});
