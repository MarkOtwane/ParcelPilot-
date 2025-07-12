import { IsUUID, IsNotEmpty } from 'class-validator';

export class RespondTicketDto {
  @IsUUID()
  ticketId: string;

  @IsNotEmpty()
  response: string;
}
