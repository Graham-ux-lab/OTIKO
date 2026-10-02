import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = [
    { name: 'Concerts', slug: 'concerts' },
    { name: 'Comedy', slug: 'comedy' },
    { name: 'Sports', slug: 'sports' },
    { name: 'Parties', slug: 'parties' },
    { name: 'Theatre', slug: 'theatre' },
    { name: 'Conferences', slug: 'conferences' },
    { name: 'Workshops', slug: 'workshops' },
    { name: 'Family', slug: 'family' },
    { name: 'Religious', slug: 'religious' },
    { name: 'Other', slug: 'other' },
  ];

  for (const cat of categories) {
    await prisma.eventCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Categories created');

  // Admin user
  const adminPassword = await argon2.hash('Admin@123456');
  await prisma.user.upsert({
    where: { email: 'admin@otiko.com' },
    update: {},
    create: {
      email: 'admin@otiko.com',
      phone: '+254700000001',
      name: 'OTIKO Admin',
      password: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      mfaEnabled: false,
    },
  });
  console.log('✅ Admin user created (admin@otiko.com / Admin@123456)');

  // Verified organizer
  const organizerPassword = await argon2.hash('Organizer@123456');
  const verifiedUser = await prisma.user.upsert({
    where: { email: 'organizer@otiko.com' },
    update: {},
    create: {
      email: 'organizer@otiko.com',
      phone: '+254700000002',
      name: 'East Africa Events',
      password: organizerPassword,
      role: 'ORGANIZER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  const verifiedProfile = await prisma.organizerProfile.upsert({
    where: { userId: verifiedUser.id },
    update: {},
    create: {
      userId: verifiedUser.id,
      organizationName: 'East Africa Events Ltd',
      description: 'Premier event organizer in East Africa',
      status: 'VERIFIED',
      approvedAt: new Date(),
    },
  });
  console.log('✅ Verified organizer created (organizer@otiko.com / Organizer@123456)');

  // Pending organizer
  const pendingPassword = await argon2.hash('Pending@123456');
  const pendingUser = await prisma.user.upsert({
    where: { email: 'pending@otiko.com' },
    update: {},
    create: {
      email: 'pending@otiko.com',
      phone: '+254700000003',
      name: 'Nairobi Concerts',
      password: pendingPassword,
      role: 'ORGANIZER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });

  await prisma.organizerProfile.upsert({
    where: { userId: pendingUser.id },
    update: {},
    create: {
      userId: pendingUser.id,
      organizationName: 'Nairobi Concerts',
      description: 'Bringing the best concerts to Nairobi',
      status: 'PENDING',
    },
  });
  console.log('✅ Pending organizer created (pending@otiko.com / Pending@123456)');

  // Sample events
  const concertsCat = await prisma.eventCategory.findUnique({ where: { slug: 'concerts' } });
  const comedyCat = await prisma.eventCategory.findUnique({ where: { slug: 'comedy' } });
  const conferencesCat = await prisma.eventCategory.findUnique({ where: { slug: 'conferences' } });

  if (concertsCat && comedyCat && conferencesCat) {
    await prisma.event.create({
      data: {
        title: 'Kenya Music Festival 2026',
        description: 'The biggest music festival in East Africa featuring top artists.',
        categoryId: concertsCat.id,
        startDate: new Date('2026-09-15T18:00:00'),
        endDate: new Date('2026-09-15T23:00:00'),
        venue: 'Kasarani Stadium',
        location: 'Nairobi, Kenya',
        status: 'PUBLISHED',
        organizerId: verifiedProfile.id,
        ticketTypes: {
          create: [
            { name: 'Regular', price: 1500, quantity: 3000, salesStart: new Date(), salesEnd: new Date('2026-09-14') },
            { name: 'VIP', price: 5000, quantity: 1500, salesStart: new Date(), salesEnd: new Date('2026-09-14') },
            { name: 'VVIP', price: 10000, quantity: 500, salesStart: new Date(), salesEnd: new Date('2026-09-14') },
          ],
        },
      },
    });

    await prisma.event.create({
      data: {
        title: 'Comedy Night Live',
        description: 'A night of laughter with top comedians.',
        categoryId: comedyCat.id,
        startDate: new Date('2026-09-30T19:30:00'),
        endDate: new Date('2026-09-30T22:00:00'),
        venue: 'Sarit Centre',
        location: 'Nairobi, Kenya',
        status: 'PUBLISHED',
        organizerId: verifiedProfile.id,
        ticketTypes: {
          create: [
            { name: 'Regular', price: 800, quantity: 500, salesStart: new Date(), salesEnd: new Date('2026-09-29') },
            { name: 'VIP', price: 2000, quantity: 100, salesStart: new Date(), salesEnd: new Date('2026-09-29') },
          ],
        },
      },
    });

    await prisma.event.create({
      data: {
        title: 'Tech Summit Nairobi',
        description: 'Leading tech conference in Africa.',
        categoryId: conferencesCat.id,
        startDate: new Date('2026-10-20T09:00:00'),
        endDate: new Date('2026-10-20T17:00:00'),
        venue: 'KICC',
        location: 'Nairobi, Kenya',
        status: 'PUBLISHED',
        organizerId: verifiedProfile.id,
        ticketTypes: {
          create: [
            { name: 'Regular', price: 3000, quantity: 1000, salesStart: new Date(), salesEnd: new Date('2026-10-19') },
            { name: 'Student', price: 1500, quantity: 200, salesStart: new Date(), salesEnd: new Date('2026-10-19') },
          ],
        },
      },
    });
    console.log('✅ Sample events created');
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });