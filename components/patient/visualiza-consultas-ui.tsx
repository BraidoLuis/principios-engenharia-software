// Boundary Pattern: interface com o usuário para visualizar consultas
// Low Coupling: comunica-se apenas com o controller
// High Cohesion: focado apenas em exibir consultas

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, DollarSign, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react"
import { visualizaConsultasController } from "@/lib/controllers/visualiza-consultas-controller"
import type { ConsultaDetalhada } from "@/lib/controllers/visualiza-consultas-controller"
import { useAuth } from "@/lib/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"

const statusColors = {
  agendada: "bg-blue-100 text-blue-700",
  confirmada: "bg-green-100 text-green-700",
  concluida: "bg-gray-100 text-gray-700",
  cancelada: "bg-red-100 text-red-700",
}

const statusLabels = {
  agendada: "Agendada",
  confirmada: "Confirmada",
  concluida: "Concluída",
  cancelada: "Cancelada",
}

const metodoPagamentoLabels: Record<string, string> = {
  "Cartão de Crédito": "Crédito",
  "Cartão de Débito": "Débito",
  PIX: "PIX",
  Dinheiro: "Dinheiro",
}

export function VisualizaConsultasUI({ idPaciente }: { idPaciente: string }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [consultasAgendadas, setConsultasAgendadas] = useState<ConsultaDetalhada[]>([])
  const [historicoConsultas, setHistoricoConsultas] = useState<ConsultaDetalhada[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarConsultas()
  }, [user])

  const carregarConsultas = () => {
    if (!user) return
    setLoading(true)

    try {
      // Busca consultas através do controller
    const agendadas = visualizaConsultasController.listarConsultasAgendadas(idPaciente)
    const historico = visualizaConsultasController.listarHistoricoConsultas(idPaciente)

      setConsultasAgendadas(agendadas)
      setHistoricoConsultas(historico)
    } catch (error) {
      console.error("[v0] Erro ao carregar consultas:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas consultas.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelar = (codConsulta: string) => {
    const sucesso = visualizaConsultasController.cancelarConsulta(codConsulta)

    if (sucesso) {
      toast({
        title: "Consulta cancelada",
        description: "Sua consulta foi cancelada com sucesso.",
      })
      carregarConsultas()
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar esta consulta.",
        variant: "destructive",
      })
    }
  }

  const handleConfirmar = (codConsulta: string) => {
    const sucesso = visualizaConsultasController.confirmarConsulta(codConsulta)

    if (sucesso) {
      toast({
        title: "Consulta confirmada",
        description: "Sua consulta foi confirmada com sucesso.",
      })
      carregarConsultas()
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível confirmar esta consulta.",
        variant: "destructive",
      })
    }
  }

  const renderConsulta = (consulta: ConsultaDetalhada, showActions = false) => (
    <div
      key={consulta.CodConsulta}
      className="flex flex-col p-4 border rounded-lg hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className={statusColors[consulta.Status]}>{statusLabels[consulta.Status]}</Badge>
          <span className="text-xs text-muted-foreground">#{consulta.CodConsulta}</span>
        </div>
        {consulta.valor && (
          <div className="flex items-center gap-1 text-lg font-bold text-primary">
            <DollarSign className="h-4 w-4" />
            R$ {consulta.valor.toFixed(2)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        {consulta.medicoNome && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium">{consulta.medicoNome}</p>
              {consulta.medicoEspecialidade && (
                <p className="text-xs text-muted-foreground">{consulta.medicoEspecialidade}</p>
              )}
            </div>
          </div>
        )}

        {consulta.data && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(consulta.data + "T00:00:00").toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {consulta.horario && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{consulta.horario}</span>
          </div>
        )}

        {consulta.metodoPagamento && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-4 w-4" />
            <span>{metodoPagamentoLabels[consulta.metodoPagamento] || consulta.metodoPagamento}</span>
          </div>
        )}
      </div>

      {showActions && consulta.Status === "agendada" && (
        <div className="mt-4 pt-4 border-t flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => handleConfirmar(consulta.CodConsulta)}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Confirmar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={() => handleCancelar(consulta.CodConsulta)}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
        </div>
      )}

      {showActions && consulta.Status === "confirmada" && (
        <div className="mt-4 pt-4 border-t flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => handleCancelar(consulta.CodConsulta)}
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Cancelar Consulta
          </Button>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground">Carregando consultas...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Consultas</CardTitle>
        <CardDescription>Visualize e gerencie suas consultas médicas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="agendadas" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="agendadas">
              Agendadas
              {consultasAgendadas.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {consultasAgendadas.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="agendadas" className="mt-4">
            {consultasAgendadas.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Você não possui consultas agendadas</p>
                <p className="text-sm text-muted-foreground mt-2">Agende sua primeira consulta na aba "Agendar"</p>
              </div>
            ) : (
              <div className="space-y-4">{consultasAgendadas.map((c) => renderConsulta(c, true))}</div>
            )}
          </TabsContent>

          <TabsContent value="historico" className="mt-4">
            {historicoConsultas.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Você ainda não possui histórico de consultas</p>
              </div>
            ) : (
              <div className="space-y-4">{historicoConsultas.map((c) => renderConsulta(c, false))}</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
