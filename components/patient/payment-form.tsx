// Pure Fabrication: especializado em pagamentos
// High Cohesion: foco apenas em processamento de pagamento

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, Wallet } from "lucide-react"

interface PaymentFormProps {
  appointmentId: string
  amount: number
  onSuccess: () => void
}

export function PaymentForm({ appointmentId, amount, onSuccess }: PaymentFormProps) {
  const [method, setMethod] = useState<"credit_card" | "debit_card" | "pix" | "money">("credit_card")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simular processamento de pagamento
    setTimeout(() => {
      setLoading(false)
      onSuccess()
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento da Consulta</CardTitle>
        <CardDescription>Complete o pagamento para confirmar sua consulta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-4 bg-accent rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Valor da consulta</span>
              <span className="text-2xl font-bold">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(amount)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={method === "credit_card" ? "default" : "outline"}
                onClick={() => setMethod("credit_card")}
                className="h-20 flex-col gap-2"
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Crédito</span>
              </Button>
              <Button
                type="button"
                variant={method === "debit_card" ? "default" : "outline"}
                onClick={() => setMethod("debit_card")}
                className="h-20 flex-col gap-2"
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-sm">Débito</span>
              </Button>
              <Button
                type="button"
                variant={method === "pix" ? "default" : "outline"}
                onClick={() => setMethod("pix")}
                className="h-20 flex-col gap-2"
              >
                <Smartphone className="h-6 w-6" />
                <span className="text-sm">PIX</span>
              </Button>
              <Button
                type="button"
                variant={method === "money" ? "default" : "outline"}
                onClick={() => setMethod("money")}
                className="h-20 flex-col gap-2"
              >
                <Wallet className="h-6 w-6" />
                <span className="text-sm">Dinheiro</span>
              </Button>
            </div>
          </div>

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
            </>
          )}

          {method === "pix" && (
            <div className="p-4 bg-accent rounded-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Escaneie o QR Code ou copie o código PIX</p>
              <div className="h-48 bg-white rounded flex items-center justify-center">
                <Smartphone className="h-24 w-24 text-muted-foreground" />
              </div>
              <Button variant="outline" className="w-full bg-transparent">
                Copiar Código PIX
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processando..." : "Confirmar Pagamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
