import { processFetchReq, generateQueryStrFrom } from "../../utils";

const QUOTABLE_BASE_URL = 'https://quotable.io';

const getQuotes = async function (params) {
  let url = `${QUOTABLE_BASE_URL}/quotes`;
  if (params) {
    url += generateQueryStrFrom(params);
  }

  return processFetchReq(url);
};

export default {
  getQuotes,
  // other methods here
};