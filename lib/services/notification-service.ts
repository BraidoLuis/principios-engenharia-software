import type { Notification } from "@/lib/types"

class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = []

  private constructor() {
    this.loadMockNotifications()
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  private loadMockNotifications() {
    this.notifications = [
      {
        id: "1",
        userId: "1",
        type: "appointment_reminder",
        title: "Lembrete de Consulta",
        message: "Você tem uma consulta amanhã às 14:00 com Dr. Pedro Costa",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
      },
      {
        id: "2",
        userId: "1",
        type: "prescription_ready",
        title: "Prescrição Disponível",
        message: "Sua prescrição eletrônica está pronta para download",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
      },
      {
        id: "3",
        userId: "1",
        type: "payment_pending",
        title: "Pagamento Pendente",
        message: "Você possui um pagamento pendente de R$ 150,00",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
      },
    ]
  }

  async createNotification(notification: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    }
    this.notifications.push(newNotification)
    return newNotification
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async markAsRead(id: string): Promise<void> {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  async sendAppointmentReminder(userId: string, appointmentDate: string): Promise<void> {
    await this.createNotification({
      userId,
      type: "appointment_reminder",
      title: "Lembrete de Consulta",
      message: `Você tem uma consulta agendada para ${appointmentDate}`,
      read: false,
    })
  }

  async sendAppointmentConfirmation(userId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: "appointment_confirmed",
      title: "Consulta Confirmada",
      message: "Sua consulta foi confirmada pelo médico",
      read: false,
    })
  }

  async sendPrescriptionNotification(userId: string): Promise<void> {
    await this.createNotification({
      userId,
      type: "prescription_ready",
      title: "Prescrição Disponível",
      message: "Sua prescrição eletrônica está pronta para download",
      read: false,
    })
  }

  async sendPaymentReminder(userId: string, amount: number): Promise<void> {
    await this.createNotification({
      userId,
      type: "payment_pending",
      title: "Pagamento Pendente",
      message: `Você possui um pagamento pendente de ${new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)}`,
      read: false,
    })
  }
}

export const notificationService = NotificationService.getInstance()
