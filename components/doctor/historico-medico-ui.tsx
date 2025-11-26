// Information Expert: conhece e exibe histórico de consultas
// Controller: coordena filtros e visualização
// High Cohesion: focado em exibição de histórico

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Calendar, Search, FileText, User, Clock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Consulta } from "@/lib/types"

const mockConsultas: (Consulta & { pacienteNome: string; motivo: string })[] = [
  {
    CodConsulta: "C001",
    CodPaciente: "P001",
    CodDisponibilidade: "D001",
    DataConsulta: "2024-01-15",
    HoraConsulta: "09:00",
    FormaPagamento: "PIX",
    Status: "concluida",
    pacienteNome: "João Silva",
    motivo: "Dor no peito e falta de ar",
  },
  {
    CodConsulta: "C002",
    CodPaciente: "P002",
    CodDisponibilidade: "D002",
    DataConsulta: "2024-01-16",
    HoraConsulta: "14:30",
    FormaPagamento: "Cartão de Crédito",
    Status: "concluida",
    pacienteNome: "Maria Santos",
    motivo: "Acompanhamento de pressão alta",
  },
  {
    CodConsulta: "C003",
    CodPaciente: "P003",
    CodDisponibilidade: "D003",
    DataConsulta: "2024-01-17",
    HoraConsulta: "10:00",
    FormaPagamento: "Boleto",
    Status: "concluida",
    pacienteNome: "Pedro Costa",
    motivo: "Exame de rotina",
  },
]

export function HistoricoMedicoUI() {
  const [consultas] = useState(mockConsultas)
  const [filtroData, setFiltroData] = useState("")
  const [filtroPaciente, setFiltroPaciente] = useState("")
  const [consultaSelecionada, setConsultaSelecionada] = useState<typeof mockConsultas[0] | null>(null)

  const consultasFiltradas = consultas.filter((c) => {
    const matchData = !filtroData || c.DataConsulta === filtroData
    const matchPaciente = !filtroPaciente || c.pacienteNome.toLowerCase().includes(filtroPaciente.toLowerCase())
    return matchData && matchPaciente
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Consultas</CardTitle>
          <CardDescription>Visualize todas as consultas realizadas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filtroData">Filtrar por data</Label>
              <Input
                id="filtroData"
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filtroPaciente">Buscar paciente</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="filtroPaciente"
                  placeholder="Nome do paciente..."
                  value={filtroPaciente}
                  onChange={(e) => setFiltroPaciente(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Lista de consultas */}
          <div className="space-y-3">
            {consultasFiltradas.map((consulta) => (
              <Dialog key={consulta.CodConsulta}>
                <DialogTrigger asChild>
                  <Card className="cursor-pointer hover:bg-accent transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">{consulta.pacienteNome}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(consulta.DataConsulta).toLocaleDateString("pt-BR")}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {consulta.HoraConsulta}
                            </div>
                          </div>
                          <p className="text-sm">{consulta.motivo}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">{consulta.Status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Detalhes da Consulta</DialogTitle>
                    <DialogDescription>Informações completas do atendimento</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Paciente</Label>
                        <p className="font-medium">{consulta.pacienteNome}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Código</Label>
                        <p className="font-medium">{consulta.CodConsulta}</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Data</Label>
                        <p className="font-medium">{new Date(consulta.DataConsulta).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Horário</Label>
                        <p className="font-medium">{consulta.HoraConsulta}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Motivo do Atendimento</Label>
                      <p className="font-medium">{consulta.motivo}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Forma de Pagamento</Label>
                      <p className="font-medium">{consulta.FormaPagamento}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <Badge className="bg-green-100 text-green-700">{consulta.Status}</Badge>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}

            {consultasFiltradas.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma consulta encontrada com os filtros aplicados</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
