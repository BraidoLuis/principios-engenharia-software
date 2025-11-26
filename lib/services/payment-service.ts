// Pure Fabrication: serviço especializado em pagamentos
// Indirection: abstrai lógica de processamento de pagamento

import type { Payment } from "@/lib/types"

class PaymentService {
  private static instance: PaymentService
  private payments: Payment[] = []

  private constructor() {}

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  async createPayment(payment: Omit<Payment, "id">): Promise<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: Math.random().toString(36).substr(2, 9),
    }
    this.payments.push(newPayment)
    return newPayment
  }

  async processPayment(paymentId: string, method: Payment["method"]): Promise<Payment> {
    const payment = this.payments.find((p) => p.id === paymentId)
    if (!payment) throw new Error("Payment not found")

    // Simular processamento de pagamento
    payment.status = "paid"
    payment.method = method
    payment.paidAt = new Date().toISOString()

    return payment
  }

  async getPaymentByAppointment(appointmentId: string): Promise<Payment | null> {
    return this.payments.find((p) => p.appointmentId === appointmentId) || null
  }

  async getPaymentsByStatus(status: Payment["status"]): Promise<Payment[]> {
    return this.payments.filter((p) => p.status === status)
  }

  async cancelPayment(paymentId: string): Promise<void> {
    const payment = this.payments.find((p) => p.id === paymentId)
    if (payment) {
      payment.status = "cancelled"
    }
  }

  async generateInvoice(paymentId: string): Promise<string> {
    const payment = this.payments.find((p) => p.id === paymentId)
    if (!payment) throw new Error("Payment not found")

    // Simular geração de invoice
    return `INV-${payment.id.toUpperCase()}`
  }
}

export const paymentService = PaymentService.getInstance()
