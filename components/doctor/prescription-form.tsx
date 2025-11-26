// Creator: cria prescrições eletrônicas
// High Cohesion: focado em criação de prescrições

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Send } from "lucide-react"

interface Medication {
  name: string
  dosage: string
  frequency: string
  duration: string
}

interface PrescriptionFormProps {
  patientId: string
  appointmentId: string
  onSubmit: (prescription: any) => void
}

export function PrescriptionForm({ patientId, appointmentId, onSubmit }: PrescriptionFormProps) {
  const [medications, setMedications] = useState<Medication[]>([{ name: "", dosage: "", frequency: "", duration: "" }])
  const [diagnosis, setDiagnosis] = useState("")
  const [instructions, setInstructions] = useState("")
  const [notes, setNotes] = useState("")

  const handleAddMedication = () => {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }])
  }

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications]
    updated[index][field] = value
    setMedications(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      patientId,
      appointmentId,
      diagnosis,
      prescription: {
        medications: medications.filter((m) => m.name),
        instructions,
      },
      notes,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescrição Eletrônica</CardTitle>
        <CardDescription>Preencha os dados da prescrição para o paciente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico</Label>
            <Input
              id="diagnosis"
              placeholder="Ex: Hipertensão arterial"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Medicamentos</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleAddMedication}>
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {medications.map((med, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium">Medicamento {index + 1}</span>
                  {medications.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveMedication(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-3">
                  <Input
                    placeholder="Nome do medicamento"
                    value={med.name}
                    onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      placeholder="Dosagem"
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                    />
                    <Input
                      placeholder="Frequência"
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                    />
                    <Input
                      placeholder="Duração"
                      value={med.duration}
                      onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instructions">Instruções de Uso</Label>
            <Textarea
              id="instructions"
              placeholder="Ex: Tomar após as refeições"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações Adicionais</Label>
            <Textarea
              id="notes"
              placeholder="Observações sobre o paciente ou tratamento"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Enviar Prescrição
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
