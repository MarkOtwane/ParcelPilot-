/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateParcelDto {
  @IsEmail()
  receiverEmail: string;

  @IsEmail()
  senderEmail: string;

  @IsString()
  @IsNotEmpty()
  pickupLocation: string;

  @IsString()
  @IsNotEmpty()
  destination: string;

  @IsNumber()
  weight: number;

  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  pickupLat?: number;
  @IsOptional()
  @IsNumber()
  pickupLng?: number;
  @IsOptional()
  @IsNumber()
  destinationLat?: number;
  @IsOptional()
  @IsNumber()
  destinationLng?: number;
}
