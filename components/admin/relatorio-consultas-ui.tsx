// Information Expert: conhece e gera relatórios
// Controller: coordena filtros e exportação
// High Cohesion: focado em geração de relatórios

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { FileDown, FileSpreadsheet, Calendar } from 'lucide-react'

const mockRelatorio = [
  {
    codigo: "C001",
    paciente: "João Silva",
    medico: "Dr. Pedro Costa",
    especialidade: "Cardiologia",
    data: "2024-01-15",
    hora: "09:00",
    status: "Realizada",
    tipo: "Presencial",
    valor: 250,
  },
  {
    codigo: "C002",
    paciente: "Maria Santos",
    medico: "Dra. Ana Lima",
    especialidade: "Dermatologia",
    data: "2024-01-16",
    hora: "14:30",
    status: "Realizada",
    tipo: "Presencial",
    valor: 200,
  },
  {
    codigo: "C003",
    paciente: "Pedro Costa",
    medico: "Dr. Pedro Costa",
    especialidade: "Cardiologia",
    data: "2024-01-17",
    hora: "10:00",
    status: "Cancelada",
    tipo: "Presencial",
    motivo: "Paciente não compareceu",
    valor: 250,
  },
]

export function RelatorioConsultasUI() {
  const { toast } = useToast()
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim, setDataFim] = useState("")
  const [filtroMedico, setFiltroMedico] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("todos")

  const consultasFiltradas = mockRelatorio.filter((c) => {
    const matchMedico = filtroMedico === "todos" || c.medico.includes(filtroMedico)
    const matchStatus = filtroStatus === "todos" || c.status === filtroStatus
    const matchEsp = filtroEspecialidade === "todos" || c.especialidade === filtroEspecialidade
    return matchMedico && matchStatus && matchEsp
  })

  const totalConsultas = consultasFiltradas.length
  const totalReceita = consultasFiltradas
    .filter((c) => c.status === "Realizada")
    .reduce((acc, c) => acc + c.valor, 0)

  const handleExportarPDF = () => {
    toast({
      title: "Gerando PDF...",
      description: "O download começará em instantes",
    })
    console.log("[v0] Exportando relatório em PDF")
  }

  const handleExportarExcel = () => {
    toast({
      title: "Gerando Excel...",
      description: "O download começará em instantes",
    })
    console.log("[v0] Exportando relatório em Excel")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Relatório de Consultas</CardTitle>
        <CardDescription>Visualize e exporte relatórios detalhados de consultas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filtros */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input id="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="filtroMedico">Médico</Label>
            <Select value={filtroMedico} onValueChange={setFiltroMedico}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Pedro">Dr. Pedro Costa</SelectItem>
                <SelectItem value="Ana">Dra. Ana Lima</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filtroEspecialidade">Especialidade</Label>
            <Select value={filtroEspecialidade} onValueChange={setFiltroEspecialidade}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                <SelectItem value="Dermatologia">Dermatologia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filtroStatus">Status</Label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Realizada">Realizada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
                <SelectItem value="Agendada">Agendada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Consultas</p>
                  <p className="text-2xl font-bold">{totalConsultas}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(totalReceita)}
                  </p>
                </div>
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Realizadas</p>
                  <p className="text-2xl font-bold">
                    {consultasFiltradas.filter((c) => c.status === "Realizada").length}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">OK</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela */}
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consultasFiltradas.map((consulta) => (
                <TableRow key={consulta.codigo}>
                  <TableCell className="font-mono text-sm">{consulta.codigo}</TableCell>
                  <TableCell className="font-medium">{consulta.paciente}</TableCell>
                  <TableCell>{consulta.medico}</TableCell>
                  <TableCell>{consulta.especialidade}</TableCell>
                  <TableCell>{new Date(consulta.data).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{consulta.hora}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        consulta.status === "Realizada"
                          ? "bg-green-100 text-green-700"
                          : consulta.status === "Cancelada"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }
                    >
                      {consulta.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{consulta.tipo}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(consulta.valor)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Botões de exportação */}
        <div className="flex gap-3">
          <Button onClick={handleExportarPDF} variant="outline" className="flex-1">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button onClick={handleExportarExcel} variant="outline" className="flex-1">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
