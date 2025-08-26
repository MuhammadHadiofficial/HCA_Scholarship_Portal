import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample intakes
  const intakes = await Promise.all([
    prisma.intake.create({
      data: {
        name: "Fall 2024",
        year: 2024,
        semester: "FALL",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2024-12-31"),
        isActive: true,
        maxApplications: 100,
      },
    }),
    prisma.intake.create({
      data: {
        name: "Spring 2025",
        year: 2025,
        semester: "SPRING",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-05-31"),
        isActive: true,
        maxApplications: 100,
      },
    }),
  ]);

  console.log(`✅ Created ${intakes.length} intakes`);

  // Create sample admin user
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@hca.edu",
      name: "System Administrator",
      password: "$2b$12$gRXqOQM75JsO2ANMv4qjfuIyJjyeoGP2AWOMntDu3C8VzMY5Ah/a2", // "password"
      role: "ADMIN",
      adminProfile: {
        create: {
          adminId: "ADMIN001",
          permissions: ["ALL"],
          isActive: true,
        },
      },
    },
  });

  console.log('✅ Created admin user');

  // Create sample staff user
  const staffUser = await prisma.user.create({
    data: {
      email: "staff@hca.edu",
      name: "John Staff",
      password: "$2b$12$gRXqOQM75JsO2ANMv4qjfuIyJjyeoGP2AWOMntDu3C8VzMY5Ah/a2", // "password"
      role: "STAFF",
      staffProfile: {
        create: {
          staffId: "STAFF001",
          department: "Student Affairs",
          designation: "Scholarship Coordinator",
          isActive: true,
        },
      },
    },
  });

  console.log('✅ Created staff user');

  // Create sample student user
  const studentUser = await prisma.user.create({
    data: {
      email: "student@hca.edu",
      name: "Alice Student",
      password: "$2b$12$gRXqOQM75JsO2ANMv4qjfuIyJjyeoGP2AWOMntDu3C8VzMY5Ah/a2", // "password"
      role: "STUDENT",
      studentProfile: {
        create: {
          studentId: "STU001",
          enrollmentYear: 2023,
          currentSemester: 3,
          department: "Computer Science",
          cgpa: 3.8,
          meritListNumber: "ML2023001",
          familyIncome: 45000,
          goals: "To pursue a career in software engineering and contribute to open source projects",
          isActive: true,
        },
      },
    },
  });

  console.log('✅ Created student user');

  // Create sample alumni user
  const alumniUser = await prisma.user.create({
    data: {
      email: "alumni@hca.edu",
      name: "Bob Alumni",
      password: "$2b$12$gRXqOQM75JsO2ANMv4qjfuIyJjyeoGP2AWOMntDu3C8VzMY5Ah/a2", // "password"
      role: "ALUMNI",
      alumniProfile: {
        create: {
          alumniId: "ALUM001",
          graduationYear: 2020,
          department: "Computer Science",
          category: "GOLD",
          rank: "GOLD",
          digitalSignature: "ALUM001_SIG_2024",
          isVerified: true,
          totalContributed: 5000,
          totalPledged: 10000,
        },
      },
    },
  });

  console.log('✅ Created alumni user');

  // Create sample guidelines
  const guidelines = await Promise.all([
    prisma.guideline.create({
      data: {
        title: "Scholarship Application Guidelines",
        content: `
# Scholarship Application Guidelines

## Eligibility Criteria
- Must be a full-time student
- Minimum CGPA of 3.0
- Demonstrated financial need
- Active participation in university activities

## Required Documents
1. Completed application form
2. Academic transcripts
3. Financial statements
4. Utility bills
5. Personal statement
6. Letters of recommendation

## Application Process
1. Submit online application
2. Upload required documents
3. Await review by committee
4. Interview (if shortlisted)
5. Final decision notification

## Scholarship Terms
- Recipients must maintain minimum CGPA of 3.0
- Regular attendance required
- Community service participation expected
- Progress reports due each semester
        `,
        version: "1.0",
        isActive: true,
        publishedBy: adminUser.id,
      },
    }),
    prisma.guideline.create({
      data: {
        title: "Alumni Contribution Guidelines",
        content: `
# Alumni Contribution Guidelines

## Contribution Methods
- One-time donations
- Recurring pledges
- In-kind contributions
- Corporate matching

## Recognition Levels
- Bronze: $100 - $499
- Silver: $500 - $999
- Gold: $1,000 - $4,999
- Platinum: $5,000 - $9,999
- Diamond: $10,000+

## Benefits
- Recognition on donor wall
- Invitation to events
- Networking opportunities
- Tax benefits
        `,
        version: "1.0",
        isActive: true,
        publishedBy: adminUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${guidelines.length} guidelines`);

  // Create sample policies
  const policies = await Promise.all([
    prisma.policy.create({
      data: {
        title: "Scholarship Policy",
        content: `
# Scholarship Policy

## Purpose
To provide financial assistance to deserving students based on merit and need.

## Selection Criteria
- Academic excellence (40%)
- Financial need (30%)
- Extracurricular activities (20%)
- Personal statement (10%)

## Disbursement
- Funds disbursed directly to university
- Applied to tuition and fees
- Remaining balance to student account

## Renewal
- Annual review required
- Performance standards must be met
- Reapplication process
        `,
        version: "1.0",
        isActive: true,
        publishedBy: adminUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${policies.length} policies`);

  // Create program funds
  const programFund1 = await prisma.programFund.create({
    data: {
      name: "Student Welfare Fund",
      description: "Funds allocated for student welfare programs, emergency assistance, and basic needs support.",
      amount: 50000,
      allocatedAmount: 0,
      remainingAmount: 50000,
      category: "STUDENT_WELFARE",
      isActive: true,
      createdBy: adminUser.id,
    },
  });
  console.log('✅ Created 2 program funds');

  const programFund2 = await prisma.programFund.create({
    data: {
      name: "Learning Programs Fund",
      description: "Funds for hackathons, skill development courses, workshops, and educational events.",
      amount: 30000,
      allocatedAmount: 0,
      remainingAmount: 30000,
      category: "LEARNING_PROGRAMS",
      isActive: true,
      createdBy: adminUser.id,
    },
  });

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

