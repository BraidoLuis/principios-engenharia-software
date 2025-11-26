// Information Expert: gerencia horários de atendimento do médico
// Creator: cria novos horários disponíveis

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Clock, Plus, Trash2 } from "lucide-react"

interface TimeSlot {
  id: string
  dayOfWeek: number
  dayName: string
  startTime: string
  endTime: string
  isActive: boolean
}

const daysOfWeek = [
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
]

const timeOptions = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

export function ScheduleManager() {
  const [schedules, setSchedules] = useState<TimeSlot[]>([
    {
      id: "1",
      dayOfWeek: 1,
      dayName: "Segunda-feira",
      startTime: "08:00",
      endTime: "12:00",
      isActive: true,
    },
    {
      id: "2",
      dayOfWeek: 1,
      dayName: "Segunda-feira",
      startTime: "14:00",
      endTime: "18:00",
      isActive: true,
    },
  ])

  const [newDay, setNewDay] = useState<number>(1)
  const [newStartTime, setNewStartTime] = useState("08:00")
  const [newEndTime, setNewEndTime] = useState("12:00")

  const handleAddSchedule = () => {
    const dayName = daysOfWeek.find((d) => d.value === newDay)?.label || ""
    const newSchedule: TimeSlot = {
      id: Math.random().toString(36).substr(2, 9),
      dayOfWeek: newDay,
      dayName,
      startTime: newStartTime,
      endTime: newEndTime,
      isActive: true,
    }
    setSchedules([...schedules, newSchedule])
  }

  const handleRemoveSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id))
  }

  const handleToggleActive = (id: string) => {
    setSchedules(schedules.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Horários de Atendimento</CardTitle>
        <CardDescription>Configure seus horários disponíveis para consultas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">Horários Cadastrados</h3>
          {schedules.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum horário cadastrado</p>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{schedule.dayName}</div>
                      <div className="text-sm text-muted-foreground">
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={schedule.isActive} onCheckedChange={() => handleToggleActive(schedule.id)} />
                      <span className="text-xs text-muted-foreground">{schedule.isActive ? "Ativo" : "Inativo"}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveSchedule(schedule.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-medium">Adicionar Novo Horário</h3>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Dia da Semana</Label>
              <Select value={newDay.toString()} onValueChange={(v) => setNewDay(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Início</Label>
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
                <Label>Fim</Label>
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
