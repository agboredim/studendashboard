"use client";

import { useState } from "react";
import Layout from "@/components/portal/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import {
  useWebSocketNotifications,
  // type Notification,
} from "@/hooks/use-websocket-notifications";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Wifi,
  WifiOff,
  AlertCircle,
  BookOpen,
  Video,
  ExternalLink,
  Sparkles,
  Clock,
  Filter,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const { toast } = useToast();

  const {
    notifications,
    isConnected,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount,
  } = useWebSocketNotifications();

  // Filter notifications based on active tab and priority
  const getFilteredNotifications = () => {
    let filtered = notifications;

    // Filter by tab
    if (activeTab === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (activeTab === "read") {
      filtered = filtered.filter((n) => n.read);
    }

    // Filter by priority
    if (filterPriority !== "all") {
      filtered = filtered.filter((n) => n.priority === filterPriority);
    }

    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const baseClasses = "h-5 w-5";

    switch (type) {
      case "live_class":
        return <Video className={`${baseClasses} text-blue-500`} />;
      case "assignment":
        return <BookOpen className={`${baseClasses} text-green-500`} />;
      case "course_update":
        return <Sparkles className={`${baseClasses} text-purple-500`} />;
      case "reminder":
        return <Clock className={`${baseClasses} text-orange-500`} />;
      case "system":
        return <Settings className={`${baseClasses} text-gray-500`} />;
      default:
        return <Bell className={`${baseClasses} text-blue-500`} />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 border-red-200 text-red-800";
      case "high":
        return "bg-orange-100 border-orange-200 text-orange-800";
      case "medium":
        return "bg-blue-100 border-blue-200 text-blue-800";
      case "low":
        return "bg-gray-100 border-gray-200 text-gray-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle action based on notification type
    if (notification.metadata?.action_url) {
      window.open(notification.metadata.action_url, "_blank");
    } else if (notification.metadata?.link) {
      window.open(notification.metadata.link, "_blank");
    }
  };

  const readNotifications = notifications.filter((n) => n.read);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <BellRing className="h-8 w-8 text-yellow-300" />
                    {unreadCount > 0 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </div>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold">Notifications</h1>
                </div>
                <p className="text-indigo-100 text-lg">
                  Stay updated with real-time alerts and updates
                </p>
                <div className="flex items-center gap-4 text-sm text-indigo-100">
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-300" />
                        <span className="text-green-200">Connected</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-300" />
                        <span className="text-red-200">Disconnected</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bell className="h-4 w-4" />
                    <span>{notifications.length} Total</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    <span>{unreadCount} Unread</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterPriority("all")}>
                      All Priorities
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterPriority("urgent")}
                    >
                      🚨 Urgent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("high")}>
                      ⚡ High
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterPriority("medium")}
                    >
                      📢 Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("low")}>
                      💬 Low
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                  >
                    <CheckCheck className="h-4 w-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Connection Status Alert */}
        {connectionStatus !== "connected" && (
          <Alert
            className={`border-l-4 ${
              connectionStatus === "error"
                ? "border-l-red-500 bg-red-50"
                : "border-l-yellow-500 bg-yellow-50"
            }`}
          >
            <AlertCircle
              className={`h-4 w-4 ${
                connectionStatus === "error"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            />
            <AlertTitle
              className={
                connectionStatus === "error"
                  ? "text-red-800"
                  : "text-yellow-800"
              }
            >
              {connectionStatus === "connecting" &&
                "🔄 Connecting to notifications..."}
              {connectionStatus === "error" && "⚠️ Connection Error"}
              {connectionStatus === "disconnected" && "📡 Reconnecting..."}
            </AlertTitle>
            <AlertDescription
              className={
                connectionStatus === "error"
                  ? "text-red-700"
                  : "text-yellow-700"
              }
            >
              {connectionStatus === "connecting" &&
                "Establishing real-time connection..."}
              {connectionStatus === "error" &&
                "Unable to connect to notification service. Some features may be limited."}
              {connectionStatus === "disconnected" &&
                "Attempting to restore real-time notifications..."}
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
              <span className="font-medium">All</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-indigo-100 text-indigo-700 text-xs"
              >
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <BellRing className="h-4 w-4" />
              <span className="font-medium">Unread</span>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-red-100 text-red-700 text-xs animate-pulse"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
            >
              <Check className="h-4 w-4" />
              <span className="font-medium">Read</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-green-100 text-green-700 text-xs"
              >
                {readNotifications.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 border-l-4 ${
                      !notification.read
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-blue-500 shadow-md"
                        : "bg-white hover:bg-gray-50 border-l-gray-200"
                    } ${
                      notification.priority === "urgent"
                        ? "ring-2 ring-red-200 ring-opacity-50"
                        : notification.priority === "high"
                        ? "ring-1 ring-orange-200 ring-opacity-50"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-400">
                              <AvatarFallback className="bg-transparent text-white">
                                {getNotificationIcon(
                                  notification.type,
                                  notification.priority
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3
                                className={`font-semibold text-lg ${
                                  !notification.read
                                    ? "text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityColor(
                                  notification.priority
                                )}`}
                              >
                                {notification.priority.toUpperCase()}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              )}
                            </div>

                            <p
                              className={`text-sm leading-relaxed ${
                                !notification.read
                                  ? "text-gray-700"
                                  : "text-gray-600"
                              }`}
                            >
                              {notification.message}
                            </p>

                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatTimestamp(notification.timestamp)}
                              </span>

                              <Badge
                                variant="outline"
                                className="text-xs bg-gray-50"
                              >
                                {notification.type
                                  .replace("_", " ")
                                  .toUpperCase()}
                              </Badge>

                              {notification.metadata?.link && (
                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Action Available</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                              toast({
                                title: "🗑️ Notification deleted",
                                description:
                                  "The notification has been removed",
                              });
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <Bell className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeTab === "unread"
                    ? "No unread notifications"
                    : activeTab === "read"
                    ? "No read notifications"
                    : "No notifications yet"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {activeTab === "unread"
                    ? "You're all caught up! New notifications will appear here."
                    : activeTab === "read"
                    ? "Read notifications will appear here after you mark them as read."
                    : "When you receive notifications, they'll appear here."}
                </p>
                {filterPriority !== "all" && (
                  <Button
                    onClick={() => setFilterPriority("all")}
                    className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        {notifications.length > 0 && (
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-gray-600">
                    Manage all your notifications at once
                  </p>
                </div>
                <div className="flex gap-3">
                  {unreadCount > 0 && (
                    <Button
                      onClick={markAllAsRead}
                      variant="outline"
                      className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                    >
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Mark All Read ({unreadCount})
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      clearAllNotifications();
                      toast({
                        title: "🧹 All notifications cleared",
                        description: "Your notification list has been cleared",
                      });
                    }}
                    variant="outline"
                    className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
