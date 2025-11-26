// Creator: cria fluxo de checkout
// High Cohesion: focado em processo de pagamento

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Smartphone, Wallet, DollarSign, Check } from "lucide-react"
import { paymentService } from "@/lib/services/payment-service"

interface CheckoutModalProps {
  open: boolean
  onClose: () => void
  appointmentId: string
  amount: number
  onSuccess: () => void
}

export function CheckoutModal({ open, onClose, appointmentId, amount, onSuccess }: CheckoutModalProps) {
  const [step, setStep] = useState<"method" | "details" | "success">("method")
  const [method, setMethod] = useState<"credit_card" | "debit_card" | "pix" | "money">("credit_card")
  const [loading, setLoading] = useState(false)

  const handleMethodSelect = (value: string) => {
    setMethod(value as any)
    if (value === "money") {
      setStep("details")
    } else {
      setStep("details")
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Criar pagamento
      const payment = await paymentService.createPayment({
        appointmentId,
        amount,
        status: "pending",
      })

      // Processar pagamento
      await paymentService.processPayment(payment.id, method)

      setStep("success")
      setTimeout(() => {
        onSuccess()
        handleClose()
      }, 2000)
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setStep("method")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "method" && (
          <>
            <DialogHeader>
              <DialogTitle>Escolha o Método de Pagamento</DialogTitle>
              <DialogDescription>
                Valor:{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(amount)}
              </DialogDescription>
            </DialogHeader>
            <RadioGroup value={method} onValueChange={handleMethodSelect}>
              <div className="grid grid-cols-2 gap-3">
                <label
                  htmlFor="credit_card"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    method === "credit_card" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="credit_card" id="credit_card" className="sr-only" />
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm font-medium">Crédito</span>
                </label>

                <label
                  htmlFor="debit_card"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    method === "debit_card" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="debit_card" id="debit_card" className="sr-only" />
                  <CreditCard className="h-6 w-6" />
                  <span className="text-sm font-medium">Débito</span>
                </label>

                <label
                  htmlFor="pix"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    method === "pix" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="pix" id="pix" className="sr-only" />
                  <Smartphone className="h-6 w-6" />
                  <span className="text-sm font-medium">PIX</span>
                </label>

                <label
                  htmlFor="money"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    method === "money" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <RadioGroupItem value="money" id="money" className="sr-only" />
                  <Wallet className="h-6 w-6" />
                  <span className="text-sm font-medium">Dinheiro</span>
                </label>
              </div>
            </RadioGroup>
          </>
        )}

        {step === "details" && (
          <>
            <DialogHeader>
              <DialogTitle>Dados do Pagamento</DialogTitle>
              <DialogDescription>Complete as informações para finalizar</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {(method === "credit_card" || method === "debit_card") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input id="cardNumber" placeholder="0000 0000 0000 0000" maxLength={19} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Validade</Label>
                      <Input id="expiry" placeholder="MM/AA" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" maxLength={4} type="password" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input id="cardName" placeholder="Nome como no cartão" />
                  </div>
                </>
              )}

              {method === "pix" && (
                <div className="space-y-4">
                  <div className="p-4 bg-accent rounded-lg text-center">
                    <div className="h-48 bg-white rounded flex items-center justify-center mb-3">
                      <Smartphone className="h-24 w-24 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Escaneie o QR Code com seu app de pagamentos</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Copiar Código PIX
                  </Button>
                </div>
              )}

              {method === "money" && (
                <div className="p-4 bg-accent rounded-lg text-center space-y-2">
                  <DollarSign className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-sm">Confirme o pagamento em dinheiro no local</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                  Voltar
                </Button>
                <Button onClick={handlePayment} disabled={loading} className="flex-1">
                  {loading ? "Processando..." : "Confirmar Pagamento"}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Pagamento Confirmado!</h3>
              <p className="text-sm text-muted-foreground">Seu pagamento foi processado com sucesso</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
