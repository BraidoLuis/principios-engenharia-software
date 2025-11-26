// Controller: coordena o agendamento de consultas
// Creator: cria novos agendamentos

"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { appointmentService } from "@/lib/services/appointment-service"
import { useAuth } from "@/lib/hooks/use-auth"
import { Clock } from "lucide-react"

const mockDoctors = [
  { id: "1", name: "Dr. João Silva", specialty: "Cardiologista" },
  { id: "2", name: "Dra. Maria Santos", specialty: "Dermatologista" },
  { id: "3", name: "Dr. Pedro Costa", specialty: "Clínico Geral" },
]

const availableTimes = ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

export function AppointmentBooking() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date>()
  const [doctorId, setDoctorId] = useState("")
  const [time, setTime] = useState("")
  const [type, setType] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !doctorId || !time || !user) return

    setLoading(true)
    try {
      await appointmentService.createAppointment({
        patientId: "CP001",
        doctorId,
        date: date.toISOString().split("T")[0],
        time,
        status: "scheduled",
        type,
        notes,
      })
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setDate(undefined)
        setDoctorId("")
        setTime("")
        setType("")
        setNotes("")
      }, 2000)
    } catch (error) {
      console.error("Error booking appointment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendar Nova Consulta</CardTitle>
        <CardDescription>Escolha o médico, data e horário para sua consulta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Selecione o Médico</Label>
            <Select value={doctorId} onValueChange={setDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um médico" />
              </SelectTrigger>
              <SelectContent>
                {mockDoctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Selecione a Data</Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </div>
          </div>

          {date && (
            <div className="space-y-2">
              <Label>Horário Disponível</Label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant={time === t ? "default" : "outline"}
                    onClick={() => setTime(t)}
                    className="w-full"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Consulta</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consulta de rotina">Consulta de rotina</SelectItem>
                <SelectItem value="Retorno">Retorno</SelectItem>
                <SelectItem value="Emergência">Emergência</SelectItem>
                <SelectItem value="Exames">Exames</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Descreva seus sintomas ou motivo da consulta"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          {success && <div className="p-4 bg-green-50 text-green-700 rounded-md">Consulta agendada com sucesso!</div>}

          <Button type="submit" className="w-full" disabled={loading || !date || !doctorId || !time}>
            {loading ? "Agendando..." : "Confirmar Agendamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
