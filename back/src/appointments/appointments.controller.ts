
import { Controller, Get, Post, Query, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('/api')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  
  @Get('/test')
  test() {
    // console.log("helooooooo")
  }
  
  @Get('/slots')
  async getAvailableSlots(@Query('date') dateStr: string) {
    console.log(`the date : ${dateStr}`);
    try {
      const date = new Date(dateStr);
      const bookedSlots = await this.appointmentsService.getBookedSlots(date);
      return { bookedSlots };
    } catch (error) {
      throw new HttpException('Failed to fetch slots', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/appointments')
  async createAppointment(
    @Body()
    data: {
      date: string;
      slotId: string;
      customerName: string;
      phoneNumber: string;
    },
  ) {
    console.log("teeeeeeeees inside the appointmnes endpoint");
    try {
      const appointment = await this.appointmentsService.createAppointment({
        date: new Date(data.date),
        slotId: data.slotId,
        customerName: data.customerName,
        phoneNumber: data.phoneNumber,
      });
      return appointment;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create appointment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
