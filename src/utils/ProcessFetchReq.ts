const processFetchReq = async (url: string, options?: RequestInit): Promise<any> => {
    const ts = Date.now();
    const method = options?.method || "GET";

    // Extract endpoint from URL
    const endpointMatch = url.match(/\/([^\/]+)\/?$/);
    const endpoint = endpointMatch ? endpointMatch[1] : url;

    try {
        const response = await fetch(url, options);
        console.log(`${method} ${response.status}: ${Date.now() - ts}ms /${endpoint}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        return response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

export default processFetchReq;