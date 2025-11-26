// UI Component: interface para avaliação de atendimento
// High Cohesion: focado apenas em capturar e exibir avaliações

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, Calendar, User } from "lucide-react"
import { avaliaAtendimentoController } from "@/lib/controllers/avalia-atendimento-controller"
import type { Consulta } from "@/lib/types"

interface AvaliaAtendimentoUIProps {
  codPaciente: string
}

export function AvaliaAtendimentoUI({ codPaciente }: AvaliaAtendimentoUIProps) {
  const [consultaSelecionada, setConsultaSelecionada] = useState<Consulta | null>(null)
  const [nota, setNota] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [descricao, setDescricao] = useState("")
  const [mensagem, setMensagem] = useState("")
  const [avaliando, setAvaliando] = useState(false)

  // Buscar consultas que podem ser avaliadas
  const consultasAvaliaveisCompletas = avaliaAtendimentoController.listarConsultasAvaliaveisPorPaciente(codPaciente)

  const handleSelecionarConsulta = (consulta: Consulta) => {
    setConsultaSelecionada(consulta)
    setNota(0)
    setDescricao("")
    setMensagem("")
  }

  const handleSubmitAvaliacao = () => {
    if (!consultaSelecionada || nota === 0) return

    setAvaliando(true)
    const resultado = avaliaAtendimentoController.criarAvaliacao(consultaSelecionada.CodConsulta, nota, descricao)

    setMensagem(resultado.mensagem)

    if (resultado.sucesso) {
      setTimeout(() => {
        setConsultaSelecionada(null)
        setNota(0)
        setDescricao("")
        setMensagem("")
      }, 2000)
    }

    setAvaliando(false)
  }

  const handleCancelar = () => {
    setConsultaSelecionada(null)
    setNota(0)
    setDescricao("")
    setMensagem("")
  }

  if (consultaSelecionada) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Avaliar Atendimento</CardTitle>
          <CardDescription>Como foi sua experiência nesta consulta?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mensagem && (
            <div
              className={`p-4 rounded-lg ${mensagem.includes("sucesso") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
            >
              {mensagem}
            </div>
          )}

          <div className="space-y-2">
            <div className="text-sm font-medium">Consulta #{consultaSelecionada.CodConsulta}</div>
            <div className="text-sm text-muted-foreground">Médico: {consultaSelecionada.CodMedico}</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sua nota</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNota(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                  disabled={avaliando}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredRating || nota) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {nota > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {nota === 1 && "Muito insatisfeito"}
                {nota === 2 && "Insatisfeito"}
                {nota === 3 && "Regular"}
                {nota === 4 && "Satisfeito"}
                {nota === 5 && "Muito satisfeito"}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Comentário (opcional)</label>
            <Textarea
              placeholder="Conte-nos mais sobre sua experiência..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              disabled={avaliando}
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSubmitAvaliacao} disabled={nota === 0 || avaliando} className="flex-1">
              {avaliando ? "Enviando..." : "Enviar Avaliação"}
            </Button>
            <Button variant="outline" onClick={handleCancelar} disabled={avaliando}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar Atendimentos</CardTitle>
        <CardDescription>Selecione uma consulta concluída para avaliar</CardDescription>
      </CardHeader>
      <CardContent>
        {consultasAvaliaveisCompletas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Não há consultas concluídas para avaliar no momento.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {consultasAvaliaveisCompletas.map((consulta) => (
              <div
                key={consulta.CodConsulta}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleSelecionarConsulta(consulta)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Concluída</Badge>
                      <span className="text-sm text-muted-foreground">#{consulta.CodConsulta}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>Médico: {consulta.CodMedico}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Disponibilidade: {consulta.CodDisp}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Avaliar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
