import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";
import { getLanguageFlag } from "../lib/language";

const isUserOnline = (lastSeen) => {
  if (!lastSeen) return false;
  const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
  return new Date(lastSeen).getTime() > twoMinutesAgo;
};

const FriendCard = ({ friend }) => {
  const online = isUserOnline(friend.lastSeen);

  return (
    <div className="group relative rounded-2xl bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      {/* subtle top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="p-4 space-y-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-base-300 ring-2 ring-base-100 group-hover:ring-primary/20 transition-all">
              <img
                src={friend.profilePic || "/default-avatar.png"}
                alt={friend.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    friend.fullName
                  )}&background=random`;
                }}
              />
            </div>
            {online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-base-100" />
            )}
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="badge badge-secondary badge-outline text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-ghost border-base-300 text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link
          to={`/chat/${friend._id}`}
          className="btn btn-primary w-full shadow-md shadow-primary/20"
        >
          <MessageCircleIcon className="size-4 mr-2" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;