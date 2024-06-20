import React, { useState, useEffect, useRef } from 'react';

const filters: string[] = ['Elektronik', 'Datorer', 'Stockholm', 'Södertälje', '500kr - 2700kr'];

export const FilterButton = () => {
  const [visibleFilters, setVisibleFilters] = useState<string[]>([]);
  const [hiddenCount, setHiddenCount] = useState<number>(filters.length);
  const containerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        let tempHiddenCount = 0;
        let currentLength = 0;

        const tempVisibleTags = filters.filter((filter) => {
          const filterWidth = filter.length * 7 + 15;
          if (currentLength + filterWidth <= containerWidth - 150) {
            currentLength += filterWidth;
            return true;
          } else {
            tempHiddenCount++;
            return false;
          }
        });

        setVisibleFilters(tempVisibleTags);
        setHiddenCount(tempHiddenCount);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <button className="flex flex-1 w-full h-full gap-2 p-2 overflow-hidden rounded-full bg-primary" ref={containerRef}>
      <div className="grid h-full text-white rounded-full aspect-square place-items-center bg-accent">
        <span className="icon-[solar--magnifer-linear]" />
      </div>
      <div className="flex flex-col items-start">
        Allting
        <div className="flex items-center gap-2 text-sm text-primaryLight whitespace-nowrap">
          {visibleFilters.map((tag, index) => (
            <React.Fragment key={index}>
              <div className="">{tag}</div>
              {index + 1 < visibleFilters.length && <span className="text-xs">•</span>}
            </React.Fragment>
          ))}
          {hiddenCount > 0 && (
            <>
              {visibleFilters.length > 0 && <span>+</span>}
              <span> {hiddenCount} filter</span>
            </>
          )}
        </div>
      </div>
    </button>
  );
};
