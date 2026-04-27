export type Product = {
  id: string | number;
  title: string;
  srcUrl: string;
  galleryImages?: string[];
  oldPrice?: number;
  price: number;
  slug?: string;
  category?: string;
  description?: string;
  tag?: string;
  packaging?: string;
};


