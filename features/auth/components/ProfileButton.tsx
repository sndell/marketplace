'use client';

type Props = {
  mode: 'desktop' | 'mobile';
};

export const ProfileButton = ({ mode }: Props) => {
  if (mode === 'mobile')
    return (
      <button className="flex items-center px-3 py-2 xs:hidden">
        <span className="icon-[solar--user-circle-linear] max-[380px]:text-2xl text-3xl" />
      </button>
    );
  else
    return (
      <button className="grid p-2 max-xs:hidden rounded-xl bg-primaryDark place-items-center">
        <span className="text-2xl icon-[solar--user-rounded-linear]" />
      </button>
    );
};
