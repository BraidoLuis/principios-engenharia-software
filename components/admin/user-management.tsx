// Controller: coordena gerenciamento de usuários
// Creator: cria e modifica usuários

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const mockPatients = [
  { id: "1", name: "João Silva", email: "joao@email.com", phone: "(11) 98765-4321", status: "active" },
  { id: "2", name: "Maria Santos", email: "maria@email.com", phone: "(11) 98765-4322", status: "active" },
]

const mockDoctors = [
  {
    id: "1",
    name: "Dr. Pedro Costa",
    email: "pedro@email.com",
    specialty: "Cardiologia",
    crm: "12345-SP",
    status: "active",
  },
  {
    id: "2",
    name: "Dra. Ana Lima",
    email: "ana@email.com",
    specialty: "Dermatologia",
    crm: "67890-SP",
    status: "active",
  },
]

export function UserManagement() {
  const [searchPatient, setSearchPatient] = useState("")
  const [searchDoctor, setSearchDoctor] = useState("")

  const filteredPatients = mockPatients.filter((p) => p.name.toLowerCase().includes(searchPatient.toLowerCase()))

  const filteredDoctors = mockDoctors.filter((d) => d.name.toLowerCase().includes(searchDoctor.toLowerCase()))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciamento de Usuários</CardTitle>
        <CardDescription>Administre pacientes e médicos cadastrados no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patients">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
            <TabsTrigger value="doctors">Médicos</TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar pacientes..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Paciente
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar médicos..."
                  value={searchDoctor}
                  onChange={(e) => setSearchDoctor(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Médico
              </Button>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>CRM</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">{doctor.name}</TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>{doctor.crm}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">Ativo</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
