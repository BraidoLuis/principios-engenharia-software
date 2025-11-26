// Information Expert: gera relatórios de consultas
// Pure Fabrication: serviço especializado em relatórios

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockAppointments = [
  {
    id: "1",
    date: "2024-12-15",
    time: "14:00",
    patient: "João Silva",
    doctor: "Dr. Pedro Costa",
    specialty: "Cardiologia",
    status: "completed",
    payment: "paid",
  },
  {
    id: "2",
    date: "2024-12-16",
    time: "10:00",
    patient: "Maria Santos",
    doctor: "Dra. Ana Lima",
    specialty: "Dermatologia",
    status: "scheduled",
    payment: "pending",
  },
]

export function AppointmentsReport() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showResults, setShowResults] = useState(false)

  const handleGenerateReport = () => {
    setShowResults(true)
  }

  const handleExport = () => {
    alert("Relatório exportado em formato CSV")
  }

  const filteredAppointments = mockAppointments.filter((apt) => {
    if (filterStatus === "all") return true
    return apt.status === filterStatus
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Relatório de Consultas</CardTitle>
        <CardDescription>Gere relatórios detalhados sobre consultas realizadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Inicial</Label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data Final</Label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="scheduled">Agendadas</SelectItem>
                <SelectItem value="confirmed">Confirmadas</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerateReport} className="flex-1">
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
          {showResults && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          )}
        </div>

        {showResults && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{filteredAppointments.length}</div>
                  <p className="text-xs text-muted-foreground">Total de Consultas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {filteredAppointments.filter((a) => a.status === "completed").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Consultas Concluídas</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    R$ {filteredAppointments.filter((a) => a.payment === "paid").length * 150}
                  </div>
                  <p className="text-xs text-muted-foreground">Receita Total</p>
                </CardContent>
              </Card>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Horário</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Médico</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pagamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell>{new Date(apt.date).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>{apt.time}</TableCell>
                      <TableCell>{apt.patient}</TableCell>
                      <TableCell>{apt.doctor}</TableCell>
                      <TableCell>{apt.specialty}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            apt.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          }
                        >
                          {apt.status === "completed" ? "Concluída" : "Agendada"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            apt.payment === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {apt.payment === "paid" ? "Pago" : "Pendente"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
