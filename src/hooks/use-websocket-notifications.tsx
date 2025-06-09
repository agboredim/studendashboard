import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { baseUrl } from "@/services/live-classes-api";

const base_url = baseUrl;

export interface Notification {
  id: string;
  type: "live_class" | "assignment" | "course_update" | "system" | "reminder";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  metadata?: {
    course_id?: string;
    class_id?: string;
    link?: string;
    action_url?: string;
  };
}

interface UseWebSocketNotificationsReturn {
  notifications: Notification[];
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  reconnect: () => void;
}

export function useWebSocketNotifications(): UseWebSocketNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected" | "error"
  >("disconnected");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isReconnecting = useRef(false);

  const { toast } = useToast();

  // Get user ID from Redux store
  const userId = useSelector((state: any) => state.auth.user?.id);

  // Improved WebSocket URL construction
  const getWebSocketUrl = useCallback((userId: string): string => {
    try {
      const url = new URL(base_url);
      const protocol = url.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${url.host}/notifications/${userId}`;
      console.log("WebSocket URL:", wsUrl);
      return wsUrl;
    } catch (error) {
      console.error("Error constructing WebSocket URL:", error);
      // Fallback to simple replacement
      return `${base_url.replace(
        /^https?/,
        base_url.startsWith("https") ? "wss" : "ws"
      )}/notifications/${userId}`;
    }
  }, []);

  const connect = useCallback(() => {
    if (!userId) {
      console.warn("Cannot connect: No user ID available");
      return;
    }

    if (
      wsRef.current?.readyState === WebSocket.CONNECTING ||
      wsRef.current?.readyState === WebSocket.OPEN
    ) {
      console.log("WebSocket already connecting or connected");
      return;
    }

    setConnectionStatus("connecting");
    console.log(
      `Attempting to connect WebSocket (attempt ${
        reconnectAttempts.current + 1
      })`
    );

    try {
      const wsUrl = getWebSocketUrl(userId);
      wsRef.current = new WebSocket(wsUrl);

      // Set connection timeout
      const connectionTimeout = setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CONNECTING) {
          console.log("Connection timeout, closing WebSocket");
          wsRef.current?.close();
        }
      }, 10000); // 10 second timeout

      wsRef.current.onopen = () => {
        console.log("WebSocket connected successfully");
        clearTimeout(connectionTimeout);
        setIsConnected(true);
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;
        isReconnecting.current = false;

        // Send authentication or initialization message if needed
        wsRef.current?.send(
          JSON.stringify({
            type: "init",
            user_id: userId,
          })
        );

        toast({
          title: "🔔 Notifications Connected",
          description: "You'll receive real-time updates",
          duration: 3000,
        });
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message:", data);

          if (data.type === "notification") {
            const newNotification: Notification = {
              id: data.id || Date.now().toString(),
              type: data.notification_type || "system",
              title: data.title,
              message: data.message,
              timestamp: data.timestamp || new Date().toISOString(),
              read: false,
              priority: data.priority || "medium",
              metadata: data.metadata || {},
            };

            setNotifications((prev) => [newNotification, ...prev]);

            // Show toast for high priority notifications
            if (data.priority === "high" || data.priority === "urgent") {
              toast({
                title: `${getPriorityEmoji(data.priority)} ${data.title}`,
                description: data.message,
                duration: data.priority === "urgent" ? 10000 : 5000,
              });
            }
          } else if (data.type === "notification_list") {
            // Initial load of notifications
            setNotifications(data.notifications || []);
          } else if (data.type === "pong") {
            // Handle heartbeat response
            console.log("Received pong from server");
          } else if (data.type === "error") {
            console.error("Server error:", data.message);
            toast({
              title: "⚠️ Server Error",
              description: data.message || "An error occurred",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error, event.data);
        }
      };

      wsRef.current.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log(`WebSocket disconnected: ${event.code} - ${event.reason}`);
        setIsConnected(false);

        // Handle different close codes
        if (event.code === 1000) {
          // Normal closure
          setConnectionStatus("disconnected");
          console.log("WebSocket closed normally");
        } else if (event.code === 1006) {
          // Abnormal closure
          setConnectionStatus("error");
          console.log(
            "WebSocket closed abnormally (1006) - likely network issue"
          );
        } else {
          setConnectionStatus("error");
          console.log(
            `WebSocket closed with code ${event.code}: ${event.reason}`
          );
        }

        // Attempt to reconnect if not a normal closure and we haven't exceeded max attempts
        if (
          event.code !== 1000 &&
          reconnectAttempts.current < maxReconnectAttempts &&
          !isReconnecting.current
        ) {
          isReconnecting.current = true;
          const delay = Math.min(
            1000 * Math.pow(2, reconnectAttempts.current),
            30000
          );
          console.log(`Will attempt reconnection in ${delay}ms`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.log("Max reconnection attempts reached");
          toast({
            title: "🔴 Connection Lost",
            description:
              "Unable to reconnect to notifications service. Please refresh the page.",
            variant: "destructive",
            duration: 10000,
          });
        }
      };

      wsRef.current.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error("WebSocket error:", error);
        setConnectionStatus("error");

        // Don't show error toast on every error - only if we're not already reconnecting
        if (!isReconnecting.current) {
          toast({
            title: "⚠️ Connection Error",
            description: "Failed to connect to notifications service",
            variant: "destructive",
          });
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      setConnectionStatus("error");
      toast({
        title: "⚠️ Connection Error",
        description: "Failed to initialize WebSocket connection",
        variant: "destructive",
      });
    }
  }, [userId, toast, getWebSocketUrl]);

  const disconnect = useCallback(() => {
    console.log("Disconnecting WebSocket");

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      // Prevent reconnection attempts
      isReconnecting.current = false;
      reconnectAttempts.current = maxReconnectAttempts;

      wsRef.current.close(1000, "Component unmounting");
      wsRef.current = null;
    }

    setIsConnected(false);
    setConnectionStatus("disconnected");
  }, []);

  const reconnect = useCallback(() => {
    console.log("Manual reconnection triggered");
    disconnect();
    setTimeout(() => {
      reconnectAttempts.current = 0;
      isReconnecting.current = false;
      connect();
    }, 1000);
  }, [connect, disconnect]);

  // Send message to server with error handling
  const sendMessage = useCallback((message: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
        return false;
      }
    } else {
      console.warn("WebSocket not connected, cannot send message:", message);
      return false;
    }
  }, []);

  const markAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );

      sendMessage({
        type: "mark_read",
        notification_id: notificationId,
      });
    },
    [sendMessage]
  );

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );

    sendMessage({
      type: "mark_all_read",
    });
  }, [sendMessage]);

  const deleteNotification = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );

      sendMessage({
        type: "delete_notification",
        notification_id: notificationId,
      });
    },
    [sendMessage]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);

    sendMessage({
      type: "clear_all",
    });
  }, [sendMessage]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (!isConnected) return;

    const heartbeat = setInterval(() => {
      sendMessage({ type: "ping" });
    }, 30000); // Send ping every 30 seconds

    return () => clearInterval(heartbeat);
  }, [isConnected, sendMessage]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  // Handle visibility change - reconnect when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isConnected && userId) {
        console.log("Tab became visible, attempting to reconnect");
        reconnect();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isConnected, userId, reconnect]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    isConnected,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    unreadCount,
    reconnect,
  };
}

function getPriorityEmoji(priority: string): string {
  switch (priority) {
    case "urgent":
      return "🚨";
    case "high":
      return "⚡";
    case "medium":
      return "📢";
    case "low":
      return "💬";
    default:
      return "🔔";
  }
}
