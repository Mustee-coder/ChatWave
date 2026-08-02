export const FriendCardSkeleton = () => (
  <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden animate-pulse">
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-base-300 shrink-0" />
        <div className="h-4 bg-base-300 rounded w-24" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 bg-base-300 rounded-full w-20" />
        <div className="h-5 bg-base-300 rounded-full w-24" />
      </div>
      <div className="h-10 bg-base-300 rounded-xl w-full" />
    </div>
  </div>
);

export const UserCardSkeleton = () => (
  <div className="rounded-2xl bg-base-100 border border-base-300 overflow-hidden animate-pulse">
    <div className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="size-16 rounded-full bg-base-300 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-base-300 rounded w-32" />
          <div className="h-3 bg-base-300 rounded w-20" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 bg-base-300 rounded-full w-24" />
        <div className="h-5 bg-base-300 rounded-full w-28" />
      </div>
      <div className="h-3 bg-base-300 rounded w-full" />
      <div className="h-3 bg-base-300 rounded w-2/3" />
      <div className="h-10 bg-base-300 rounded-xl w-full" />
    </div>
  </div>
);