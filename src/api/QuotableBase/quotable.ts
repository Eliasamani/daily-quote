import { processFetchReq, generateQueryStrFrom } from "../../utils";

const QUOTABLE_BASE_LINK = "https://api.quotable.io";

export type Quote = {
    _id: string;
    content: string;
    author: string;
    tags?: string[];
};

// Function to fetch quotes
export const getQuotes = async (params?: Record<string, any>): Promise<Quote[]> => {
    let url = `${QUOTABLE_BASE_LINK}/quotes`;
    if (params) {
        url += generateQueryStrFrom(params);
    }
    return processFetchReq<Quote[]>(url);
};