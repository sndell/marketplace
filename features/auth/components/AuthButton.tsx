"use client";

import { useEffect, useState } from "react";
import { AuthModal } from "./AuthModal";
import { AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { cn } from "@/util/cn";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useRouter } from "next/navigation";

type Props = {
  mode?: "desktop" | "mobile";
  children?: React.ReactNode;
};

export const AuthButton = ({ mode, children }: Props) => {
  const user = useCurrentUser();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (user.data) closeModal();
    router.refresh();
  }, [user.data]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openModal = () => setIsAuthModalOpen(true);
  const closeModal = () => setIsAuthModalOpen(false);

  const handleClick = () => {
    if (!user.data) openModal();
    else logout.mutate();
  };

  return (
    <>
      {(children && <button onClick={handleClick}>{children}</button>) ||
        (mode === "mobile" ? (
          <button onClick={handleClick} className="flex items-center px-3 py-2 xs:hidden">
            {!user.data ? (
              <span className="icon-[solar--user-circle-linear] max-[380px]:text-2xl text-3xl" />
            ) : (
              <Image
                src={user.data.photoUrl}
                alt="photo url"
                width={32}
                height={32}
                className="rounded-xl max-[380px]:h-6 max-[380px]:w-6"
              />
            )}
          </button>
        ) : (
          <button
            onClick={handleClick}
            className={cn("grid max-xs:hidden rounded-xl bg-primary-dark place-items-center", !user.data && "p-2")}
          >
            {!user.data ? (
              <span className="text-2xl icon-[solar--user-rounded-linear]" />
            ) : (
              <Image src={user.data.photoUrl} alt="photo url" width={40} height={40} className="rounded-xl" />
            )}
          </button>
        ))}
      <AnimatePresence>{isAuthModalOpen && <AuthModal close={closeModal} />}</AnimatePresence>
    </>
  );
};
