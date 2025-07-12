/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateParcelDto {
  @IsUUID()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  weight: number;
}
