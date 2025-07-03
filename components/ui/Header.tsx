import { AuthButton } from "../../features/auth";
import { HeaderContent } from "./HeaderContent";
import { Navbar } from "./Navbar";

export const Header = () => (
  <div className="top-0 left-0 right-0 z-50 xs:bg-primary max-xs:fixed">
    <div className="grid w-full grid-cols-[1fr_auto] xs:grid-cols-[auto_1fr] gap-3 md:grid-cols-[1fr_auto_1fr] p-2 xs:p-3 mx-auto max-w-7xl items-center">
      <HeaderContent />
      <Navbar />
      <div className="flex gap-2 justify-self-end">
        <AuthButton mode="desktop" />
        <button className="grid p-3 border rounded-full md:rounded-xl xs:p-2 xs:bg-primary-dark place-items-center backdrop-blur-xl bg-background/80 border-secondary/10">
          <span className="text-4xl xs:text-2xl icon-[solar--hamburger-menu-linear]" />
        </button>
      </div>
    </div>
  </div>
);
