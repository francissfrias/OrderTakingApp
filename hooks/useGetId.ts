'use client';
import { useEffect, useState } from 'react';

export function useGetId({ id, module }: { id: string; module: string }) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setNotFound(false);

      try {
        const response = await fetch(`/api/${module}/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          return setNotFound(true);
        }

        const data = await response.json();

        if (isMounted) {
          setData(data);
        }
      } catch (err) {
        console.log(err);
        if ((err as any).response?.status === 404) {
          setNotFound(true);
        }
        if (isMounted) {
          setError(err as any);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Clean up to avoid setting state on an unmounted component
    };
  }, [id]);

  return { data, loading, error, notFound };
}
