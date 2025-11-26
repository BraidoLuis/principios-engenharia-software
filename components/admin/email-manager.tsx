// Pure Fabrication: especializado em comunicações
// High Cohesion: focado em envio de emails

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Send, Users } from "lucide-react"

export function EmailManager() {
  const [recipient, setRecipient] = useState("all_patients")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = async () => {
    setSending(true)
    // Simular envio
    setTimeout(() => {
      setSending(false)
      setSent(true)
      setTimeout(() => {
        setSent(false)
        setSubject("")
        setMessage("")
      }, 3000)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enviar Comunicações Institucionais</CardTitle>
        <CardDescription>Envie emails para pacientes e médicos cadastrados</CardDescription>
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
              <SelectItem value="all_users">Todos os Usuários</SelectItem>
              <SelectItem value="active_patients">Pacientes Ativos</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Users className="h-3 w-3" />
            Aproximadamente 1,234 destinatários
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input
            id="subject"
            placeholder="Ex: Novo horário de funcionamento"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            placeholder="Digite sua mensagem aqui..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
          />
        </div>

        {sent && (
          <div className="p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email enviado com sucesso para todos os destinatários!
          </div>
        )}

        <Button onClick={handleSend} disabled={!subject || !message || sending} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {sending ? "Enviando..." : "Enviar Email"}
        </Button>
      </CardContent>
    </Card>
  )
}
