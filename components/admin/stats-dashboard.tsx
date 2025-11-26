// Information Expert: conhece e exibe estatísticas do sistema
// Low Coupling: usa apenas dados necessários

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, Star } from "lucide-react"

const stats = [
  {
    title: "Total de Pacientes",
    value: "1,234",
    change: "+12% do mês passado",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Consultas Agendadas",
    value: "89",
    change: "+5% esta semana",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Receita Mensal",
    value: "R$ 45.231",
    change: "+18% do mês passado",
    icon: DollarSign,
    color: "text-yellow-600",
  },
  {
    title: "Avaliação Média",
    value: "4.8",
    change: "245 avaliações",
    icon: Star,
    color: "text-purple-600",
  },
]

export function StatsDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
