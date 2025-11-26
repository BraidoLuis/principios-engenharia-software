// Boundary: interface do usuário para cadastrar horários
// Low Coupling: comunica apenas com o controller

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Plus, Trash2, Edit2, Save, X } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import CadastraHorarioController from "@/lib/controllers/cadastra-horario-controller"
import { Horario } from "@/lib/types"

const daysOfWeek = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
]

const timeOptions = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00",
]

interface CadastraHorarioUIProps {
  codMedico: string
}

export function CadastraHorarioUI({ codMedico }: CadastraHorarioUIProps) {
  const { toast } = useToast()
  const [controller] = useState(() => new CadastraHorarioController())
  const [horarios, setHorarios] = useState<Horario[]>([])
  
  // Estado para novo horário
  const [newDay, setNewDay] = useState("Segunda-feira")
  const [newStartTime, setNewStartTime] = useState("08:00")
  const [newEndTime, setNewEndTime] = useState("12:00")

  // Estado para edição
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDay, setEditDay] = useState("")
  const [editStartTime, setEditStartTime] = useState("")
  const [editEndTime, setEditEndTime] = useState("")

  // Carrega horários do médico
  useEffect(() => {
    carregarHorarios()
  }, [codMedico])

  const carregarHorarios = () => {
    const horariosCarregados = controller.listarHorariosMedico(codMedico)
    setHorarios(horariosCarregados)
  }

  const handleAddSchedule = () => {
    const resultado = controller.cadastrarHorario(
      newDay,
      newStartTime,
      newEndTime,
      codMedico
    )

    if (resultado.sucesso) {
      toast({
        title: "Sucesso",
        description: resultado.mensagem,
      })
      carregarHorarios()
      // Reset form
      setNewDay("Segunda-feira")
      setNewStartTime("08:00")
      setNewEndTime("12:00")
    } else {
      toast({
        title: "Erro",
        description: resultado.mensagem,
        variant: "destructive",
      })
    }
  }

  const handleRemoveSchedule = (codHorario: string) => {
    const resultado = controller.removerHorario(codHorario)
    
    if (resultado.sucesso) {
      toast({
        title: "Sucesso",
        description: resultado.mensagem,
      })
      carregarHorarios()
    } else {
      toast({
        title: "Erro",
        description: resultado.mensagem,
        variant: "destructive",
      })
    }
  }

  const startEditing = (horario: Horario) => {
    setEditingId(horario.CodHorario)
    setEditDay(horario.Dia)
    setEditStartTime(horario.HoraIni)
    setEditEndTime(horario.HoraFim)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditDay("")
    setEditStartTime("")
    setEditEndTime("")
  }

  const handleUpdateSchedule = () => {
    if (!editingId) return

    const resultado = controller.atualizarHorario(
      editingId,
      editDay,
      editStartTime,
      editEndTime
    )

    if (resultado.sucesso) {
      toast({
        title: "Sucesso",
        description: resultado.mensagem,
      })
      carregarHorarios()
      cancelEditing()
    } else {
      toast({
        title: "Erro",
        description: resultado.mensagem,
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Horários de Atendimento</CardTitle>
        <CardDescription>Configure seus horários disponíveis para consultas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lista de horários cadastrados */}
        <div className="space-y-4">
          <h3 className="font-medium">Horários Cadastrados</h3>
          {horarios.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum horário cadastrado</p>
          ) : (
            <div className="space-y-3">
              {horarios.map((horario) => (
                <div key={horario.CodHorario} className="flex items-center justify-between p-3 border rounded-lg">
                  {editingId === horario.CodHorario ? (
                    // Modo de edição
                    <div className="flex-1 space-y-3">
                      <div className="grid gap-3">
                        <Select value={editDay} onValueChange={setEditDay}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {daysOfWeek.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="grid grid-cols-2 gap-2">
                          <Select value={editStartTime} onValueChange={setEditStartTime}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={editEndTime} onValueChange={setEditEndTime}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateSchedule}>
                          <Save className="h-4 w-4 mr-1" />
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEditing}>
                          <X className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Modo de visualização
                    <>
                      <div className="flex items-center gap-4 flex-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{horario.Dia}</div>
                          <div className="text-sm text-muted-foreground">
                            {horario.HoraIni} - {horario.HoraFim}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(horario)}
                        >
                          <Edit2 className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSchedule(horario.CodHorario)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Formulário para adicionar novo horário */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Adicionar Novo Horário</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Dia da Semana</Label>
              <Select value={newDay} onValueChange={setNewDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Horário Início</Label>
                <Select value={newStartTime} onValueChange={setNewStartTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horário Fim</Label>
                <Select value={newEndTime} onValueChange={setNewEndTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddSchedule} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Horário
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
