import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async getBookedSlots(date: Date) {
    // Get start and end of the selected date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Find all appointments for the given date
    const appointments = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        slotId: true,
      },
    });

    // Return array of booked slot IDs
    return appointments.map(apt => apt.slotId);
  }

  async createAppointment(data: {
    date: Date;
    slotId: string;
    customerName: string;
    phoneNumber: string;
  }) {
    // Check if slot is already booked
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        date: data.date,
        slotId: data.slotId,
      },
    });

    if (existingAppointment) {
      throw new Error('This slot is already booked');
    }

    // Create new appointment
    return this.prisma.appointment.create({
      data: {
        date: data.date,
        slotId: data.slotId,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
      },
    });
  }
}