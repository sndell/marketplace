import { HeaderContent } from './HeaderContent';
import { Navbar } from './Navbar';

export const Header = () => (
  <div className="xs:bg-primary">
    <div className="grid w-full max-md:grid-cols-[auto_1fr] grid-cols-[1fr_auto_1fr] p-3 mx-auto max-w-7xl items-center">
      <HeaderContent />
      <Navbar />
      <div className="flex gap-2 justify-self-end">
        <button className="grid p-2 max-xs:hidden rounded-xl bg-primaryDark place-items-center">
          <span className="text-2xl icon-[solar--user-rounded-linear]" />
        </button>
        <button className="grid p-3 xs:p-2 rounded-xl bg-white/50 xs:bg-primaryDark place-items-center">
          <span className="text-4xl xs:text-2xl icon-[solar--hamburger-menu-linear]" />
        </button>
      </div>
    </div>
  </div>
);
