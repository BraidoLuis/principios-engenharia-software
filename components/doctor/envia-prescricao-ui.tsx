// Creator: cria prescrições eletrônicas
// Controller: coordena processo de envio
// High Cohesion: focado em prescrição

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Send } from 'lucide-react'
import type { Prescricao } from "@/lib/types"

interface Medicamento {
  nome: string
  dosagem: string
  frequencia: string
  duracao: string
}

interface EnviaPrescricaoUIProps {
  codConsulta: string
  pacienteNome: string
}

export function EnviaPrescricaoUI({ codConsulta, pacienteNome }: EnviaPrescricaoUIProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [observacoes, setObservacoes] = useState("")
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([
    { nome: "", dosagem: "", frequencia: "", duracao: "" },
  ])

  const adicionarMedicamento = () => {
    setMedicamentos([...medicamentos, { nome: "", dosagem: "", frequencia: "", duracao: "" }])
  }

  const removerMedicamento = (index: number) => {
    setMedicamentos(medicamentos.filter((_, i) => i !== index))
  }

  const atualizarMedicamento = (index: number, field: keyof Medicamento, value: string) => {
    const novos = [...medicamentos]
    novos[index][field] = value
    setMedicamentos(novos)
  }

  const handleEnviar = async () => {
    setLoading(true)

    try {
      // Validação
      const medicamentosValidos = medicamentos.filter((m) => m.nome && m.dosagem)
      if (medicamentosValidos.length === 0) {
        toast({
          title: "Prescrição incompleta",
          description: "Adicione pelo menos um medicamento com nome e dosagem",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const novaPrescricao: Omit<Prescricao, "CodPrescricao"> = {
        CodConsulta: codConsulta,
        Medicamentos: medicamentosValidos.map((m) => m.nome).join(", "),
        Dosagem: medicamentosValidos.map((m) => m.dosagem).join(", "),
        Observacoes: observacoes,
        DataEmissao: new Date().toISOString().split("T")[0],
      }

      console.log("[v0] Enviando prescrição:", novaPrescricao)

      // Simular envio
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Prescrição enviada!",
        description: `A prescrição foi enviada automaticamente para ${pacienteNome}`,
      })

      // Limpar formulário
      setMedicamentos([{ nome: "", dosagem: "", frequencia: "", duracao: "" }])
      setObservacoes("")
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar a prescrição. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prescrição Eletrônica</CardTitle>
        <CardDescription>Paciente: {pacienteNome}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Medicamentos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Medicamentos Prescritos</Label>
            <Button type="button" variant="outline" size="sm" onClick={adicionarMedicamento}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          </div>

          {medicamentos.map((med, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`med-nome-${index}`}>Medicamento *</Label>
                    <Input
                      id={`med-nome-${index}`}
                      placeholder="Nome do medicamento"
                      value={med.nome}
                      onChange={(e) => atualizarMedicamento(index, "nome", e.target.value)}
                    />
                  </div>
                  {medicamentos.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removerMedicamento(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor={`med-dosagem-${index}`}>Dosagem *</Label>
                    <Input
                      id={`med-dosagem-${index}`}
                      placeholder="Ex: 500mg"
                      value={med.dosagem}
                      onChange={(e) => atualizarMedicamento(index, "dosagem", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`med-freq-${index}`}>Frequência</Label>
                    <Input
                      id={`med-freq-${index}`}
                      placeholder="Ex: 8/8h"
                      value={med.frequencia}
                      onChange={(e) => atualizarMedicamento(index, "frequencia", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`med-duracao-${index}`}>Duração</Label>
                    <Input
                      id={`med-duracao-${index}`}
                      placeholder="Ex: 7 dias"
                      value={med.duracao}
                      onChange={(e) => atualizarMedicamento(index, "duracao", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Observações */}
        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações Adicionais</Label>
          <Textarea
            id="observacoes"
            placeholder="Instruções especiais, recomendações, cuidados..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Botão enviar */}
        <Button onClick={handleEnviar} className="w-full" size="lg" disabled={loading}>
          <Send className="h-4 w-4 mr-2" />
          {loading ? "Enviando prescrição..." : "Enviar Prescrição ao Paciente"}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          A prescrição será enviada automaticamente por email ao paciente após a consulta
        </p>
      </CardContent>
    </Card>
  )
}
