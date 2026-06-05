export interface SearchResult {
  id: string | number;
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  main_photo?: string;
  product_code?: string;
  sku?: string;
  product_id?: string;
  cena?: string | number;
  akcijska_cena?: string | number | null;
  category?: string;
  slug?: string;
  tags?: string[];
  packaging?: string;
}

export type SearchProduct = SearchResult;
