/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsUUID } from 'class-validator';
import { ParcelStatus } from '@prisma/client';

export class UpdateParcelStatusDto {
  @IsUUID()
  parcelId: string;

  @IsEnum(ParcelStatus)
  status: ParcelStatus;
}
