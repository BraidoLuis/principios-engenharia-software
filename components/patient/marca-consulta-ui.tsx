// IUMarcaConsulta: interface do usuário para marcação de consulta
// Segue o diagrama de comunicação: IU → Controller

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { catalogoDisponibilidade } from "@/lib/catalogues/catalogo-disponibilidade"
import { marcaConsultaController } from "@/lib/controllers/marca-consulta-controller"
import type { Disponibilidade, Medico } from "@/lib/types"
import { Clock, CreditCard, DollarSign, CheckCircle } from "lucide-react"
import { useAuth } from "@/lib/hooks/use-auth"

export function MarcaConsultaUI() {
  const { user } = useAuth()
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [medicoSelecionado, setMedicoSelecionado] = useState<string>("")
  const [dataSelecionada, setDataSelecionada] = useState<Date>()
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([])
  const [dispSelecionada, setDispSelecionada] = useState<string>("")
  const [tipoPagamento, setTipoPagamento] = useState<"credito" | "debito" | "pix" | "dinheiro">("credito")
  const [loading, setLoading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [mensagem, setMensagem] = useState("")

  useEffect(() => {
    // Carregar médicos ao montar componente
    const medicosList = catalogoDisponibilidade.listarMedicos()
    setMedicos(medicosList)
  }, [])

  useEffect(() => {
    // Quando seleciona data, buscar disponibilidades
    if (dataSelecionada && medicoSelecionado) {
      const dataStr = dataSelecionada.toISOString().split("T")[0]
      const todasDisp = catalogoDisponibilidade.listarDisponibilidadesPorData(dataStr)

      // Filtrar por médico
      const dispFiltradas = todasDisp.filter((d) => {
        const horario = catalogoDisponibilidade.getHorario(d.CodHorario || "")
        return horario?.idMedico === medicoSelecionado
      })

      setDisponibilidades(dispFiltradas)
    }
  }, [dataSelecionada, medicoSelecionado])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !dispSelecionada || !medicoSelecionado) {
      setMensagem("Por favor, preencha todos os campos")
      return
    }

    setLoading(true)
    setMensagem("")

    try {
      const medico = catalogoDisponibilidade.getMedico(medicoSelecionado)
      const valor = medico?.Preco || 0

      const agora = new Date()
      const dataPagam = agora.toISOString().split("T")[0]
      const horaPagam = agora.toTimeString().split(" ")[0].substring(0, 5)

      // Chamada ao controller conforme diagrama de comunicação
      // :IUMarcaConsulta → :MarcaConsultaController: criarConsulta(cP, cD, v, dP, hP, tP)
      const resultado = marcaConsultaController.criarConsulta(
        user.id, // codPaciente
        dispSelecionada, // codDisp
        valor, // valor
        dataPagam, // dataPagam
        horaPagam, // horaPagam
        tipoPagamento, // tipoPagam
      )

      if (resultado.sucesso) {
        setSucesso(true)
        setMensagem(resultado.mensagem)

        // Resetar formulário após 2 segundos
        setTimeout(() => {
          setSucesso(false)
          setMensagem("")
          setMedicoSelecionado("")
          setDataSelecionada(undefined)
          setDispSelecionada("")
          setDisponibilidades([])
        }, 2000)
      } else {
        setMensagem(resultado.mensagem)
      }
    } catch (error) {
      setMensagem("Erro ao agendar consulta: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const getMedicoNome = (codMedico: string) => {
    return medicos.find((m) => m.id === codMedico)?.Nome || ""
  }

  const getHorarioInfo = (codHorario: string) => {
    const horario = catalogoDisponibilidade.getHorario(codHorario)
    if (!horario) return ""
    return `${horario.HoraIni} - ${horario.HoraFim}`
  }

  const getMedicoPreco = (codMedico: string) => {
    const medico = medicos.find((m) => m.id === codMedico)
    return medico?.Preco || 0
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marcar Consulta</CardTitle>
        <CardDescription>Siga os passos para agendar sua consulta médica</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Passo 1: Selecionar Médico */}
          <div className="space-y-2">
            <Label>1. Selecione o Médico</Label>
            <Select value={medicoSelecionado} onValueChange={setMedicoSelecionado}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um médico" />
              </SelectTrigger>
              <SelectContent>
                {medicos.map((medico) => {
                  const especialidade = catalogoDisponibilidade.getEspecialidade(medico.CodEspec || "")
                  return (
                    <SelectItem key={medico.id} value={medico.id}>
                      {medico.Nome} - {especialidade?.Nome} - R$ {medico.Preco.toFixed(2)}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Passo 2: Selecionar Data */}
          {medicoSelecionado && (
            <div className="space-y-2">
              <Label>2. Selecione a Data</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={dataSelecionada}
                  onSelect={setDataSelecionada}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
            </div>
          )}

          {/* Passo 3: Selecionar Horário Disponível */}
          {dataSelecionada && disponibilidades.length > 0 && (
            <div className="space-y-2">
              <Label>3. Horário Disponível</Label>
              <div className="grid grid-cols-2 gap-2">
                {disponibilidades.map((disp) => (
                  <Button
                    key={disp.CodDisp}
                    type="button"
                    variant={dispSelecionada === disp.CodDisp ? "default" : "outline"}
                    onClick={() => setDispSelecionada(disp.CodDisp)}
                    className="w-full"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {getHorarioInfo(disp.CodHorario || "")}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {dataSelecionada && disponibilidades.length === 0 && (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
              Nenhum horário disponível para esta data. Por favor, selecione outra data.
            </div>
          )}

          {/* Passo 4: Selecionar Método de Pagamento */}
          {dispSelecionada && (
            <div className="space-y-3">
              <Label>4. Forma de Pagamento</Label>
              <RadioGroup value={tipoPagamento} onValueChange={(v) => setTipoPagamento(v as any)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="credito" id="credito" />
                  <Label htmlFor="credito" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cartão de Crédito
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="debito" id="debito" />
                  <Label htmlFor="debito" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cartão de Débito
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      PIX
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent">
                  <RadioGroupItem value="dinheiro" id="dinheiro" />
                  <Label htmlFor="dinheiro" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Dinheiro
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Resumo da Consulta */}
              <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                <h4 className="font-semibold">Resumo da Consulta</h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Médico:</strong> {getMedicoNome(medicoSelecionado)}
                  </p>
                  <p>
                    <strong>Data:</strong> {dataSelecionada?.toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    <strong>Horário:</strong>{" "}
                    {getHorarioInfo(catalogoDisponibilidade.encontraDisponibilidade(dispSelecionada)?.CodHorario || "")}
                  </p>
                  <p className="text-lg font-bold mt-2">
                    <strong>Valor:</strong> R$ {getMedicoPreco(medicoSelecionado).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mensagens */}
          {mensagem && (
            <div className={`p-4 rounded-md ${sucesso ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {sucesso && <CheckCircle className="h-5 w-5 inline mr-2" />}
              {mensagem}
            </div>
          )}

          {/* Botão de Confirmação */}
          <Button type="submit" className="w-full" size="lg" disabled={loading || !dispSelecionada}>
            {loading ? "Processando..." : "Confirmar Agendamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
