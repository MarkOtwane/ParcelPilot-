/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateParcelDto {
  @IsEmail()
  receiverEmail: string;

  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  weight: number;
}
