"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { AppHeader } from "@/components/layout/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarcaConsultaUI } from "@/components/patient/marca-consulta-ui"
import { VisualizaConsultasUI } from "@/components/patient/visualiza-consultas-ui"
import { MedicalHistory } from "@/components/patient/medical-history"
import { PaymentDashboard } from "@/components/payment/payment-dashboard"
import { AvaliaAtendimentoUI } from "@/components/patient/avalia-atendimento-ui"
import { Calendar, History, CreditCard, FileText, Star } from "lucide-react"

export default function PatientPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "patient")) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div>Carregando...</div>
  }

  console.log("USER:", user)

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Portal do Paciente</h1>
          <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
        </div>

        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="schedule" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Agendar</span>
            </TabsTrigger>
            <TabsTrigger value="appointments" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Consultas</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="gap-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Avaliar</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Pagamentos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <MarcaConsultaUI />
          </TabsContent>

          <TabsContent value="appointments">
            <VisualizaConsultasUI idPaciente={user.id}/>
          </TabsContent>

          <TabsContent value="evaluations">
            <AvaliaAtendimentoUI codPaciente={user.id} />
          </TabsContent>

          <TabsContent value="history">
            <MedicalHistory />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
