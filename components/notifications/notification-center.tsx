// Information Expert: conhece e exibe notificações
// High Cohesion: focado em exibição de notificações

"use client"

import { Bell, Check, CheckCheck, Calendar, CreditCard, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/lib/hooks/use-notifications"

const notificationIcons = {
  appointment_reminder: Calendar,
  appointment_confirmed: Check,
  prescription_ready: FileText,
  payment_pending: CreditCard,
}

const notificationColors = {
  appointment_reminder: "text-blue-600",
  appointment_confirmed: "text-green-600",
  prescription_ready: "text-purple-600",
  payment_pending: "text-yellow-600",
}

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - notificationDate.getTime()) / 60000)

    if (diffInMinutes < 1) return "Agora"
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`
    return `${Math.floor(diffInMinutes / 1440)}d atrás`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Notificações</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-auto p-0 text-xs text-primary hover:underline"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || AlertCircle
                const iconColor = notificationColors[notification.type] || "text-gray-600"

                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex items-start gap-3 p-4 cursor-pointer"
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className={`mt-0.5 ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium leading-tight ${!notification.read ? "font-semibold" : ""}`}>
                          {notification.title}
                        </p>
                        {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(notification.createdAt)}</p>
                    </div>
                  </DropdownMenuItem>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
