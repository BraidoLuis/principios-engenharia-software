// Custom Hook: gerencia estado de notificações
// Protected Variations: protege componentes de mudanças no serviço

"use client"

import { useState, useEffect } from "react"
import type { Notification } from "@/lib/types"
import { notificationService } from "@/lib/services/notification-service"
import { useAuth } from "./use-auth"

export function useNotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await notificationService.getNotificationsByUser(user.id)
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.read).length)
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
    // Simular polling a cada 30 segundos
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [user])

  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id)
    await loadNotifications()
  }

  const markAllAsRead = async () => {
    for (const notification of notifications.filter((n) => !n.read)) {
      await notificationService.markAsRead(notification.id)
    }
    await loadNotifications()
  }

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications,
  }
}
