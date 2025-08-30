// src/hooks/use-websocket-notifications.js
import { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice";

export function useWebSocketNotifications(userId, courseId) {
  const token = useSelector(selectAccessToken);

  const [notifications, setNotifications] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting"); // connecting | connected | error
  const [unreadCount, setUnreadCount] = useState(0);

  const socketRef = useRef(null);
  const retryTimeout = useRef(null);
  const retryAttempts = useRef(0);
  const heartbeatRef = useRef(null);

  const safeSend = useCallback((payload) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    } else {
      console.warn("Tried to send on closed socket:", payload);
    }
  }, []);

  const connect = useCallback(() => {
    if (!token) {
      console.log("Waiting for token...");
      setConnectionStatus("connecting");
      return;
    }

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      console.log("Socket already open/connecting, skipping new connect");
      return;
    }

    setConnectionStatus("connecting");

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";

    const endpoint = courseId
      ? `wss://api.titanscareers.com/ws/liveclass/${courseId}/?token=${token}`
      : `wss://api.titanscareers.com/ws/notifications/?token=${token}`;

    console.log("Connecting to WS:", endpoint);

    const ws = new WebSocket(endpoint);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected!");
      setConnectionStatus("connected");
      retryAttempts.current = 0;

      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      heartbeatRef.current = setInterval(() => {
        safeSend({ action: "ping" });
      }, 20000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS message:", data);

        if (Array.isArray(data)) {
          setNotifications(data);
          setUnreadCount(
            data.filter(
              (n) => n && typeof n.read === "boolean" && !n.read
            ).length
          );
        } else if (data && typeof data === "object") {
          if (data.type === "notification" || data.id) {
            setNotifications((prev) => [data, ...prev]);
            if (data.read === false) {
              setUnreadCount((prev) => prev + 1);
            }
          } else {
            console.log("ℹNon-notification WS message:", data);
          }
        }
      } catch (err) {
        console.error("Invalid WS data:", err, event.data);
      }
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
      setConnectionStatus("error");
    };

    ws.onclose = (event) => {
      console.warn("🔌 WebSocket closed:", event.code, event.reason);
      setConnectionStatus("error");

      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }

      
      retryAttempts.current += 1;
      const delay = Math.min(2000 * retryAttempts.current, 30000);
      console.log(`Reconnecting in ${delay / 1000}s...`);

      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      retryTimeout.current = setTimeout(connect, delay);
    };
  }, [token, courseId, safeSend]);


  const reconnect = useCallback(() => {
    console.log("🔄 Manual reconnect triggered");

    if (retryTimeout.current) clearTimeout(retryTimeout.current);
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    retryAttempts.current = 0;
    connect();
  }, [connect]);

  useEffect(() => {
    if (token) connect();

    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      if (socketRef.current) {
        console.log("Cleaning up socket...");
        socketRef.current.close();
      }
    };
  }, [token, courseId, connect]);

  
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(prev - 1, 0));
    safeSend({ action: "mark_as_read", notification_id: id });
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    safeSend({ action: "mark_all_as_read" });
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    safeSend({ action: "delete", notification_id: id });
  };

  return {
    notifications,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadCount,
    reconnect, 
  };
}
