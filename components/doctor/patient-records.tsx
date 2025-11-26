// Information Expert: gerencia registros de pacientes
// Protected Variations: protege acesso a dados sensíveis

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockPatients = [
  {
    id: "1",
    name: "João Silva",
    cpf: "123.456.789-00",
    phone: "(11) 98765-4321",
    lastVisit: "2024-12-15",
    history: [
      {
        date: "2024-12-15",
        diagnosis: "Hipertensão leve",
        prescription: "Losartana 50mg",
      },
    ],
  },
]

export function PatientRecords() {
  const [search, setSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<(typeof mockPatients)[0] | null>(null)

  const filteredPatients = mockPatients.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pacientes</CardTitle>
        <CardDescription>Consulte o histórico médico dos seus pacientes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou CPF"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {!selectedPatient ? (
            <div className="space-y-2">
              {filteredPatients.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum paciente encontrado</p>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{patient.name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">CPF: {patient.cpf}</div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Última consulta</div>
                        <div>{new Date(patient.lastVisit).toLocaleDateString("pt-BR")}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{selectedPatient.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPatient.cpf}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                  Voltar
                </Button>
              </div>

              <Tabs defaultValue="history">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                  <TabsTrigger value="info">Informações</TabsTrigger>
                </TabsList>
                <TabsContent value="history" className="space-y-4">
                  {selectedPatient.history.map((record, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(record.date).toLocaleDateString("pt-BR")}
                      </div>
                      <div>
                        <span className="font-medium">Diagnóstico: </span>
                        {record.diagnosis}
                      </div>
                      <div>
                        <span className="font-medium">Prescrição: </span>
                        {record.prescription}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="info" className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Telefone: </span>
                      {selectedPatient.phone}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">CPF: </span>
                      {selectedPatient.cpf}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
