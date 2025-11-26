// Controller + Pure Fabrication: coordena processo de pagamento
// High Cohesion: focado em fluxo de pagamento
// Protected Variations: protege mudanças em métodos de pagamento

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Smartphone, FileText, Download, Copy, CheckCircle } from 'lucide-react'
import type { Pagamento } from "@/lib/types"

interface PagamentoConsultaUIProps {
  codConsulta: string
  valor: number
  onSuccess: () => void
}

export function PagamentoConsultaUI({ codConsulta, valor, onSuccess }: PagamentoConsultaUIProps) {
  const { toast } = useToast()
  const [tipoPagamento, setTipoPagamento] = useState<"PIX" | "Boleto" | "Cartão de Crédito">("PIX")
  const [loading, setLoading] = useState(false)
  const [pixCode, setPixCode] = useState("00020126330014BR.GOV.BCB.PIX2511098765432150300017BR.GOV.BCB.PIX5204000053039865802BR5913Clinica Saude6009SAO PAULO")
  const [copied, setCopied] = useState(false)
  const [dadosCartao, setDadosCartao] = useState({
    numero: "",
    validade: "",
    cvv: "",
    nome: "",
  })

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode)
    setCopied(true)
    toast({
      title: "Código copiado!",
      description: "Cole no app do seu banco para pagar",
    })
    setTimeout(() => setCopied(false), 3000)
  }

  const handleBaixarBoleto = () => {
    toast({
      title: "Boleto gerado!",
      description: "O download do PDF começará em instantes",
    })
    // Simular download
    console.log("[v0] Gerando boleto PDF para consulta:", codConsulta)
  }

  const handlePagar = async () => {
    setLoading(true)

    try {
      // Validações por tipo de pagamento
      if (tipoPagamento === "Cartão de Crédito") {
        if (!dadosCartao.numero || !dadosCartao.validade || !dadosCartao.cvv || !dadosCartao.nome) {
          toast({
            title: "Dados incompletos",
            description: "Preencha todos os dados do cartão",
            variant: "destructive",
          })
          setLoading(false)
          return
        }
      }

      const novoPagamento: Omit<Pagamento, "CodPagamento"> = {
        CodConsulta: codConsulta,
        Valor: valor,
        TipoPagam: tipoPagamento,
        DataPagamento: new Date().toISOString().split("T")[0],
        Status: "Pago",
      }

      console.log("[v0] Processando pagamento:", novoPagamento)

      // Simular processamento
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Pagamento confirmado!",
        description: "Sua consulta está confirmada. Você receberá um email de confirmação.",
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Pagamento da Consulta</CardTitle>
        <CardDescription>Complete o pagamento para garantir seu agendamento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Valor */}
        <div className="p-4 bg-primary/10 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Valor da Consulta</span>
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(valor)}
            </span>
          </div>
        </div>

        {/* Método de pagamento */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Escolha a forma de pagamento</Label>
          <RadioGroup value={tipoPagamento} onValueChange={(v) => setTipoPagamento(v as any)}>
            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="PIX" id="pix" />
              <Label htmlFor="pix" className="flex items-center gap-3 flex-1 cursor-pointer">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">PIX</p>
                  <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="Boleto" id="boleto" />
              <Label htmlFor="boleto" className="flex items-center gap-3 flex-1 cursor-pointer">
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Boleto Bancário</p>
                  <p className="text-sm text-muted-foreground">Vencimento em 3 dias úteis</p>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="Cartão de Crédito" id="cartao" />
              <Label htmlFor="cartao" className="flex items-center gap-3 flex-1 cursor-pointer">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Cartão de Crédito</p>
                  <p className="text-sm text-muted-foreground">À vista ou parcelado</p>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Detalhes por método */}
        {tipoPagamento === "PIX" && (
          <div className="space-y-4 p-4 bg-accent rounded-lg">
            <p className="text-sm font-medium">Escaneie o QR Code ou copie o código PIX</p>
            <div className="flex justify-center p-6 bg-white rounded-lg">
              <div className="text-center space-y-2">
                <div className="h-48 w-48 bg-muted rounded flex items-center justify-center">
                  <Smartphone className="h-24 w-24 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">QR Code PIX</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Código PIX Copia e Cola</Label>
              <div className="flex gap-2">
                <Input value={pixCode} readOnly className="font-mono text-xs" />
                <Button type="button" variant="outline" size="icon" onClick={handleCopyPix}>
                  {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Após o pagamento, a confirmação é automática e você receberá um email
            </p>
          </div>
        )}

        {tipoPagamento === "Boleto" && (
          <div className="space-y-4 p-4 bg-accent rounded-lg">
            <p className="text-sm font-medium">Baixe o boleto e pague em qualquer banco</p>
            <Button type="button" variant="outline" className="w-full" onClick={handleBaixarBoleto}>
              <Download className="h-4 w-4 mr-2" />
              Baixar Boleto em PDF
            </Button>
            <p className="text-xs text-muted-foreground">
              Vencimento em 3 dias úteis. Após o pagamento, pode levar até 2 dias úteis para compensar.
            </p>
          </div>
        )}

        {tipoPagamento === "Cartão de Crédito" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="numeroCartao">Número do Cartão *</Label>
              <Input
                id="numeroCartao"
                placeholder="0000 0000 0000 0000"
                value={dadosCartao.numero}
                onChange={(e) => setDadosCartao({ ...dadosCartao, numero: e.target.value })}
                maxLength={19}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomeCartao">Nome impresso no cartão *</Label>
              <Input
                id="nomeCartao"
                placeholder="NOME COMPLETO"
                value={dadosCartao.nome}
                onChange={(e) => setDadosCartao({ ...dadosCartao, nome: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validade">Validade *</Label>
                <Input
                  id="validade"
                  placeholder="MM/AA"
                  value={dadosCartao.validade}
                  onChange={(e) => setDadosCartao({ ...dadosCartao, validade: e.target.value })}
                  maxLength={5}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={dadosCartao.cvv}
                  onChange={(e) => setDadosCartao({ ...dadosCartao, cvv: e.target.value })}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Botão de confirmação */}
        <Button onClick={handlePagar} className="w-full" size="lg" disabled={loading}>
          {loading ? "Processando pagamento..." : "Confirmar Pagamento"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Seus dados estão seguros. Utilizamos criptografia de ponta a ponta.
        </p>
      </CardContent>
    </Card>
  )
}
