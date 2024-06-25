'use client';

import { cn } from '@/util/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { AuthButton } from '../../features/auth';

type Link = {
  href: string;
  label: string;
  icon: string;
};

const links: Link[] = [
  { href: '/', label: 'Hem', icon: 'icon-[solar--home-2-linear]' },
  { href: '/chat', label: 'Chatt', icon: 'icon-[solar--chat-line-linear]' },
  { href: '/saved', label: 'Sparat', icon: 'icon-[solar--bookmark-linear]' },
  { href: '/listings/new', label: 'Ny annons', icon: 'icon-[solar--add-square-linear]' },
];

export const Navbar = () => {
  const path = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between w-full p-3 bg-primary/90 backdrop-blur-md xs:gap-6 xs:static xs:p-0">
      {links.map((link) => (
        <NavLink key={link.href} path={path} {...link} />
      ))}
      <AuthButton mode="mobile" />
    </div>
  );
};

const NavLink = ({ href, icon, label, path }: Link & { path: string }) => {
  const isActive = path === href;

  return (
    <Link
      href={href}
      className={cn('relative flex items-center gap-2 rounded-full max-xs:px-3 max-xs:py-2 group whitespace-nowrap')}
    >
      <span
        className={cn(
          'max-[380px]:text-2xl text-3xl xs:text-2xl transition-colors group-hover:text-accent',
          isActive && 'text-accent',
          icon
        )}
      />
      <span className={cn('max-xs:hidden', isActive && 'max-xs:text-accent max-xs:inline max-[380px]:text-sm')}>
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="indicator"
          transition={{ duration: 0.1 }}
          className="absolute right-0 w-full h-full rounded-full xs:left-0 xs:w-4 xs:h-1 xs:mx-auto xs:-bottom-5 bg-accent/25 xs:bg-accent"
        />
      )}
    </Link>
  );
};
