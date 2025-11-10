"use client";

import { useQuery } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { GET_NOTIFICATIONS } from "@/graphql/admin";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "SUCCESS" | "ERROR" | "WARNING" | "INFO"; // Explicit union instead of string
  isRead: boolean;
  relatedEntityType: string | null; // Can be null if not present
  createdAt: string; // ISO string from backend
}

export default function NotificationsPage() {
  const { data, loading, error } = useQuery<{ notifications: Notification[] }>(
    GET_NOTIFICATIONS
  );

  const notifications = data?.notifications ?? [];

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "ERROR":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "WARNING":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "INFO":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">
              Failed to load notifications: {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Notifications</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You&apos;re all caught up! Check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                    notification.isRead
                      ? "bg-background"
                      : "bg-muted/30 border-primary/20"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium text-foreground">
                        {notification.title}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {format(
                          new Date(notification.createdAt),
                          "MMM dd, HH:mm"
                        )}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>

                    {notification.relatedEntityType && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Related to:{" "}
                        <span className="font-medium text-foreground">
                          {notification.relatedEntityType}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
