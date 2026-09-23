import { useCallback, useEffect, useState } from "react";

export function useScrollSpy(sectionIds: string[], offset = 96) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const visible = new Map<string, number>();

    const pickActive = () => {
      if (!visible.size) return;
      let best = sectionIds[0];
      let bestTop = Infinity;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el || !visible.has(id)) continue;
        const top = el.getBoundingClientRect().top;
        if (top >= offset - 8 && top < bestTop) {
          bestTop = top;
          best = id;
        }
      }
      if (bestTop === Infinity) {
        const sorted = [...visible.entries()].sort((a, b) => b[1] - a[1]);
        best = sorted[0]?.[0] ?? best;
      }
      setActiveId(best);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        });
        pickActive();
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, offset]);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return { activeId, scrollTo };
}
