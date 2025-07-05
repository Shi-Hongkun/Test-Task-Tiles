import { PrismaClient, Priority, ItemType, EstimateSize } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Find existing tasks and update them with enhanced fields
  const tasks = await prisma.task.findMany();

  if (tasks.length > 0) {
    // Update first task
    await prisma.task.update({
      where: { id: tasks[0].id },
      data: {
        projectNumber: 'Proj-401',
        assignee: 'Sarah Chen',
        assigner: 'Project Manager',
        priority: Priority.HIGH,
        itemType: ItemType.ENHANCEMENT,
        initiative: 'User Interface',
        estimateSize: EstimateSize.L,
        deadline: new Date('2025-07-15'),
        tags: ['frontend', 'ux', 'priority'],
      },
    });

    if (tasks.length > 1) {
      // Update second task
      await prisma.task.update({
        where: { id: tasks[1].id },
        data: {
          projectNumber: 'Proj-123',
          assignee: 'Alex Johnson',
          assigner: 'Tech Lead',
          priority: Priority.URGENT,
          itemType: ItemType.BUG,
          initiative: 'Performance',
          estimateSize: EstimateSize.M,
          deadline: new Date('2025-07-08'),
          tags: ['backend', 'bug', 'critical'],
        },
      });
    }

    console.log(
      `✅ Updated ${Math.min(tasks.length, 2)} tasks with enhanced fields`
    );
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
