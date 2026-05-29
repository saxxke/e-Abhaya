import { PrismaClient, Role, ComplaintStatus } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.auditLog.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.emergencyContact.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Cleared database.');

  // Create Users (all passwords are 'password123')
  const passwordHash = hashPassword('password123');

  const citizen = await prisma.user.create({
    data: {
      name: 'Rohan Sharma',
      email: 'citizen@eabhaya.in',
      passwordHash,
      role: Role.CITIZEN,
    },
  });

  const officer = await prisma.user.create({
    data: {
      name: 'Inspector Vikram Singh',
      email: 'officer@eabhaya.gov.in',
      passwordHash,
      role: Role.OFFICER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@eabhaya.gov.in',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  console.log('Seeded users (Password for all is password123):');
  console.log(`- Citizen: citizen@eabhaya.in`);
  console.log(`- Officer: officer@eabhaya.gov.in`);
  console.log(`- Admin: admin@eabhaya.gov.in`);

  // Create Emergency Contacts
  await prisma.emergencyContact.createMany({
    data: [
      {
        agencyName: 'General Police Helpline',
        phoneNumber: '112',
        category: 'NATIONAL',
        locationScope: 'All India',
      },
      {
        agencyName: 'Cyber Crime Cell Helpline',
        phoneNumber: '1930',
        category: 'CYBER',
        locationScope: 'All India',
      },
      {
        agencyName: 'Women Helpline',
        phoneNumber: '1091',
        category: 'REGIONAL',
        locationScope: 'All India',
      },
      {
        agencyName: 'Disaster Management Helpline',
        phoneNumber: '108',
        category: 'REGIONAL',
        locationScope: 'State Level',
      },
    ],
  });

  console.log('Seeded emergency contacts.');

  // Create Sample Complaints
  await prisma.complaint.create({
    data: {
      trackingId: 'ABH-2026-0001',
      title: 'Stolen Smartphone at Metro Station',
      description: 'My iPhone 13 was stolen from my pocket while boarding the metro train at Central Station around 8:30 AM. It was active until 9:00 AM, then switched off.',
      category: 'THEFT',
      status: ComplaintStatus.PENDING,
      aiSummary: 'iPhone 13 stolen from user pocket at Central Metro Station during boarding time (8:30 AM). Device is currently offline.',
      aiPriorityScore: 45,
      legalSections: ['Section 303(2) BNS - Theft'],
      location: 'Central Metro Station, Platform 2',
      submittedById: citizen.id,
      assignedOfficerId: officer.id,
    },
  });

  await prisma.complaint.create({
    data: {
      trackingId: 'ABH-2026-0002',
      title: 'Online Credit Card Phishing Scam',
      description: 'I received a message claiming my credit card was blocked. I clicked the link and entered my card code. Subsequently, Rs. 45,000 was debited from my account.',
      category: 'CYBER_CRIME',
      status: ComplaintStatus.REVIEWING,
      aiSummary: 'Phishing victim clicked SMS link and provided credit card credentials, leading to unauthorized transfer of Rs. 45,000.',
      aiPriorityScore: 78,
      legalSections: ['Section 318 BNS - Cheating', 'Section 66D - Information Technology Act'],
      location: 'Online / Cyber Space',
      submittedById: citizen.id,
      assignedOfficerId: officer.id,
    },
  });

  await prisma.complaint.create({
    data: {
      trackingId: 'ABH-2026-0003',
      title: 'Physical Threat and Attempted Break-in',
      description: 'An unknown individual broke in my backyard and threatened me with violence when confronted. He hit the window with a wooden club and ran away when I shouted.',
      category: 'ASSAULT',
      status: ComplaintStatus.FIR_REGISTERED,
      aiSummary: 'Physical trespass, attempted break-in, and explicit verbal threat accompanied by physical damage to property using a club.',
      aiPriorityScore: 92,
      legalSections: ['Section 331 BNS - House-trespass', 'Section 351 BNS - Criminal Intimidation'],
      location: 'Sector 4, Dwarka, New Delhi',
      submittedById: citizen.id,
      assignedOfficerId: officer.id,
    },
  });

  console.log('Seeded sample complaints.');
  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
