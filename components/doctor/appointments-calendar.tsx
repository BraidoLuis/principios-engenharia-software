// Information Expert: visualiza consultas agendadas do médico
// Low Coupling: usa serviço de appointments

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, CheckCircle } from "lucide-react"
import type { Appointment } from "@/lib/types"
import { appointmentService } from "@/lib/services/appointment-service"
import { useAuth } from "@/lib/hooks/use-auth"

export function AppointmentsCalendar() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    loadAppointments()
  }, [user])

  const loadAppointments = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await appointmentService.getAppointmentsByDoctor(user.id)
      setAppointments(data)
    } catch (error) {
      console.error("Error loading appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (id: string) => {
    try {
      await appointmentService.updateAppointmentStatus(id, "confirmed")
      await loadAppointments()
    } catch (error) {
      console.error("Error confirming appointment:", error)
    }
  }

  const todayAppointments = appointments.filter((a) => a.date === selectedDate && a.status !== "cancelled")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agenda de Consultas</CardTitle>
        <CardDescription>Visualize e gerencie suas consultas do dia</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border rounded-md"
            />
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-8">Carregando...</p>
          ) : todayAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma consulta agendada para este dia</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.time}</span>
                        <Badge
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {appointment.status === "confirmed" ? "Confirmada" : "Agendada"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Paciente #{appointment.patientId}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Tipo: </span>
                        {appointment.type}
                      </div>
                      {appointment.notes && <p className="text-sm text-muted-foreground">{appointment.notes}</p>}
                    </div>
                    {appointment.status === "scheduled" && (
                      <Button size="sm" onClick={() => handleConfirm(appointment.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Confirmar
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
