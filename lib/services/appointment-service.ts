// Controller: coordena operações de agendamento
// Information Expert: gerencia dados de consultas

import type { Appointment } from "@/lib/types"

class AppointmentService {
  private static instance: AppointmentService
  private appointments: Appointment[] = []

  private constructor() {
    this.loadMockData()
  }

  static getInstance(): AppointmentService {
    if (!AppointmentService.instance) {
      AppointmentService.instance = new AppointmentService()
    }
    return AppointmentService.instance
  }

  private loadMockData() {
    // Dados mock para demonstração
    this.appointments = [
      {
        id: "1",
        patientId: "1",
        doctorId: "2",
        date: "2025-01-15",
        time: "14:00",
        status: "scheduled",
        type: "Consulta de rotina",
      },
    ]
  }

  async createAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
    }
    this.appointments.push(newAppointment)
    return newAppointment
  }

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.patientId === patientId)
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointments.filter((a) => a.doctorId === doctorId)
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointments
  }

  async updateAppointmentStatus(id: string, status: Appointment["status"]): Promise<Appointment> {
    const appointment = this.appointments.find((a) => a.id === id)
    if (!appointment) throw new Error("Appointment not found")
    appointment.status = status
    return appointment
  }

  async cancelAppointment(id: string): Promise<void> {
    await this.updateAppointmentStatus(id, "cancelled")
  }
}

export const appointmentService = AppointmentService.getInstance()
