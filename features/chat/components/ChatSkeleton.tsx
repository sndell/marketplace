export const ChatSkeleton = () => {
  return (
    <div className="flex overflow-hidden relative flex-col w-full h-full max-md:absolute max-md:inset-0 max-md:z-50 max-md:bg-white">
      <div className="flex overflow-y-auto flex-col gap-2 p-2 pt-36 h-full scrollbar-slim pb-18">
        <div className="absolute top-0 right-0 left-0 grid grid-cols-[1fr_auto] gap-2 mx-2 pt-2 bg-gradient-to-b md:from-white to-100%">
          <div className="flex flex-1 gap-2 items-center p-2 rounded-full backdrop-blur-md bg-primary/90">
            <div className="w-11 h-11 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="flex flex-col">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse mt-1"></div>
            </div>
          </div>
          <div className="grid place-content-center h-full rounded-full backdrop-blur-xl bg-background/10 aspect-square md:hidden">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* <div className="flex flex-col gap-6 py-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <div className="flex flex-col gap-2 max-w-[70%]">
                <div className="h-2.5 bg-gray-100 rounded w-16 animate-pulse self-end"></div>
                <div className={`${index % 2 === 0 ? "rounded-tr-2xl" : "rounded-tl-2xl"} rounded-2xl h-24 bg-gray-100 animate-pulse`}></div>
              </div>
            </div>
          ))}
        </div> */}

        <div className="flex absolute right-0 bottom-0 left-0 gap-2 p-3 max-md:backdrop-blur-md max-md:bg-primary/90 bg-gradient-to-t md:from-white to-90%">
          <div className="flex-1 h-12 bg-gray-100 rounded-full animate-pulse"></div>
          <div className="w-12 h-12 bg-gray-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
