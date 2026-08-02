import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  SparklesIcon,
  UserCheckIcon,
} from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const {
    mutate: acceptRequestMutation,
    isPending,
    variables: pendingRequestId,
  } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary mb-2">
            <SparklesIcon className="size-3.5" />
            Activity
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => {
                    const isThisPending = isPending && pendingRequestId === request._id;

                    return (
                      <div
                        key={request._id}
                        className="group relative rounded-2xl bg-base-100 border border-base-300 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                        <div className="p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-14 h-14 rounded-full shrink-0 overflow-hidden bg-base-300 ring-2 ring-base-100 group-hover:ring-primary/20 transition-all">
                                <img
                                  src={request.sender.profilePic}
                                  alt={request.sender.fullName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                      request.sender.fullName
                                    )}&background=random`;
                                  }}
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold truncate">
                                  {request.sender.fullName}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="badge badge-secondary badge-outline badge-sm">
                                    Native: {request.sender.nativeLanguage}
                                  </span>
                                  <span className="badge badge-ghost border-base-300 badge-sm">
                                    Learning: {request.sender.learningLanguage}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary btn-sm shrink-0 shadow-md shadow-primary/20"
                              onClick={() => acceptRequestMutation(request._id)}
                              disabled={isThisPending}
                            >
                              {isThisPending ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                "Accept"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="rounded-2xl bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden bg-base-300 ring-2 ring-base-100 mt-1">
                            <img
                              src={notification.recipient.profilePic}
                              alt={notification.recipient.fullName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  notification.recipient.fullName
                                )}&background=random`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">
                              {notification.recipient.fullName}
                            </h3>
                            <p className="text-sm my-1 opacity-80">
                              {notification.recipient.fullName} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-50">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="badge badge-success badge-outline shrink-0">
                            <MessageSquareIcon className="h-3 w-3 mr-1" />
                            New Friend
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;