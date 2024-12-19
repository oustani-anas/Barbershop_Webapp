import { IsString, IsInt, IsDate, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  time: string;

  @IsInt()
  barberId: number;

  @IsInt()
  serviceId: number;

  @IsString()
  customerName: string;

  @IsPhoneNumber()
  customerPhone: string;
}