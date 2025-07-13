import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParcelDto } from './dto/create-parcel.dto';
import { UpdateParcelStatusDto } from './dto/update-parcel-status.dto';

@Injectable()
export class ParcelsService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailerService,
  ) {}

  async createParcel(senderId: string, dto: CreateParcelDto) {
    const sender = await this.prisma.user.findUnique({
      where: { id: senderId },
    });
    const receiver = await this.prisma.user.findUnique({
      where: { email: dto.receiverEmail.toLowerCase() },
    });

    if (!sender) throw new NotFoundException('Sender not found');
    if (!receiver) throw new NotFoundException('Receiver not found');

    const cost = this.calculateCost(dto.weight);

    const parcel = await this.prisma.parcel.create({
      data: {
        senderId,
        receiverId: receiver.id,
        pickupLocation: dto.pickupLocation,
        destination: dto.destination,
        weight: dto.weight,
        cost,
      },
    });

    // Send email notification (non-blocking)
    this.mailer
      .sendParcelCreatedEmail(sender.email, receiver.email, parcel)
      .catch((error) => {
        console.error('Failed to send parcel created email:', error.message);
      });

    // Send SMS notifications (non-blocking)
    if (sender.phone) {
      this.mailer
        .sendSms(
          sender.phone,
          `Your parcel has been created. Pickup: ${parcel.pickupLocation}, Destination: ${parcel.destination}, Cost: KES ${parcel.cost}`,
        )
        .catch((error) => {
          console.error('Failed to send SMS to sender:', error.message);
        });
    }
    if (receiver.phone) {
      this.mailer
        .sendSms(
          receiver.phone,
          `A parcel is on its way to you! Pickup: ${parcel.pickupLocation}, Destination: ${parcel.destination}`,
        )
        .catch((error) => {
          console.error('Failed to send SMS to receiver:', error.message);
        });
    }

    return parcel;
  }

  async listUserParcels(userId: string) {
    const sent = await this.prisma.parcel.findMany({
      where: { senderId: userId, deletedAt: null },
    });

    const received = await this.prisma.parcel.findMany({
      where: { receiverId: userId, deletedAt: null },
    });

    return { sent, received };
  }

  async updateStatus(adminId: string, dto: UpdateParcelStatusDto, role: Role) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update status');
    }

    const parcel = await this.prisma.parcel.findUnique({
      where: { id: dto.parcelId },
      include: { sender: true, receiver: true },
    });

    if (!parcel) throw new NotFoundException('Parcel not found');

    const updated = await this.prisma.parcel.update({
      where: { id: dto.parcelId },
      data: { status: dto.status },
    });

    // Send email notification (non-blocking)
    this.mailer
      .sendParcelStatusUpdateEmail(
        parcel.sender.email,
        parcel.receiver.email,
        dto.status,
      )
      .catch((error) => {
        console.error('Failed to send status update email:', error.message);
      });

    // Send SMS notifications (non-blocking)
    if (parcel.sender.phone) {
      this.mailer
        .sendSms(parcel.sender.phone, `Parcel status updated: ${dto.status}`)
        .catch((error) => {
          console.error('Failed to send status SMS to sender:', error.message);
        });
    }
    if (parcel.receiver.phone) {
      this.mailer
        .sendSms(parcel.receiver.phone, `Parcel status updated: ${dto.status}`)
        .catch((error) => {
          console.error(
            'Failed to send status SMS to receiver:',
            error.message,
          );
        });
    }

    return updated;
  }

  private calculateCost(weight: number): number {
    if (weight < 5) return 500;
    if (weight < 10) return 1000;
    return 1500;
  }
}
