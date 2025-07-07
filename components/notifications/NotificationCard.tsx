import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  TrendingUp,
  Building2,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
} from "lucide-react";

export interface NotificationData {
  id: string;
  type:
    | "investment_update"
    | "status_update"
    | "new_opportunity"
    | "deal_notification"
    | "milestone"
    | "dividend";
  title: string;
  message: string;
  amount?: number;
  timestamp: Date;
  read: boolean;
  franchise: {
    name: string;
    logo: string;
    location: string;
  };
  status?: string;
  progress?: number;
  seller?: {
    name: string;
    avatar: string;
  };
  minInvestment?: number;
  actionUrl: string;
}

interface NotificationCardProps {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  onClick?: (notification: NotificationData) => void;
}

export function NotificationCard({
  notification,
  onMarkAsRead,
  onClick,
}: NotificationCardProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "investment_update":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "status_update":
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case "new_opportunity":
        return <Building2 className="h-5 w-5 text-purple-600" />;
      case "deal_notification":
        return <Users className="h-5 w-5 text-orange-600" />;
      case "milestone":
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case "dividend":
        return <DollarSign className="h-5 w-5 text-yellow-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Fundraising":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Launching":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Live":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const handleClick = () => {
    onMarkAsRead(notification.id);
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <Card
      className={`transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer border-0 shadow-sm ${
        !notification.read
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-l-4 border-l-primary"
          : "bg-white dark:bg-gray-800"
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Enhanced Icon */}
          <div className="flex-shrink-0">
            <div
              className={`p-2.5 rounded-xl ${
                !notification.read
                  ? "bg-primary/10 ring-2 ring-primary/20"
                  : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              {getNotificationIcon(notification.type)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Title and Message */}
                <div className="mb-3">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 leading-tight">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {notification.message}
                  </p>
                </div>

                {/* Franchise Info - Mobile Optimized */}
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-600 flex items-center justify-center shadow-sm">
                    <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {notification.franchise.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {notification.franchise.location}
                    </p>
                  </div>
                </div>

                {/* Additional Info - Mobile Stack */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTimeAgo(notification.timestamp)}
                  </span>

                  {notification.amount && (
                    <span className="flex items-center gap-1.5 font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <DollarSign className="h-3.5 w-3.5" />₹
                      {notification.amount.toLocaleString()}
                    </span>
                  )}

                  {notification.status && (
                    <Badge
                      className={`text-xs font-medium ${getStatusBadgeColor(notification.status)}`}
                    >
                      {notification.status}
                    </Badge>
                  )}

                  {notification.progress && (
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full font-medium">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {notification.progress}%
                    </span>
                  )}
                </div>
              </div>

              {/* Unread indicator */}
              {!notification.read && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-3 h-3 bg-primary rounded-full shadow-sm ring-2 ring-white dark:ring-gray-800"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
