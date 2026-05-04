"use server";

import { SearchProduct } from "@/data/search-products";

const MIN_SEARCH_LENGTH = 2;

// Server action that handles search API calls with server-only env vars
export const searchProducts = async (
  query: string,
  isDropdown: boolean = false
): Promise<SearchProduct[]> => {
  if (query.length < MIN_SEARCH_LENGTH) {
    return [];
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BASE_URL || "";
    const hash = process.env.API_HASH || "";

    if (!hash) {
      console.error("API_HASH not configured");
      return [];
    }

    // Encode hash with special characters correctly preserved
    const encodedHash = encodeURIComponent(hash).replace(
      /[!'()*]/g,
      (c) => "%" + (c.codePointAt(0) ?? 0).toString(16).toUpperCase()
    );

    const url =
      `${apiUrl}/api/v1/search` +
      `?q=${encodeURIComponent(query)}` +
      `&cc=${encodedHash}` +
      (isDropdown ? "&type=dropdown" : "");


    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(
        `Search API returned ${response.status}: ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Search API error:", error);
    return [];
  }
};
