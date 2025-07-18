import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async initiate(userId: string, dto: InitiatePaymentDto, role: Role) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: dto.parcelId },
    });

    if (!parcel) throw new NotFoundException('Parcel not found');

    if (role !== 'ADMIN' && parcel.senderId !== userId) {
      throw new ForbiddenException('You can only pay for your own parcel');
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { parcelId: dto.parcelId },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this parcel');
    }

    const payment = await this.prisma.payment.create({
      data: {
        parcelId: dto.parcelId,
        userId,
        method: dto.method,
        amount: parcel.cost,
        status: PaymentStatus.PENDING,
      },
    });

    // Simulate payment success
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status: PaymentStatus.COMPLETED },
    });

    return {
      message: 'Payment simulated successfully',
      paymentId: payment.id,
      status: PaymentStatus.COMPLETED,
    };
  }

  async getUserPayments(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      include: { parcel: true },
    });
  }

  async getAllPayments(role: Role) {
    if (role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can view all payments');
    }

    return this.prisma.payment.findMany({
      include: {
        parcel: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async updateStatus(dto: UpdatePaymentStatusDto) {
    return this.prisma.payment.update({
      where: { id: dto.paymentId },
      data: { status: dto.status },
    });
  }
}
