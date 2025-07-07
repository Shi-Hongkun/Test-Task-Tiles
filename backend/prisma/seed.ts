import { PrismaClient, Priority, ItemType, EstimateSize } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
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
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
