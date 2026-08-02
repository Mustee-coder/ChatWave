import { Link, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { getFriendRequests } from "../lib/api";

// ChatWave logo mark
const WaveMark = () => (
  <div className="flex items-end gap-[3px]">
    {[6, 14, 20, 12, 8].map((h, i) => (
      <span
        key={i}
        className="w-[3px] rounded-full bg-primary"
        style={{ height: `${h}px` }}
      />
    ))}
  </div>
);

const Navbar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");

  const { logoutMutation } = useLogout();

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    enabled: !!authUser,
    refetchInterval: 30000, // refresh every 30s so badge stays current
  });

  const incomingCount = friendRequests?.incomingReqs?.length || 0;

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <WaveMark />
                <span className="text-2xl font-bold tracking-tight">ChatWave</span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle relative">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                {incomingCount > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-error text-white text-[10px] font-bold leading-none">
                    {incomingCount > 9 ? "9+" : incomingCount}
                  </span>
                )}
              </button>
            </Link>

            <ThemeSelector />

            <Link
              to="/edit-profile"
              className="size-9 rounded-full overflow-hidden bg-base-300 shrink-0 ring-2 ring-transparent hover:ring-primary/40 transition-all"
              title="Edit profile"
            >
              <img
                src={authUser?.profilePic}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authUser?.fullName || "U"
                  )}&background=random`;
                }}
              />
            </Link>

            {/* Logout button */}
            <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
              <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;