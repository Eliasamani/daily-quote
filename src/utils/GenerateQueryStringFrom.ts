const generateQueryStrFrom = (params: Record<string, any>): string => {
    const query = new URLSearchParams(params).toString();
    return query ? `?${query}` : "";
};

export default generateQueryStrFrom;