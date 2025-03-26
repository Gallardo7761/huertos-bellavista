import { useEffect } from 'react';

export default function useInfiniteScroll(ref, callback, hasMore = true) {
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) callback();
      },
      { threshold: 1.0 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [ref, callback, hasMore]);
}
