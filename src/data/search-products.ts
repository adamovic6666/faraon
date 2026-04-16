export interface SearchResult {
  id: string | number;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  category?: string;
  slug?: string;
}

export type SearchProduct = SearchResult;
