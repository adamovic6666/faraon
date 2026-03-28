export type CategoryItem = {
  id: number;
  title: string;
  count: number;
  icon: string;
  badge?: "Novo" | "Popularno";
  href: string;
};