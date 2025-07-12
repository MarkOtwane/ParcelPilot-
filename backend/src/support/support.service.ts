import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RespondTicketDto } from './dto/respond-ticket.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(dto: CreateTicketDto) {
    return this.prisma.supportTicket.create({ data: dto });
  }

  async respondToTicket(dto: RespondTicketDto) {
    const ticket = await this.prisma.supportTicket.findUnique({
      where: { id: dto.ticketId },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');

    return this.prisma.supportTicket.update({
      where: { id: dto.ticketId },
      data: { response: dto.response },
    });
  }

  async getAll() {
    return this.prisma.supportTicket.findMany();
  }
}
