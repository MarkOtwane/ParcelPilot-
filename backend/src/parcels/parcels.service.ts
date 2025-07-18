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
      where: { email: dto.senderEmail.toLowerCase() },
    });
    const receiver = await this.prisma.user.findUnique({
      where: { email: dto.receiverEmail.toLowerCase() },
    });

    if (!sender) throw new NotFoundException('Sender not found');
    if (!receiver) throw new NotFoundException('Receiver not found');

    const cost = this.calculateCost(dto.weight);

    const parcel = await this.prisma.parcel.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        pickupLocation: dto.pickupLocation,
        destination: dto.destination,
        weight: dto.weight,
        cost,
        description: dto.description,
        pickupLat: dto.pickupLat,
        pickupLng: dto.pickupLng,
        destinationLat: dto.destinationLat,
        destinationLng: dto.destinationLng,
      },
    });

    // Send email notification (non-blocking)
    this.mailer
      .sendParcelCreatedEmail(sender.email, receiver.email, parcel)
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Failed to send parcel created email:', errorMessage);
      });

    // Send SMS notifications (non-blocking)
    if (sender.phone) {
      try {
        this.mailer.sendSms(
          sender.phone,
          `Your parcel has been created. Pickup: ${parcel.pickupLocation}, Destination: ${parcel.destination}, Cost: KES ${parcel.cost}`,
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Failed to send SMS to sender:', errorMessage);
      }
    }
    if (receiver.phone) {
      try {
        this.mailer.sendSms(
          receiver.phone,
          `A parcel is on its way to you! Pickup: ${parcel.pickupLocation}, Destination: ${parcel.destination}`,
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Failed to send SMS to receiver:', errorMessage);
      }
    }

    return parcel;
  }

  async listUserParcels(userId: string) {
    console.log('=== LIST USER PARCELS ===');
    console.log('User ID:', userId);

    const sent = await this.prisma.parcel.findMany({
      where: { senderId: userId, deletedAt: null },
    });
    console.log('Sent parcels found:', sent.length);
    console.log('Sent parcels:', sent);

    const received = await this.prisma.parcel.findMany({
      where: { receiverId: userId, deletedAt: null },
    });
    console.log('Received parcels found:', received.length);
    console.log('Received parcels:', received);

    const result = { sent, received };
    console.log('Returning result:', result);
    return result;
  }

  async getAllParcels(role: Role) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view all parcels');
    }

    return this.prisma.parcel.findMany({
      where: { deletedAt: null },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
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
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Failed to send status update email:', errorMessage);
      });

    // Send SMS notifications (non-blocking)
    if (parcel.sender.phone) {
      try {
        this.mailer.sendSms(
          parcel.sender.phone,
          `Parcel status updated: ${dto.status}`,
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Failed to send status SMS to sender:', errorMessage);
      }
    }
    if (parcel.receiver.phone) {
      try {
        this.mailer.sendSms(
          parcel.receiver.phone,
          `Parcel status updated: ${dto.status}`,
        );
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error('Failed to send status SMS to receiver:', errorMessage);
      }
    }

    return updated;
  }

  async getParcelById(id: string, role: Role) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can view parcel details');
    }

    const parcel = await this.prisma.parcel.findUnique({
      where: { id, deletedAt: null },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }

    return parcel;
  }

  async updateParcel(id: string, dto: Partial<CreateParcelDto>, role: Role) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update parcels');
    }

    const parcel = await this.prisma.parcel.findUnique({
      where: { id, deletedAt: null },
    });

    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }

    // Update the parcel with the provided data
    const updated = await this.prisma.parcel.update({
      where: { id },
      data: {
        pickupLocation: dto.pickupLocation,
        destination: dto.destination,
        weight: dto.weight,
        // Remove status and cost as they are not part of CreateParcelDto
        // If cost needs to be updated, recalculate based on weight
        cost: dto.weight ? this.calculateCost(dto.weight) : undefined,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return updated;
  }

  async updateUserParcel(
    userId: string,
    parcelId: string,
    dto: Partial<CreateParcelDto>,
  ) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: parcelId },
    });
    if (!parcel) throw new NotFoundException('Parcel not found');
    if (parcel.senderId !== userId) throw new ForbiddenException('Not allowed');

    // Only allow updating certain fields
    const updated = await this.prisma.parcel.update({
      where: { id: parcelId },
      data: {
        pickupLocation: dto.pickupLocation,
        destination: dto.destination,
        weight: dto.weight,
        // Do not allow user to update status or cost directly
      },
    });
    return updated;
  }

  async deleteParcel(id: string, role: Role) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can delete parcels');
    }

    const parcel = await this.prisma.parcel.findUnique({
      where: { id, deletedAt: null },
    });

    if (!parcel) {
      throw new NotFoundException('Parcel not found');
    }

    // Soft delete by setting deletedAt timestamp
    const deleted = await this.prisma.parcel.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Parcel deleted successfully', parcel: deleted };
  }

  async deleteUserParcel(userId: string, parcelId: string) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: parcelId },
    });
    if (!parcel) throw new NotFoundException('Parcel not found');
    if (parcel.senderId !== userId) throw new ForbiddenException('Not allowed');

    // Soft delete by setting deletedAt timestamp
    const deleted = await this.prisma.parcel.update({
      where: { id: parcelId },
      data: { deletedAt: new Date() },
    });
    return { message: 'Parcel deleted successfully', parcel: deleted };
  }

  private calculateCost(weight: number): number {
    if (weight < 5) return 500;
    if (weight < 10) return 1000;
    return 1500;
  }
}
