const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Clearing database...');

    // Delete related records first
    await prisma.parcel.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.supportTicket.deleteMany();
    await prisma.auditLog.deleteMany();

    // Now delete users except admin
    await prisma.user.deleteMany({
      where: {
        role: 'USER',
      },
    });

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
