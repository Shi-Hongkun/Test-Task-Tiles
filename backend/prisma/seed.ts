import { PrismaClient, Priority, ItemType, EstimateSize } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Check if data already exists
  const existingBoards = await prisma.board.count();
  if (existingBoards > 0) {
    console.log('✅ Database already has data, skipping seed');
    return;
  }

  // Clear existing data (safety measure)
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.board.deleteMany();

  // Create HR Department Board
  const hrBoard = await prisma.board.create({
    data: {
      name: 'HR Department - Q3 2025',
      description:
        'Human Resources management for TechStart Inc. - Recruitment & People Operations',
    },
  });

  // Create columns for HR workflow
  const todoColumn = await prisma.column.create({
    data: {
      name: 'To Do',
      position: 1,
      boardId: hrBoard.id,
    },
  });

  const inProgressColumn = await prisma.column.create({
    data: {
      name: 'In Progress',
      position: 2,
      boardId: hrBoard.id,
    },
  });

  const reviewColumn = await prisma.column.create({
    data: {
      name: 'Review',
      position: 3,
      boardId: hrBoard.id,
    },
  });

  const doneColumn = await prisma.column.create({
    data: {
      name: 'Done',
      position: 4,
      boardId: hrBoard.id,
    },
  });

  // Create comprehensive HR tasks
  const hrTasks = [
    // === RECRUITMENT TASKS ===
    {
      title: 'Post Senior Frontend Developer Job Opening',
      description:
        'Create and publish job posting for Senior Frontend Developer position on LinkedIn, Indeed, and company website. Include React, TypeScript, and Node.js requirements.',
      position: 1,
      columnId: todoColumn.id,
      projectNumber: 'HR-2025-001',
      assignee: 'Sarah Chen',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Q3 Tech Team Expansion',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-08'),
      deadline: new Date('2025-07-10'),
      tags: ['recruitment', 'frontend', 'job-posting'],
    },
    {
      title: 'Schedule Technical Interviews - Frontend Candidates',
      description:
        'Coordinate with engineering team to schedule technical interviews for 5 frontend developer candidates. Include coding challenges and system design discussions.',
      position: 2,
      columnId: inProgressColumn.id,
      projectNumber: 'HR-2025-002',
      assignee: 'Mike Johnson',
      assigner: 'Sarah Chen',
      priority: Priority.URGENT,
      itemType: ItemType.TASK,
      initiative: 'Q3 Tech Team Expansion',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-06'),
      deadline: new Date('2025-07-08'),
      tags: ['interviews', 'technical', 'scheduling'],
    },
    {
      title: 'Background Check - Alex Thompson',
      description:
        'Conduct comprehensive background check for Alex Thompson (Senior DevOps Engineer candidate). Verify employment history, education, and references.',
      position: 3,
      columnId: reviewColumn.id,
      projectNumber: 'HR-2025-003',
      assignee: 'Jennifer Liu',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Q3 Tech Team Expansion',
      estimateSize: EstimateSize.S,
      startDate: new Date('2025-07-10'),
      deadline: new Date('2025-07-12'),
      tags: ['background-check', 'verification', 'devops'],
    },
    {
      title: 'Prepare Offer Letter - UX Designer Position',
      description:
        'Draft comprehensive offer letter for Emma Davis (UX Designer). Include salary, benefits, equity, start date, and company policies.',
      position: 4,
      columnId: doneColumn.id,
      projectNumber: 'HR-2025-004',
      assignee: 'Sarah Chen',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Q3 Design Team Expansion',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-02'),
      deadline: new Date('2025-07-05'),
      tags: ['offer-letter', 'ux', 'completed'],
    },

    // === ONBOARDING TASKS ===
    {
      title: 'Design New Employee Onboarding Program',
      description:
        'Create comprehensive 2-week onboarding program including company culture, tools training, mentorship assignment, and first-week project setup.',
      position: 5,
      columnId: inProgressColumn.id,
      projectNumber: 'HR-2025-005',
      assignee: 'Mike Johnson',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.MEDIUM,
      itemType: ItemType.ENHANCEMENT,
      initiative: 'Employee Experience Improvement',
      estimateSize: EstimateSize.XL,
      startDate: new Date('2025-07-15'),
      deadline: new Date('2025-07-20'),
      tags: ['onboarding', 'employee-experience', 'program-design'],
    },
    {
      title: 'Setup IT Equipment for New Hires',
      description:
        'Coordinate with IT team to prepare laptops, monitors, keyboards, and software licenses for 3 new employees starting July 15th.',
      position: 6,
      columnId: todoColumn.id,
      projectNumber: 'HR-2025-006',
      assignee: 'Jennifer Liu',
      assigner: 'Sarah Chen',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Q3 Tech Team Expansion',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-12'),
      deadline: new Date('2025-07-14'),
      tags: ['equipment', 'it-setup', 'new-hires'],
    },

    // === COMPENSATION & BENEFITS ===
    {
      title: 'Q3 Salary Review Analysis',
      description:
        'Conduct comprehensive salary analysis for all employees. Compare with industry standards, prepare adjustment recommendations, and calculate budget impact.',
      position: 7,
      columnId: reviewColumn.id,
      projectNumber: 'HR-2025-007',
      assignee: 'Lisa Wang (HR Director)',
      assigner: 'CEO',
      priority: Priority.URGENT,
      itemType: ItemType.TASK,
      initiative: 'Compensation Review 2025',
      estimateSize: EstimateSize.XXL,
      startDate: new Date('2025-07-20'),
      deadline: new Date('2025-07-25'),
      tags: ['salary-review', 'compensation', 'analysis'],
    },
    {
      title: 'Implement New Health Insurance Plan',
      description:
        'Transition all employees to new health insurance provider. Update benefits portal, communicate changes, and handle enrollment process.',
      position: 8,
      columnId: inProgressColumn.id,
      projectNumber: 'HR-2025-008',
      assignee: 'Sarah Chen',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.HIGH,
      itemType: ItemType.ENHANCEMENT,
      initiative: 'Benefits Optimization',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-25'),
      deadline: new Date('2025-07-31'),
      tags: ['health-insurance', 'benefits', 'implementation'],
    },
    {
      title: 'Update Employee Handbook - Remote Work Policy',
      description:
        'Revise employee handbook to include updated remote work policies, hybrid schedule guidelines, and performance evaluation criteria.',
      position: 9,
      columnId: todoColumn.id,
      projectNumber: 'HR-2025-009',
      assignee: 'Mike Johnson',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Policy Updates',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-16'),
      deadline: new Date('2025-07-18'),
      tags: ['handbook', 'remote-work', 'policy'],
    },

    // === PERFORMANCE & DEVELOPMENT ===
    {
      title: 'Organize Q2 Performance Reviews',
      description:
        'Coordinate performance review process for all 25 employees. Schedule 1-on-1 meetings, collect feedback forms, and prepare performance summaries.',
      position: 10,
      columnId: doneColumn.id,
      projectNumber: 'HR-2025-010',
      assignee: 'Jennifer Liu',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Performance Management',
      estimateSize: EstimateSize.XL,
      startDate: new Date('2025-06-25'),
      deadline: new Date('2025-07-01'),
      tags: ['performance-review', 'feedback', 'completed'],
    },
    {
      title: 'Plan Team Building Event - Summer Retreat',
      description:
        'Organize company-wide summer retreat for team building. Book venue, plan activities, manage catering, and coordinate transportation for 30 people.',
      position: 11,
      columnId: inProgressColumn.id,
      projectNumber: 'HR-2025-011',
      assignee: 'Sarah Chen',
      assigner: 'CEO',
      priority: Priority.LOW,
      itemType: ItemType.TASK,
      initiative: 'Employee Engagement',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-08-01'),
      deadline: new Date('2025-08-15'),
      tags: ['team-building', 'event', 'retreat'],
    },
    {
      title: 'Launch Learning & Development Program',
      description:
        'Create structured L&D program with online courses, conference budget allocation, and internal knowledge sharing sessions.',
      position: 12,
      columnId: todoColumn.id,
      projectNumber: 'HR-2025-012',
      assignee: 'Mike Johnson',
      assigner: 'Lisa Wang (HR Director)',
      priority: Priority.MEDIUM,
      itemType: ItemType.FEATURE,
      initiative: 'Professional Development',
      estimateSize: EstimateSize.XL,
      startDate: new Date('2025-07-28'),
      deadline: new Date('2025-08-01'),
      tags: ['learning', 'development', 'training'],
    },

    // === COMPLIANCE & LEGAL ===
    {
      title: 'Update Data Privacy Compliance Documentation',
      description:
        'Review and update GDPR compliance documentation, employee data handling procedures, and privacy policy updates.',
      position: 13,
      columnId: reviewColumn.id,
      projectNumber: 'HR-2025-013',
      assignee: 'Jennifer Liu',
      assigner: 'Legal Team',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Compliance Updates',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-20'),
      deadline: new Date('2025-07-22'),
      tags: ['privacy', 'compliance', 'legal'],
    },
    {
      title: 'Conduct Workplace Safety Training',
      description:
        'Mandatory safety training for all employees covering fire safety, emergency procedures, and workplace ergonomics.',
      position: 14,
      columnId: todoColumn.id,
      projectNumber: 'HR-2025-014',
      assignee: 'Sarah Chen',
      assigner: 'Safety Officer',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Safety Compliance',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-25'),
      deadline: new Date('2025-07-30'),
      tags: ['safety', 'training', 'compliance'],
    },

    // === URGENT ISSUES ===
    {
      title: 'Resolve Payroll Discrepancy - June 2025',
      description:
        'Investigate and resolve payroll discrepancies reported by 3 employees for June 2025. Coordinate with finance team and issue corrections.',
      position: 15,
      columnId: inProgressColumn.id,
      projectNumber: 'HR-2025-015',
      assignee: 'Lisa Wang (HR Director)',
      assigner: 'Finance Team',
      priority: Priority.URGENT,
      itemType: ItemType.BUG,
      initiative: 'Payroll Operations',
      estimateSize: EstimateSize.S,
      startDate: new Date('2025-07-07'),
      deadline: new Date('2025-07-09'),
      tags: ['payroll', 'urgent', 'finance'],
    },
  ];

  // Create all tasks
  for (const task of hrTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('🎉 HR Department seed completed!');
  console.log(`✅ Created 1 board with 4 columns and ${hrTasks.length} tasks`);
  console.log('📊 Task distribution:');
  console.log(
    `   - To Do: ${hrTasks.filter((t) => t.columnId === todoColumn.id).length} tasks`
  );
  console.log(
    `   - In Progress: ${hrTasks.filter((t) => t.columnId === inProgressColumn.id).length} tasks`
  );
  console.log(
    `   - Review: ${hrTasks.filter((t) => t.columnId === reviewColumn.id).length} tasks`
  );
  console.log(
    `   - Done: ${hrTasks.filter((t) => t.columnId === doneColumn.id).length} tasks`
  );

  // Create Wedding Planning Board
  const weddingBoard = await prisma.board.create({
    data: {
      name: 'Emma & David Dream Wedding - August 16, 2025',
      description:
        'Premium wedding planning project for Emma Thompson & David Chen - Enchanted Garden Theme at Grand Hyatt Hotel',
    },
  });

  // Create columns for wedding planning workflow
  const weddingTodoColumn = await prisma.column.create({
    data: {
      name: 'To Do',
      position: 1,
      boardId: weddingBoard.id,
    },
  });

  const weddingInProgressColumn = await prisma.column.create({
    data: {
      name: 'In Progress',
      position: 2,
      boardId: weddingBoard.id,
    },
  });

  const weddingReviewColumn = await prisma.column.create({
    data: {
      name: 'Review',
      position: 3,
      boardId: weddingBoard.id,
    },
  });

  const weddingDoneColumn = await prisma.column.create({
    data: {
      name: 'Done',
      position: 4,
      boardId: weddingBoard.id,
    },
  });

  // Create comprehensive wedding planning tasks
  const weddingTasks = [
    // === VENUE & CATERING ===
    {
      title: 'Finalize Grand Hyatt Hotel Venue Contract',
      description:
        'Complete contract negotiations with Grand Hyatt Hotel for August 16th wedding ceremony and reception. Confirm garden terrace availability, capacity for 120 guests, and backup indoor options.',
      position: 1,
      columnId: weddingTodoColumn.id,
      projectNumber: 'WED-2025-001',
      assignee: 'Sarah Martinez',
      assigner: 'Emma Thompson (Bride)',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Venue & Catering',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-10'),
      deadline: new Date('2025-07-15'),
      tags: ['venue', 'contract', 'catering'],
    },
    {
      title: 'Wedding Menu Tasting & Selection',
      description:
        'Schedule and attend wedding menu tasting session with Executive Chef. Select 3-course dinner menu, cocktail hour appetizers, and wedding cake flavors. Accommodate dietary restrictions.',
      position: 2,
      columnId: weddingInProgressColumn.id,
      projectNumber: 'WED-2025-002',
      assignee: 'Emma Thompson',
      assigner: 'Sarah Martinez',
      priority: Priority.URGENT,
      itemType: ItemType.TASK,
      initiative: 'Venue & Catering',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-08'),
      deadline: new Date('2025-07-12'),
      tags: ['menu', 'tasting', 'catering'],
    },
    {
      title: 'Floral Arrangements & Centerpieces Design',
      description:
        'Work with florist to design enchanted garden theme floral arrangements. Create centerpieces with white roses, eucalyptus, and fairy lights. Plan bridal bouquet and boutonnieres.',
      position: 3,
      columnId: weddingReviewColumn.id,
      projectNumber: 'WED-2025-003',
      assignee: 'Isabella Rodriguez',
      assigner: 'Sarah Martinez',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Venue & Catering',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-12'),
      deadline: new Date('2025-07-18'),
      tags: ['flowers', 'centerpieces', 'design'],
    },

    // === PHOTOGRAPHY & VIDEOGRAPHY ===
    {
      title: 'Book Award-Winning Wedding Photographer',
      description:
        'Secure booking with Michael Chen Photography for full-day wedding coverage. Include engagement session, ceremony, reception, and next-day portraits. Confirm equipment and backup plans.',
      position: 4,
      columnId: weddingDoneColumn.id,
      projectNumber: 'WED-2025-004',
      assignee: 'David Chen',
      assigner: 'Emma Thompson (Bride)',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Photography & Videography',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-01'),
      deadline: new Date('2025-07-05'),
      tags: ['photography', 'booking', 'completed'],
    },
    {
      title: 'Videography & Drone Footage Planning',
      description:
        'Coordinate with videographer for cinematic wedding video production. Plan drone footage for outdoor ceremony, reception highlights, and couple portraits. Obtain necessary permits.',
      position: 5,
      columnId: weddingInProgressColumn.id,
      projectNumber: 'WED-2025-005',
      assignee: 'Sarah Martinez',
      assigner: 'David Chen',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Photography & Videography',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-15'),
      deadline: new Date('2025-07-20'),
      tags: ['videography', 'drone', 'permits'],
    },

    // === ATTIRE & BEAUTY ===
    {
      title: 'Wedding Dress Final Fitting & Alterations',
      description:
        'Schedule final fitting appointment at Vera Wang Bridal for custom wedding dress. Complete final alterations, bustle attachment, and accessory coordination. Confirm pickup date.',
      position: 6,
      columnId: weddingTodoColumn.id,
      projectNumber: 'WED-2025-006',
      assignee: 'Emma Thompson',
      assigner: 'Sarah Martinez',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Attire & Beauty',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-20'),
      deadline: new Date('2025-07-25'),
      tags: ['dress', 'fitting', 'alterations'],
    },
    {
      title: 'Groom Tuxedo & Groomsmen Attire',
      description:
        'Coordinate tuxedo rental for groom and 6 groomsmen from Hugo Boss. Schedule fitting appointments, select accessories, and confirm pickup/return dates. Ensure color coordination.',
      position: 7,
      columnId: weddingInProgressColumn.id,
      projectNumber: 'WED-2025-007',
      assignee: 'David Chen',
      assigner: 'Emma Thompson (Bride)',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Attire & Beauty',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-10'),
      deadline: new Date('2025-07-15'),
      tags: ['tuxedo', 'groomsmen', 'rental'],
    },
    {
      title: 'Bridal Hair & Makeup Trial',
      description:
        'Schedule trial session with celebrity makeup artist and hair stylist. Test wedding day looks, take photos for reference, and finalize timeline for wedding morning preparation.',
      position: 8,
      columnId: weddingReviewColumn.id,
      projectNumber: 'WED-2025-008',
      assignee: 'Emma Thompson',
      assigner: 'Sarah Martinez',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Attire & Beauty',
      estimateSize: EstimateSize.S,
      startDate: new Date('2025-07-18'),
      deadline: new Date('2025-07-22'),
      tags: ['makeup', 'hair', 'trial'],
    },

    // === MUSIC & ENTERTAINMENT ===
    {
      title: 'Live Jazz Band Booking for Ceremony',
      description:
        'Book "The Harmony Quartet" jazz band for ceremony and cocktail hour. Confirm song list including processional, recessional, and special requests. Coordinate sound equipment needs.',
      position: 9,
      columnId: weddingDoneColumn.id,
      projectNumber: 'WED-2025-009',
      assignee: 'Michael Torres',
      assigner: 'David Chen',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Music & Entertainment',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-06-28'),
      deadline: new Date('2025-07-03'),
      tags: ['music', 'jazz-band', 'completed'],
    },
    {
      title: 'DJ & Sound System Setup for Reception',
      description:
        'Coordinate with DJ Alex Rodriguez for reception entertainment. Finalize playlist, set up wireless microphones, and plan special lighting effects. Include backup equipment.',
      position: 10,
      columnId: weddingInProgressColumn.id,
      projectNumber: 'WED-2025-010',
      assignee: 'Sarah Martinez',
      assigner: 'Michael Torres',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Music & Entertainment',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-20'),
      deadline: new Date('2025-07-25'),
      tags: ['dj', 'sound-system', 'lighting'],
    },

    // === INVITATIONS & STATIONERY ===
    {
      title: 'Wedding Invitations Design & Printing',
      description:
        'Design and print 130 elegant wedding invitations with RSVP cards. Include venue map, accommodation details, and wedding website information. Coordinate with calligrapher for addressing.',
      position: 11,
      columnId: weddingTodoColumn.id,
      projectNumber: 'WED-2025-011',
      assignee: 'Isabella Rodriguez',
      assigner: 'Emma Thompson (Bride)',
      priority: Priority.HIGH,
      itemType: ItemType.TASK,
      initiative: 'Invitations & Stationery',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-15'),
      deadline: new Date('2025-07-20'),
      tags: ['invitations', 'printing', 'design'],
    },
    {
      title: 'Guest List Management & RSVPs',
      description:
        'Manage guest list database, track RSVP responses, and coordinate with caterer for final headcount. Handle dietary restrictions and special accommodation requests.',
      position: 12,
      columnId: weddingInProgressColumn.id,
      projectNumber: 'WED-2025-012',
      assignee: 'Sarah Martinez',
      assigner: 'Emma Thompson (Bride)',
      priority: Priority.URGENT,
      itemType: ItemType.TASK,
      initiative: 'Invitations & Stationery',
      estimateSize: EstimateSize.L,
      startDate: new Date('2025-07-05'),
      deadline: new Date('2025-07-10'),
      tags: ['guest-list', 'rsvp', 'coordination'],
    },

    // === TRANSPORTATION & LOGISTICS ===
    {
      title: 'Luxury Transportation for Wedding Party',
      description:
        'Arrange luxury transportation for bride, groom, and wedding party. Book vintage Rolls Royce for couple and luxury SUVs for bridal party. Coordinate pickup/drop-off schedule.',
      position: 13,
      columnId: weddingReviewColumn.id,
      projectNumber: 'WED-2025-013',
      assignee: 'Michael Torres',
      assigner: 'David Chen',
      priority: Priority.MEDIUM,
      itemType: ItemType.TASK,
      initiative: 'Transportation & Logistics',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-07-25'),
      deadline: new Date('2025-07-30'),
      tags: ['transportation', 'luxury', 'logistics'],
    },
    {
      title: 'Wedding Day Timeline & Coordination',
      description:
        'Create detailed wedding day timeline coordinating all vendors, wedding party, and family members. Include buffer time, backup plans, and emergency contacts.',
      position: 14,
      columnId: weddingTodoColumn.id,
      projectNumber: 'WED-2025-014',
      assignee: 'Sarah Martinez',
      assigner: 'Emma Thompson (Bride)',
      priority: Priority.HIGH,
      itemType: ItemType.FEATURE,
      initiative: 'Transportation & Logistics',
      estimateSize: EstimateSize.XL,
      startDate: new Date('2025-07-30'),
      deadline: new Date('2025-08-05'),
      tags: ['timeline', 'coordination', 'planning'],
    },

    // === SPECIAL TOUCHES ===
    {
      title: 'Custom Wedding Favors & Gift Bags',
      description:
        'Design and create personalized wedding favors for guests. Include custom candles, local honey, and thank you notes. Prepare welcome bags for out-of-town guests.',
      position: 15,
      columnId: weddingDoneColumn.id,
      projectNumber: 'WED-2025-015',
      assignee: 'Isabella Rodriguez',
      assigner: 'Sarah Martinez',
      priority: Priority.LOW,
      itemType: ItemType.ENHANCEMENT,
      initiative: 'Special Touches',
      estimateSize: EstimateSize.M,
      startDate: new Date('2025-06-30'),
      deadline: new Date('2025-07-05'),
      tags: ['favors', 'gifts', 'completed'],
    },
  ];

  // Create all wedding tasks
  for (const task of weddingTasks) {
    await prisma.task.create({
      data: task,
    });
  }

  console.log('💒 Wedding Planning seed completed!');
  console.log(
    `✅ Created 1 board with 4 columns and ${weddingTasks.length} tasks`
  );
  console.log('📊 Task distribution:');
  console.log(
    `   - To Do: ${weddingTasks.filter((t) => t.columnId === weddingTodoColumn.id).length} tasks`
  );
  console.log(
    `   - In Progress: ${weddingTasks.filter((t) => t.columnId === weddingInProgressColumn.id).length} tasks`
  );
  console.log(
    `   - Review: ${weddingTasks.filter((t) => t.columnId === weddingReviewColumn.id).length} tasks`
  );
  console.log(
    `   - Done: ${weddingTasks.filter((t) => t.columnId === weddingDoneColumn.id).length} tasks`
  );

  console.log('\n🌟 All seed data completed!');
  console.log(
    `📋 Total: 2 boards, 8 columns, ${hrTasks.length + weddingTasks.length} tasks`
  );
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
