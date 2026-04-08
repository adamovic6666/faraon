import { SearchProduct, searchProductsMock } from "@/data/search-products";

const SEARCH_DELAY_MS = 350;
const MIN_SEARCH_LENGTH = 2;

export const getMinSearchLength = () => MIN_SEARCH_LENGTH;

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const searchProducts = async (
  rawQuery: string,
): Promise<SearchProduct[]> => {
  const query = rawQuery.trim().toLowerCase();

  if (query.length < MIN_SEARCH_LENGTH) {
    return [];
  }

  await sleep(SEARCH_DELAY_MS);

  return searchProductsMock.filter((product) =>
    product.title.toLowerCase().includes(query),
  );
};