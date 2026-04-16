export type CategoryItem = {
  id?: number;
  name: string;
  image: string;
  alias: string;
  metatags: {
    title: string;
    description: string;
  }
};