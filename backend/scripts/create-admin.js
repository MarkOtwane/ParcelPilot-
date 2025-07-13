const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@sendit.com' },
      update: {
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Admin User',
        phone: '+1234567899',
      },
      create: {
        email: 'admin@sendit.com',
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Admin User',
        phone: '+1234567899',
      },
    });

    console.log('Admin user created/updated successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
