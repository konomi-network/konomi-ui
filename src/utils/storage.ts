const LOCAL_STORAGE_KEYS = {
  ENTERED_MARKETS: 'entered_markets'
};

const setLocalStorage = (key: string, data: string) => {
  localStorage.setItem(key, data);
};

const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

export { LOCAL_STORAGE_KEYS, setLocalStorage, getLocalStorage };
