import isomorphicFetch from 'isomorphic-fetch';
import { DOMAIN_URL } from 'config/settings';

const apiURL = DOMAIN_URL.api;
const fetch = (url: string, options?: RequestInit) => {
  return isomorphicFetch(`${apiURL}${url}`, options)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Bad response from server');
      }
      return res.json();
    })
    .then((res) => {
      if (res.data) {
        return res.data;
      }
      if (res) {
        return res;
      }
      throw new Error('Bad response data from server');
    });
};

export default fetch;
