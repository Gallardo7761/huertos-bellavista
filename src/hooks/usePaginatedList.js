import { useState, useRef, useMemo, useEffect } from 'react';
import useInfiniteScroll from './useInfiniteScroll';

export const usePaginatedList = ({
  data,
  pageSize = 10,
  enablePagination = true,
  filterFn = () => true,
  searchFn = () => true,
  initialFilters = {}
}) => {
  const [page, setPage] = useState(0);
  const [paginated, setPaginated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [creatingItem, setCreatingItem] = useState(false);
  const [tempItem, setTempItem] = useState(null);

  const isSearching = searchTerm.trim() !== "";
  const isFiltering = Object.keys(filters).some(k => filters[k] === false);
  const usingSearchOrFilters = isSearching || isFiltering;

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data
      .filter((item) => filterFn(item, filters))
      .filter((item) => searchFn(item, searchTerm));
  }, [data, filterFn, filters, searchFn, searchTerm]);

  const loadMore = () => {
    if (loading || !filteredData) return;
    setLoading(true);
    setTimeout(() => {
      const start = page * pageSize;
      const end = start + pageSize;
      const chunk = filteredData.slice(start, end);
      setPaginated(prev => [...prev, ...chunk]);
      setPage(prev => prev + 1);
      setLoading(false);
      if (end >= filteredData.length) setHasMore(false);
    }, 500);
  };  

  useEffect(() => {
    if (!filteredData) return;
  
    const initialChunk = filteredData.slice(0, pageSize);
  
    setPaginated(initialChunk);
    setPage(1);
    setHasMore(filteredData.length > pageSize);
  }, [data, searchTerm, filters, pageSize]);  

  useInfiniteScroll(loaderRef, loadMore, enablePagination && hasMore && !usingSearchOrFilters);

  return {
    paginated,
    filtered: filteredData,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loaderRef,
    loading,
    hasMore,
    creatingItem,
    setCreatingItem,
    tempItem,
    setTempItem,
    isUsingFilters: usingSearchOrFilters
  };
};
