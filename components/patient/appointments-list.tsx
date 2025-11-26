// Information Expert: conhece e exibe consultas do paciente
// Low Coupling: independente de implementação interna
// Integrado com o MarcaConsultaController e catálogos

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, DollarSign } from "lucide-react"
import type { Consulta } from "@/lib/types"
import { marcaConsultaController } from "@/lib/controllers/marca-consulta-controller"
import { catalogoDisponibilidade } from "@/lib/catalogues/catalogo-disponibilidade"
import { useAuth } from "@/lib/hooks/use-auth"

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

interface ConsultaComDetalhes extends Consulta {
  medicoNome?: string
  especialidade?: string
  data?: string
  horario?: string
  valor?: number
}

export function AppointmentsList() {
  const { user } = useAuth()
  const [consultas, setConsultas] = useState<ConsultaComDetalhes[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConsultas()
  }, [user])

  const loadConsultas = async () => {
    if (!user) return
    setLoading(true)

    try {
      // Buscar consultas do paciente através do controller
      const consultasPaciente = marcaConsultaController.getConsultasPorPaciente(user.id)

      // Enriquecer com informações de médico, horário e disponibilidade
      const consultasDetalhadas: ConsultaComDetalhes[] = consultasPaciente.map((consulta) => {
        const disponibilidade = catalogoDisponibilidade.encontraDisponibilidade(consulta.CodDisp || "")
        const horario = disponibilidade ? catalogoDisponibilidade.getHorario(disponibilidade.CodHorario || "") : null
        const medico = horario ? catalogoDisponibilidade.getMedico(horario.CodMedico || "") : null
        const especialidade = medico ? catalogoDisponibilidade.getEspecialidade(medico.CodEspec || "") : null
        const pagamento = marcaConsultaController.getPagamento(consulta.CodConsulta)

        return {
          ...consulta,
          medicoNome: medico?.Nome,
          especialidade: especialidade?.Nome,
          data: disponibilidade?.Data,
          horario: horario ? `${horario.HoraIni} - ${horario.HoraFim}` : undefined,
          valor: pagamento?.Valor,
        }
      })

      setConsultas(consultasDetalhadas)
    } catch (error) {
      console.error("[v0] Error loading consultas:", error)
    } finally {
      setLoading(false)
    }
  }

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
        <CardDescription>Visualize e gerencie suas consultas agendadas</CardDescription>
      </CardHeader>
      <CardContent>
        {consultas.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Você não possui consultas agendadas</p>
            <p className="text-sm text-muted-foreground mt-2">Agende sua primeira consulta na aba "Agendar"</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultas.map((consulta) => (
              <div
                key={consulta.CodConsulta}
                className="flex flex-col p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[consulta.Status]}>{statusLabels[consulta.Status]}</Badge>
                    <span className="text-xs text-muted-foreground">Código: {consulta.CodConsulta}</span>
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
                        {consulta.especialidade && (
                          <p className="text-xs text-muted-foreground">{consulta.especialidade}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {consulta.data && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(consulta.data).toLocaleDateString("pt-BR", {
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
                </div>

                {consulta.Status === "agendada" && (
                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      Remarcar
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
