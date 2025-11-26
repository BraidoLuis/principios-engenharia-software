"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DollarSign, CreditCard, TrendingUp, Download, Copy, ArrowRight } from "lucide-react"
import type { Payment } from "@/lib/types"

const DEFAULT_AMOUNT = 250.0
const PIX_COPY_PASTE_STRING =
  "00020126360014BR.GOV.BCB.PIX0114+558199999999925204000053039865802BR5907Company6009City7008City99945802BR"

const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(
  PIX_COPY_PASTE_STRING
)}`

export function PaymentDashboard() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("pix")
  
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const staticPayments: Payment[] = [
        {
          id: "ex-003",
          amount: 75.0,
          status: "paid",
          method: "Cartão de Crédito",
          paidAt: new Date("2025-11-09T09:15:00Z").toISOString(),
        },
        {
          id: "ex-001",
          amount: 250.0,
          status: "paid",
          method: "PIX",
          paidAt: new Date("2025-11-10T14:30:00Z").toISOString(),
        },
        {
          id: "ex-002",
          amount: 120.5,
          status: "pending",
          method: "Boleto",
          paidAt: null,
        },
        {
          id: "ex-005",
          amount: 15.0,
          status: "pending",
          method: "PIX",
          paidAt: null,
        },
        {
          id: "ex-004",
          amount: 300.0,
          status: "failed",
          method: "Cartão de Crédito",
          paidAt: null,
        },
      ]
      setPayments(staticPayments)
    } catch (error) {
      console.error("Error loading payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenPayModal = (payment?: Payment) => {
    if (payment) {
      setSelectedPayment(payment)
    } else {
      setSelectedPayment(null) 
    }
    setPaymentMethod("pix") 
    setIsPaymentModalOpen(true)
  }

  const handlePaymentConfirmation = () => {
    if (selectedPayment) {
      setPayments((prevPayments) =>
        prevPayments.map((p) =>
          p.id === selectedPayment.id
            ? {
                ...p,
                status: "paid",
                paidAt: new Date().toISOString(),
                method: paymentMethod === "pix" ? "PIX" : "Cartão de Crédito",
              }
            : p
        )
      )
    } else {
      loadPayments()
    }

    alert("Pagamento confirmado com sucesso!")
    setIsPaymentModalOpen(false)
    setSelectedPayment(null)
  }

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0)

  const modalAmount = selectedPayment ? selectedPayment.amount : DEFAULT_AMOUNT

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Cards de Métricas (mantidos iguais) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "paid").length} pagamentos recebidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <CreditCard className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(pendingAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "pending").length} aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.length > 0
                ? Math.round(
                    (payments.filter((p) => p.status === "paid").length / payments.length) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Pagamentos concluídos</p>
          </CardContent>
        </Card>
      </div>

      {/* --- BOTÃO GENÉRICO (TOPO) --- */}
      <div className="flex justify-end">
        <Button onClick={() => handleOpenPayModal()}>Realizar Pagamento (Novo)</Button>
      </div>

      {/* --- MODAL DE PAGAMENTO COMPARTILHADO --- */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Finalizar Pagamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-lg font-semibold text-center">
              Valor:{" "}
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(modalAmount)}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === "card" ? "secondary" : "outline"}
                onClick={() => setPaymentMethod("card")}
                className={`h-24 flex-col gap-2 ${
                  paymentMethod === "card" ? "border-2 border-primary" : ""
                }`}
              >
                <CreditCard className="h-8 w-8" />
                <span>Cartão de Crédito</span>
              </Button>
              <Button
                variant={paymentMethod === "pix" ? "secondary" : "outline"}
                onClick={() => setPaymentMethod("pix")}
                className={`h-24 flex-col gap-2 ${
                  paymentMethod === "pix" ? "border-2 border-green-500" : ""
                }`}
              >
                <span className="text-3xl font-bold">PIX</span>
              </Button>
            </div>

            {paymentMethod === "pix" && (
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-4">
                <img
                  src={QR_CODE_URL}
                  alt="QR Code PIX"
                  width={192}
                  height={192}
                  className="rounded-md"
                />
                <div className="w-full rounded-md bg-muted p-3 text-xs break-all text-muted-foreground">
                  {PIX_COPY_PASTE_STRING}
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => navigator.clipboard.writeText(PIX_COPY_PASTE_STRING)}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copiar Código Pix
                </Button>
                <Button className="w-full" variant="default" onClick={handlePaymentConfirmation}>
                  Confirmar Pagamento
                </Button>
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-4 rounded-lg border p-4">
                <p className="text-center text-muted-foreground">
                  Formulário de Cartão (Placeholder)
                </p>
                <Button className="w-full" variant="default" onClick={handlePaymentConfirmation}>
                  Pagar com Cartão
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* --- HISTÓRICO DE PAGAMENTOS --- */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>Visualize todos os pagamentos realizados</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum pagamento registrado</p>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(payment.amount)}
                      </span>
                      <Badge
                        className={
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {payment.status === "paid"
                          ? "Pago"
                          : payment.status === "pending"
                          ? "Pendente"
                          : "Cancelado"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {payment.method && `Método: ${payment.method}`}
                      {payment.paidAt &&
                        ` • ${new Date(payment.paidAt).toLocaleDateString("pt-BR")}`}
                    </div>
                  </div>
                  
                  {/* --- AÇÕES LADO DIREITO --- */}
                  <div className="flex gap-2">
                    {/* Botão Nota Fiscal se PAGO */}
                    {payment.status === "paid" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Nota Fiscal
                      </Button>
                    )}

                    {/* Botão Pagar se PENDENTE */}
                    {payment.status === "pending" && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => handleOpenPayModal(payment)}
                      >
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pagar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}