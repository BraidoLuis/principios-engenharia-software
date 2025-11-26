"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { AppHeader } from "@/components/layout/app-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsDashboard } from "@/components/admin/stats-dashboard"
import { UserManagement } from "@/components/admin/user-management"
import { AppointmentsReport } from "@/components/admin/appointments-report"
import { EmailManager } from "@/components/admin/email-manager"
import { PaymentDashboard } from "@/components/payment/payment-dashboard"
import { NotificationManager } from "@/components/admin/notification-manager"
import { LayoutDashboard, Users, FileText, Mail, DollarSign, Bell } from "lucide-react"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-muted-foreground">Bem-vindo, {user.name}</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Relatórios</span>
            </TabsTrigger>
            <TabsTrigger value="financial" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financeiro</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="emails" className="gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Emails</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <StatsDashboard />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Atividade Recente</h2>
                <div className="space-y-2">
                  {[
                    "João Silva agendou uma consulta",
                    "Dr. Pedro Costa atualizou horários",
                    "Maria Santos completou pagamento",
                    "Nova avaliação recebida (5 estrelas)",
                  ].map((activity, idx) => (
                    <div key={idx} className="p-3 border rounded-lg text-sm">
                      {activity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Próximas Ações</h2>
                <div className="space-y-2">
                  {[
                    "Aprovar cadastro de 3 novos médicos",
                    "Revisar relatório financeiro mensal",
                    "Responder 5 tickets de suporte",
                    "Atualizar políticas de privacidade",
                  ].map((action, idx) => (
                    <div key={idx} className="p-3 border rounded-lg text-sm flex items-center justify-between">
                      <span>{action}</span>
                      <button className="text-primary text-xs hover:underline">Ver</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="reports">
            <AppointmentsReport />
          </TabsContent>

          <TabsContent value="financial">
            <PaymentDashboard />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationManager />
          </TabsContent>

          <TabsContent value="emails">
            <EmailManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
