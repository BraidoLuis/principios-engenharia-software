// Creator: cria avaliações de consultas
// High Cohesion: focado apenas em rating

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"

interface AppointmentRatingProps {
  appointmentId: string
  doctorName: string
  onSubmit: (rating: number, comment: string) => void
}

export function AppointmentRating({ appointmentId, doctorName, onSubmit }: AppointmentRatingProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) return
    onSubmit(rating, comment)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-green-600 font-medium">Avaliação enviada com sucesso!</div>
            <p className="text-sm text-muted-foreground">Obrigado pelo seu feedback</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Avaliar Atendimento</CardTitle>
        <CardDescription>Como foi sua consulta com {doctorName}?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <Textarea
            placeholder="Deixe seu comentário (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <Button onClick={handleSubmit} disabled={rating === 0} className="w-full">
          Enviar Avaliação
        </Button>
      </CardContent>
    </Card>
  )
}
