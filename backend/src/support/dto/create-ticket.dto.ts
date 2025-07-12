import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  message: string;
}
