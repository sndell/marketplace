import { ProfileButton } from '../../features/auth';
import { HeaderContent } from './HeaderContent';
import { Navbar } from './Navbar';

export const Header = () => (
  <div className="xs:bg-primary">
    <div className="grid w-full grid-cols-[1fr_auto] xs:grid-cols-[auto_1fr] gap-3 md:grid-cols-[1fr_auto_1fr] p-3 mx-auto max-w-7xl items-center">
      <HeaderContent />
      <Navbar />
      <div className="flex gap-2 justify-self-end">
        <ProfileButton mode="desktop" />
        <button className="grid p-3 xs:p-2 rounded-xl bg-white/50 xs:bg-primaryDark place-items-center">
          <span className="text-4xl xs:text-2xl icon-[solar--hamburger-menu-linear]" />
        </button>
      </div>
    </div>
  </div>
);
