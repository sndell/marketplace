export const ChatSidebarSkeleton = () => {
  return (
    <div className="flex flex-col w-full md:max-w-96 border-r border-secondary h-full">
      <div className="flex-1 overflow-y-auto p-2">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="flex items-center gap-2 p-2 mb-2">
            <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
