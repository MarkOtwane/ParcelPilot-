import { IsUUID, IsEnum } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class InitiatePaymentDto {
  @IsUUID()
  parcelId: string;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
