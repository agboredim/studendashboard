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
  Trash2,
  Settings,
  Wifi,
  WifiOff,
  AlertCircle,
  BookOpen,
  Sparkles,
  Clock,
  RefreshCw,
} from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  const {
    notifications,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
    reconnect, // ✅ exposed from hook
  } = useWebSocketNotifications();

  // filter notifications based on tab
  const getFilteredNotifications = () => {
    if (activeTab === "unread") return notifications.filter((n) => !n.read);
    if (activeTab === "read") return notifications.filter((n) => n.read);
    return notifications;
  };

  const filteredNotifications = getFilteredNotifications();
  const readNotifications = notifications.filter((n) => n.read);

  // icons per type
  const getNotificationIcon = (type) => {
    const baseClasses = "h-5 w-5";
    switch (type) {
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

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.metadata?.action_url) {
      window.open(notification.metadata.action_url, "_blank");
    } else if (notification.metadata?.link) {
      window.open(notification.metadata.link, "_blank");
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
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

                {/* Connection Status */}
                <div className="flex items-center gap-4 text-sm text-indigo-100">
                  <div className="flex items-center gap-2">
                    {connectionStatus === "connected" ? (
                      <>
                        <Wifi className="h-4 w-4 text-green-300" />
                        <span className="text-green-200">Connected</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-4 w-4 text-red-300" />
                        <span className="text-red-200">Disconnected</span>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={reconnect}
                          className="ml-2 flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white border-white/20"
                        >
                          <RefreshCw className="h-3 w-3" /> Reconnect
                        </Button>
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
            </div>
          </div>
        </div>

        {/* Tabs (All, Unread, Read) */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white rounded-lg"
            >
              <Bell className="h-4 w-4" />
              <span>All</span>
              <Badge variant="secondary">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex items-center gap-2 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-lg"
            >
              <BellRing className="h-4 w-4" />
              <span>Unread</span>
              {unreadCount > 0 && (
                <Badge variant="secondary">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="read"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg"
            >
              <Check className="h-4 w-4" />
              <span>Read</span>
              <Badge variant="secondary">{readNotifications.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`group cursor-pointer transition-all duration-300 border-l-4 ${
                      !notification.read
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-blue-500"
                        : "bg-white hover:bg-gray-50 border-l-gray-200"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-6 flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-purple-400 to-pink-400">
                          <AvatarFallback>
                            {getNotificationIcon(notification.type)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {formatTimestamp(notification.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
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
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Bell className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold">No notifications yet</h3>
                <p className="text-gray-600">
                  When you receive notifications, they'll appear here.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
