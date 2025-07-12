import { IsUUID, IsEnum } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class UpdatePaymentStatusDto {
  @IsUUID()
  paymentId: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}
