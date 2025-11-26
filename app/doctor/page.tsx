// Controller: coordena portal do médico
// Polymorphism: interface específica para médico

"use client"

import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from "@/lib/hooks/use-auth"
import { AppHeader } from "@/components/layout/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentsCalendar } from "@/components/doctor/appointments-calendar"
import { CadastraHorarioUI } from "@/components/doctor/cadastra-horario-ui"
import { PrescriptionForm } from "@/components/doctor/prescription-form"
import { PatientRecords } from "@/components/doctor/patient-records"
import { Calendar, Clock, FileText, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoctorPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false)

  useEffect(() => {
    if (!loading && (!user || user.role !== "doctor")) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div>Carregando...</div>
  }

  const handlePrescriptionSubmit = (prescription: any) => {
    console.log("Prescription submitted:", prescription)
    setShowPrescriptionForm(false)
    alert("Prescrição enviada com sucesso!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portal do Médico</h1>
          <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="appointments" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Agenda</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Horários</span>
            </TabsTrigger>
            <TabsTrigger value="prescription" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Prescrição</span>
            </TabsTrigger>
            <TabsTrigger value="patients" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Pacientes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsCalendar />
          </TabsContent>

          <TabsContent value="schedule">
            <CadastraHorarioUI codMedico={user.id} />
          </TabsContent>

          <TabsContent value="prescription">
            {!showPrescriptionForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Prescrição Eletrônica</CardTitle>
                  <CardDescription>Selecione uma consulta para criar uma prescrição</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Selecione um paciente da agenda para criar uma prescrição
                  </p>
                  <button onClick={() => setShowPrescriptionForm(true)} className="text-primary hover:underline">
                    Ou criar prescrição avulsa
                  </button>
                </CardContent>
              </Card>
            ) : (
              <PrescriptionForm patientId="1" appointmentId="1" onSubmit={handlePrescriptionSubmit} />
            )}
          </TabsContent>

          <TabsContent value="patients">
            <PatientRecords />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
