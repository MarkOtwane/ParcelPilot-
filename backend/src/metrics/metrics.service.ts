import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, parcels, paymentsCount, completedParcels, paymentsSum] =
      await Promise.all([
        this.prisma.user.count({ where: { deletedAt: null } }),
        this.prisma.parcel.count({ where: { deletedAt: null } }),
        this.prisma.payment.count(),
        this.prisma.parcel.count({ where: { status: 'DELIVERED' } }),
        this.prisma.payment.aggregate({ _sum: { amount: true } }),
      ]);

    return {
      users,
      parcels,
      completedParcels,
      totalPayments: paymentsSum._sum.amount || 0,
    };
  }
}
