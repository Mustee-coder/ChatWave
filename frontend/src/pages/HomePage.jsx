import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { capitialize } from "../lib/utils";


import FriendCard from "../components/FriendCard";
import { getLanguageFlag } from "../lib/language";
import { FriendCardSkeleton, UserCardSkeleton } from "../components/SkeletonCard";

import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  

  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    refetchInterval: 60000,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const {
    mutate: sendRequestMutation,
    isPending,
    variables: pendingUserId,
  } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success("Friend request sent!");
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || error?.message || "Unable to send friend request";
      toast.error(message);
    },
  });

  const outgoingRequestsIds = useMemo(() => {
    return new Set((outgoingFriendReqs ?? []).map((req) => req.recipient._id));
  }, [outgoingFriendReqs]);

  const availableLanguages = useMemo(() => {
    const langs = new Set(
      recommendedUsers.map((u) => u.nativeLanguage).filter(Boolean)
    );
    return Array.from(langs).sort();
  }, [recommendedUsers]);

  const filteredUsers = useMemo(() => {
    return recommendedUsers.filter((user) => {
      const matchesSearch = user.fullName
        ?.toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesLanguage =
        languageFilter === "all" || user.nativeLanguage === languageFilter;

      return matchesSearch && matchesLanguage;
    });
  }, [recommendedUsers, searchTerm, languageFilter]);

  const hasActiveFilters = searchTerm.trim() !== "" || languageFilter !== "all";

  const clearFilters = () => {
    setSearchTerm("");
    setLanguageFilter("all");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <FriendCardSkeleton key={i} />
            ))}
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          {/* HEADER */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              <SparklesIcon className="size-3.5" />
              Recommended for you
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Meet New Learners
            </h2>
            <p className="opacity-60 mt-1">
              Discover perfect language exchange partners based on your profile
            </p>
          </div>

          {/* SEARCH + FILTER — premium bar */}
          <div className="sticky top-16 z-10 mb-8">
            <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-base-100/80 backdrop-blur-md border border-base-300 shadow-sm">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-base-200/60 border border-transparent focus:border-primary/40 focus:bg-base-100 focus:outline-none transition-colors text-sm"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                className="px-4 py-2.5 rounded-xl bg-base-200/60 border border-transparent focus:border-primary/40 focus:bg-base-100 focus:outline-none transition-colors text-sm sm:w-56"
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
              >
                <option value="all">All native languages</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {getLanguageFlag(lang)} {capitialize(lang)}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium opacity-60 hover:opacity-100 hover:bg-base-200/60 transition-all shrink-0"
                >
                  <XIcon className="size-3.5" />
                  Clear
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <p className="text-xs opacity-50 mt-2 ml-1">
                Showing {filteredUsers.length} of {recommendedUsers.length} learners
              </p>
            )}
          </div>

          {loadingUsers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <UserCardSkeleton key={i} />
              ))}
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-60">
                Check back later for new language partners!
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-base-300 p-10 text-center">
              <SearchIcon className="size-8 mx-auto mb-3 opacity-30" />
              <h3 className="font-semibold text-lg mb-2">No matches found</h3>
              <p className="text-base-content opacity-60 mb-4">
                Try a different name or language filter.
              </p>
              <button onClick={clearFilters} className="btn btn-sm btn-outline">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const isThisPending = isPending && pendingUserId === user._id;

                return (
                  <div
                    key={user._id}
                    className="group relative rounded-2xl bg-base-100 border border-base-300 shadow-sm hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                    <div className="p-5 space-y-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="size-16 rounded-full overflow-hidden bg-base-300 ring-2 ring-base-100 group-hover:ring-primary/20 transition-all">
                            <img
                              src={user.profilePic}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.fullName
                                )}&background=random`;
                              }}
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-60 mt-1 min-w-0">
                              <MapPinIcon className="size-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary badge-outline">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className="badge badge-ghost border-base-300">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && (
                        <p className="text-sm opacity-60 line-clamp-2">{user.bio}</p>
                      )}

                      <button
                        className={`btn w-full mt-1 ${
                          hasRequestBeenSent
                            ? "btn-disabled"
                            : "btn-primary shadow-md shadow-primary/20"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isThisPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : isThisPending ? (
                          <span className="loading loading-spinner loading-sm" />
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;