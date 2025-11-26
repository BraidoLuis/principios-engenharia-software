// Information Expert: gerencia histórico médico do paciente
// Protected Variations: protege dados sensíveis

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Pill, Calendar } from "lucide-react"

const mockHistory = [
  {
    id: "1",
    date: "2024-12-15",
    doctor: "Dr. João Silva",
    diagnosis: "Hipertensão leve",
    prescription: {
      medications: [{ name: "Losartana", dosage: "50mg", frequency: "1x ao dia", duration: "30 dias" }],
      instructions: "Tomar pela manhã com água",
    },
    notes: "Paciente apresenta pressão arterial elevada. Recomendado dieta com baixo sódio.",
  },
]

export function MedicalHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico Médico</CardTitle>
        <CardDescription>Consultas anteriores e prescrições</CardDescription>
      </CardHeader>
      <CardContent>
        {mockHistory.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Nenhum histórico disponível</p>
        ) : (
          <div className="space-y-6">
            {mockHistory.map((record) => (
              <div key={record.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{record.diagnosis}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(record.date).toLocaleDateString("pt-BR")}
                      </span>
                      <span>{record.doctor}</span>
                    </div>
                  </div>
                </div>

                {record.notes && <p className="text-sm text-muted-foreground">{record.notes}</p>}

                {record.prescription && (
                  <div className="space-y-3 p-4 bg-accent rounded-lg">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4" />
                      <span className="font-medium text-sm">Prescrição</span>
                    </div>
                    <div className="space-y-2">
                      {record.prescription.medications.map((med, idx) => (
                        <div key={idx} className="text-sm space-y-1">
                          <div className="font-medium">
                            {med.name} - {med.dosage}
                          </div>
                          <div className="text-muted-foreground">
                            {med.frequency} por {med.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Instruções: </span>
                      {record.prescription.instructions}
                    </div>
                  </div>
                )}

                <Separator />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
