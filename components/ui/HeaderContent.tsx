'use client';

import { usePathname } from 'next/navigation';
import { FilterButton } from '../listings';

export const HeaderContent = () => {
  const path = usePathname();

  return (
    <>
      <div className="max-md:hidden">Marketplace</div>
      <div className="h-full overflow-hidden xs:hidden">{path === '/' && <FilterButton />}</div>
    </>
  );
};
