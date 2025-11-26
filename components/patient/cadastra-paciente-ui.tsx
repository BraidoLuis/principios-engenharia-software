// Controller + Creator: coordena cadastro de paciente
// High Cohesion: focado apenas em cadastro
// Information Expert: conhece dados necessários para cadastro

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import type { Paciente } from "@/lib/types"

export function CadastraPacienteUI() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    dataNasc: "",
    telefone: "",
    endereco: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validações
      if (formData.senha !== formData.confirmarSenha) {
        toast({
          title: "Erro",
          description: "As senhas não coincidem",
          variant: "destructive",
        })
        return
      }

      // Criar paciente
      const novoPaciente: Omit<Paciente, "CodPaciente"> = {
        Nome: formData.nome,
        Email: formData.email,
        Senha: formData.senha,
        CPF: formData.cpf,
        DataNasc: formData.dataNasc,
        Telefone: formData.telefone,
        Endereco: formData.endereco,
      }

      // Aqui integraria com backend
      console.log("[v0] Cadastrando paciente:", novoPaciente)

      toast({
        title: "Sucesso!",
        description: "Cadastro realizado com sucesso. Você já pode fazer login.",
      })

      // Limpar formulário
      setFormData({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
        cpf: "",
        dataNasc: "",
        telefone: "",
        endereco: "",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível completar o cadastro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Cadastro de Paciente</CardTitle>
        <CardDescription>Preencha seus dados para criar sua conta no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dataNasc">Data de Nascimento *</Label>
              <Input
                id="dataNasc"
                type="date"
                value={formData.dataNasc}
                onChange={(e) => handleChange("dataNasc", e.target.value)}
                required
              />
            </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input
              id="endereco"
              value={formData.endereco}
              onChange={(e) => handleChange("endereco", e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => handleChange("senha", e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
              <Input
                id="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                placeholder="Digite a senha novamente"
                minLength={6}
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Cadastrando..." : "Criar Conta"}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              Cancelar
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
