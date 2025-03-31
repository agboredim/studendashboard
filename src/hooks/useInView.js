"use client";

import { useState, useEffect, useRef } from "react";

export function useInView(options = {}) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);
  const enteredViewRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only update state if the visibility actually changed
        if (entry.isIntersecting !== isInView) {
          setIsInView(entry.isIntersecting);

          // Track if element has ever entered the viewport
          if (entry.isIntersecting) {
            enteredViewRef.current = true;
          }
        }
      },
      {
        threshold: options.threshold || 0,
        rootMargin: options.rootMargin || "0px",
        ...options,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, isInView]);

  return [ref, isInView, enteredViewRef.current];
}
