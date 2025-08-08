import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear tables before inserting new data
  await prisma.position.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Create hashed passwords
  const passwordAdmin = await bcrypt.hash('admin123', 10);
  const passwordUser = await bcrypt.hash('user123', 10);

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: passwordAdmin,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: passwordUser,
      role: 'USER',
    },
  });

  // Create vehicle for admin
  const adminVehicle = await prisma.vehicle.create({
    data: {
      license: 'ADMIN-001',
      brand: 'Tesla',
      color: 'Red',
      model: 'Model S',
      userId: admin.id,
    },
  });

  // Create position for admin's vehicle
  await prisma.position.create({
    data: {
      lat: 19.4326,
      lng: -99.1332,
      vehicleId: adminVehicle.id,
    },
  });

  // Create vehicle for regular user
  const userVehicle = await prisma.vehicle.create({
    data: {
      license: 'USER-001',
      brand: 'Toyota',
      color: 'Blue',
      model: 'Corolla',
      userId: user.id,
    },
  });

  // Create position for user's vehicle
  await prisma.position.create({
    data: {
      lat: 40.7128,
      lng: -74.0060,
      vehicleId: userVehicle.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
