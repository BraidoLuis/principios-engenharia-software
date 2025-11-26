// Creator: cria notificações em massa
// Controller: coordena envio de notificações

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Send } from "lucide-react"

export function NotificationManager() {
  const [recipient, setRecipient] = useState("all_patients")
  const [type, setType] = useState<
    "appointment_reminder" | "appointment_confirmed" | "prescription_ready" | "payment_pending"
  >("appointment_reminder")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    setSending(true)
    // Simular envio de notificações em massa
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setTimeout(() => {
        setSent(false)
        setTitle("")
        setMessage("")
      }, 3000)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Notificações</CardTitle>
        <CardDescription>Envie lembretes e notificações para usuários do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="recipient">Destinatários</Label>
          <Select value={recipient} onValueChange={setRecipient}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_patients">Todos os Pacientes</SelectItem>
              <SelectItem value="all_doctors">Todos os Médicos</SelectItem>
              <SelectItem value="upcoming_appointments">Consultas Próximas</SelectItem>
              <SelectItem value="pending_payments">Pagamentos Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de Notificação</Label>
          <Select value={type} onValueChange={(v) => setType(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="appointment_reminder">Lembrete de Consulta</SelectItem>
              <SelectItem value="appointment_confirmed">Consulta Confirmada</SelectItem>
              <SelectItem value="prescription_ready">Prescrição Pronta</SelectItem>
              <SelectItem value="payment_pending">Pagamento Pendente</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <input
            id="title"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Ex: Lembrete de Consulta"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            placeholder="Digite a mensagem da notificação..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>

        {sent && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações enviadas com sucesso!
          </div>
        )}

        <Button onClick={handleSend} disabled={!title || !message || sending} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {sending ? "Enviando..." : "Enviar Notificações"}
        </Button>
      </CardContent>
    </Card>
  )
}
