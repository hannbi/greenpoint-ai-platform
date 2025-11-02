import { useState, useCallback } from 'react';

export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        return result;
      } catch (err) {
        setError(err.message || '오류가 발생했습니다.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { execute, loading, error, reset };
};
