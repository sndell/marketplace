'use client';

import { usePathname } from 'next/navigation';

export const HeaderContent = () => {
  const path = usePathname();

  return (
    <>
      <div className="max-md:hidden">Marketplace</div>
      <div className="xs:hidden">{path === '/' && <div>SearchButton</div>}</div>
    </>
  );
};
