import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function useQueryParams<Type>(): Type {
  const search = useLocation().search;
  const queries = useMemo(() => {
    const q: any = {};
    const params = new URLSearchParams(search);
    params.forEach((value, key) => {
      q[key] = decodeURIComponent(value);
    });
    return q;
  }, [search]);

  return queries;
}
