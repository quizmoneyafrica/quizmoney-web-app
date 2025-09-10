let refreshPromise: Promise<string> | null = null;

export const getRefreshPromise = () => refreshPromise;
export const setRefreshPromise = (promise: Promise<string> | null) => {
  refreshPromise = promise;
};