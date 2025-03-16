export const ChatSkeleton = () => {
  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden max-md:absolute max-md:h-dvh max-md:inset-0 max-md:z-50 max-md:bg-white">
      <div className="flex flex-col h-full gap-2 p-2 overflow-y-auto pt-36 scrollbar-slim pb-18">
        <div className="absolute top-0 right-0 left-0 grid grid-cols-[1fr_auto] gap-2 mx-2 pt-2 bg-linear-to-b md:from-white to-100%">
          <div className="flex items-center flex-1 gap-2 p-2 rounded-full backdrop-blur-md bg-primary/90">
            <div className="bg-gray-200 rounded-full w-11 h-11 animate-pulse"></div>
            <div className="flex flex-col">
              <div className="w-24 h-4 bg-gray-200 rounded-sm animate-pulse"></div>
              <div className="w-32 h-3 mt-1 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>
          </div>
          <div className="grid h-full rounded-full place-content-center backdrop-blur-xl bg-background/10 aspect-square md:hidden">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="flex absolute right-0 bottom-0 left-0 gap-2 p-3 max-md:backdrop-blur-md max-md:bg-primary/90 bg-linear-to-t md:from-white to-90%">
          <div className="flex-1 h-12 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="w-12 h-12 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
