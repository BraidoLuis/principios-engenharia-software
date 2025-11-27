"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // <--- NOVO
import { Label } from "@/components/ui/label" // <--- NOVO
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DollarSign, CreditCard, TrendingUp, Download, Copy, Lock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { marcaConsultaController } from "@/lib/controllers/marca-consulta-controller"

interface DashboardPayment {
  id: string
  amount: number
  status: "paid" | "pending" | "failed" | "cancelled"
  method: string
  paidAt: string | null
  codConsulta?: string
}

const DEFAULT_AMOUNT = 250.0
const PIX_COPY_PASTE_STRING = "00020126360014BR.GOV.BCB.PIX0114+558199999999925204000053039865802BR5907Company6009City7008City99945802BR"
const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(PIX_COPY_PASTE_STRING)}`

export function PaymentDashboard() {
  const { user } = useAuth()
  
  const [payments, setPayments] = useState<DashboardPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [selectedPayment, setSelectedPayment] = useState<DashboardPayment | null>(null)

  // --- NOVO: Estado para os dados do cartão ---
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  })

  useEffect(() => {
    if (user?.id) {
      loadPayments()
    }
  }, [user])

  const loadPayments = async () => {
    setLoading(true)
    try {
      if (!user?.id) return

      const pagamentosReais = marcaConsultaController.getPagamentosPorPaciente(user.id)
      
      const mappedPayments: DashboardPayment[] = pagamentosReais.map((p) => {
        const isPaid = p.Status === "Pago" || (p.DataPagam && p.DataPagam.length > 0 && p.Status !== "Pendente")
        
        return {
          id: p.CodPagamento,
          amount: p.Valor,
          status: isPaid ? "paid" : "pending",
          method: p.TipoPagam || "Pendente",
          paidAt: isPaid ? `${p.DataPagam} ${p.HoraPagam || ""}` : null,
          codConsulta: p.CodConsulta
        }
      })

      mappedPayments.sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
      })

      setPayments(mappedPayments)
    } catch (error) {
      console.error("Error loading payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenPayModal = (payment?: DashboardPayment) => {
    if (payment) {
      setSelectedPayment(payment)
    } else {
      setSelectedPayment(null) 
    }
    // Reseta o form do cartão ao abrir
    setCardData({ number: "", name: "", expiry: "", cvv: "" })
    setPaymentMethod("pix") 
    setIsPaymentModalOpen(true)
  }

  // --- NOVO: Formatadores de input ---
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    value = value.replace(/(\d{4})/g, "$1 ").trim()
    setCardData({ ...cardData, number: value.substring(0, 19) })
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }
    setCardData({ ...cardData, expiry: value.substring(0, 5) })
  }

  const handlePaymentConfirmation = () => {
    // --- NOVO: Validação simples do cartão ---
    if (paymentMethod === "card") {
      if (cardData.number.length < 16 || !cardData.name || cardData.expiry.length < 5 || cardData.cvv.length < 3) {
        alert("Por favor, preencha todos os dados do cartão corretamente.")
        return
      }
    }

    if (selectedPayment) {
      const sucesso = marcaConsultaController.confirmarPagamento(
        selectedPayment.id, 
        paymentMethod as "credito" | "pix"
      )

      if (sucesso) {
        loadPayments()
        alert("Pagamento confirmado com sucesso!")
      } else {
        alert("Erro ao processar pagamento.")
      }
    } else {
        alert("Pagamento avulso registrado (apenas visual).")
    }

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pago</CardTitle>
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
              {payments.filter((p) => p.status === "paid").length} consultas pagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Pagamento</CardTitle>
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
              {payments.filter((p) => p.status === "pending").length} pendências
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status Geral</CardTitle>
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
            <p className="text-xs text-muted-foreground">Taxa de quitação</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => handleOpenPayModal()}>Realizar Pagamento Avulso</Button>
      </div>

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
             
            {selectedPayment?.codConsulta && (
                <p className="text-xs text-center text-muted-foreground">Ref. Consulta: {selectedPayment.codConsulta}</p>
            )}

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

            {/* --- NOVO: Formulário de Cartão de Crédito --- */}
            {paymentMethod === "card" && (
              <div className="space-y-4 rounded-lg border p-4 bg-card">
                <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <div className="relative">
                        <Input 
                            id="cardNumber" 
                            placeholder="0000 0000 0000 0000" 
                            value={cardData.number}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="pl-9"
                        />
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input 
                        id="cardName" 
                        placeholder="COMO NO CARTÃO" 
                        value={cardData.name}
                        onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="expiry">Validade</Label>
                        <Input 
                            id="expiry" 
                            placeholder="MM/AA" 
                            value={cardData.expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <div className="relative">
                            <Input 
                                id="cvv" 
                                placeholder="123" 
                                type="password"
                                maxLength={4}
                                value={cardData.cvv}
                                onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, "")})}
                                className="pl-9"
                            />
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                </div>

                <Button className="w-full" variant="default" onClick={handlePaymentConfirmation}>
                  Pagar {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(modalAmount)}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Minhas Consultas e Pagamentos</CardTitle>
          <CardDescription>Visualize o status financeiro de suas consultas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma consulta ou pagamento registrado</p>
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
                      Método: {payment.method} 
                      {payment.paidAt &&
                         ` • ${payment.paidAt}`}
                      {payment.codConsulta && ` • Ref: ${payment.codConsulta}`}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {payment.status === "paid" && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        NF
                      </Button>
                    )}

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