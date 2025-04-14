import { processFetchReq } from "../../utils";

const QUOTABLE_BASE_LINK = "https://api.quotable.kurokeita.dev/api";

// Helper function to convert params into a query string
const generateQueryStrFrom = (params: Record<string, any>): string => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
};

export type Quote = {
  _id: string;
  content: string;
  author: string;
  tags?: string[];
};

// Function to fetch quotes
export const getQuotes = async (
  params?: Record<string, any>
): Promise<Quote[]> => {
  let url = `${QUOTABLE_BASE_LINK}/quotes`;
  if (params) {
    url += generateQueryStrFrom(params);
  }
  return processFetchReq(url);
};
