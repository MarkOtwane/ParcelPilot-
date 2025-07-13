const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        role: 'ADMIN',
        password: hashedPassword,
      },
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '9876543210',
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log('Admin user created/updated successfully:', {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 