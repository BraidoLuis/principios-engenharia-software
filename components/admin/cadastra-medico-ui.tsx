// Controller + Creator: coordena cadastro de médico
// High Cohesion: focado apenas em cadastro de médico
// Information Expert: conhece dados necessários para cadastro

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Medico } from "@/lib/types"

const especialidades = [
  "Cardiologia",
  "Dermatologia",
  "Pediatria",
  "Ortopedia",
  "Ginecologia",
  "Oftalmologia",
  "Psiquiatria",
  "Neurologia",
  "Clínico Geral",
]

export function CadastraMedicoUI() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    crm: "",
    especialidade: "",
    telefone: "",
    email: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validação CRM (formato: 12345-UF)
      const crmRegex = /^\d{4,6}-[A-Z]{2}$/
      if (!crmRegex.test(formData.crm)) {
        toast({
          title: "CRM inválido",
          description: "Use o formato: 12345-UF (ex: 12345-SP)",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const novoMedico: Omit<Medico, "CodMedico"> = {
        Nome: formData.nome,
        CRM: formData.crm,
        Especialidade: formData.especialidade,
        Telefone: formData.telefone,
        Email: formData.email,
      }

      console.log("[v0] Cadastrando médico:", novoMedico)

      // Simular cadastro
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Médico cadastrado!",
        description: `Dr(a). ${formData.nome} foi adicionado(a) ao sistema com sucesso.`,
      })

      // Limpar formulário
      setFormData({
        nome: "",
        crm: "",
        especialidade: "",
        telefone: "",
        email: "",
      })
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Não foi possível cadastrar o médico. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastrar Médico</CardTitle>
        <CardDescription>Adicione um novo médico ao sistema da clínica</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome Completo *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Dr(a). Nome Completo"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crm">CRM *</Label>
              <Input
                id="crm"
                value={formData.crm}
                onChange={(e) => handleChange("crm", e.target.value)}
                placeholder="12345-SP"
                required
              />
              <p className="text-xs text-muted-foreground">Formato: 12345-UF</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidade">Especialidade *</Label>
              <Select value={formData.especialidade} onValueChange={(v) => handleChange("especialidade", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((esp) => (
                    <SelectItem key={esp} value={esp}>
                      {esp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleChange("telefone", e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="medico@clinica.com"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Médico"}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
