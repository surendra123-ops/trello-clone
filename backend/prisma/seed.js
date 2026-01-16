const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runSeed() {
  try {
    console.log("Checking if database needs seed...");

    // Get existing board if present
    const existingBoard = await prisma.board.findFirst();

    // If board exists -> print ID and exit
    if (existingBoard) {
      console.log("Database already seeded.");
      console.log(`Existing Board ID: ${existingBoard.id}`);
      return;
    }

    console.log("No board found — running full seed...");

    // Clear existing tables (safe for fresh DB)
    await prisma.checklistItem.deleteMany();
    await prisma.checklist.deleteMany();
    await prisma.cardMember.deleteMany();
    await prisma.cardLabel.deleteMany();
    await prisma.card.deleteMany();
    await prisma.list.deleteMany();
    await prisma.board.deleteMany();
    await prisma.label.deleteMany();
    await prisma.member.deleteMany();

    // Create labels
    const labels = await Promise.all([
      prisma.label.create({ data: { name: 'Bug', color: '#eb5a46' } }),
      prisma.label.create({ data: { name: 'Feature', color: '#61bd4f' } }),
      prisma.label.create({ data: { name: 'Enhancement', color: '#f2d600' } }),
      prisma.label.create({ data: { name: 'Documentation', color: '#00c2e0' } }),
      prisma.label.create({ data: { name: 'Design', color: '#c377e0' } }),
      prisma.label.create({ data: { name: 'Urgent', color: '#ff9f1a' } }),
    ]);

    // Create members
    const members = await Promise.all([
      prisma.member.create({ 
        data: { name: 'John Doe', email: 'john@example.com', avatar: 'https://i.pravatar.cc/150?img=1' }
      }),
      prisma.member.create({ 
        data: { name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://i.pravatar.cc/150?img=5' }
      }),
      prisma.member.create({ 
        data: { name: 'Mike Johnson', email: 'mike@example.com', avatar: 'https://i.pravatar.cc/150?img=12' }
      }),
      prisma.member.create({ 
        data: { name: 'Sarah Williams', email: 'sarah@example.com', avatar: 'https://i.pravatar.cc/150?img=9' }
      }),
    ]);

    // Create board
    const board = await prisma.board.create({
      data: { title: 'Product Development' },
    });

    // Create lists
    const todoList = await prisma.list.create({
      data: { title: 'To Do', position: 0, boardId: board.id },
    });

    const doingList = await prisma.list.create({
      data: { title: 'In Progress', position: 1, boardId: board.id },
    });

    const doneList = await prisma.list.create({
      data: { title: 'Done', position: 2, boardId: board.id },
    });

    // Cards in To Do
    const card1 = await prisma.card.create({
      data: {
        title: 'Design landing page mockups',
        description: 'Create high-fidelity mockups for the new landing page including desktop and mobile views.',
        position: 0,
        listId: todoList.id,
        dueDate: new Date('2026-01-25'),
      },
    });

    const card2 = await prisma.card.create({
      data: {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment.',
        position: 1,
        listId: todoList.id,
      },
    });

    const card3 = await prisma.card.create({
      data: {
        title: 'Write API documentation',
        description: 'Document all REST endpoints with request/response examples.',
        position: 2,
        listId: todoList.id,
        dueDate: new Date('2026-01-20'),
      },
    });

    // Cards in In Progress
    const card4 = await prisma.card.create({
      data: {
        title: 'Implement drag and drop functionality',
        description: 'Add React Beautiful DnD for list and card reordering.',
        position: 0,
        listId: doingList.id,
        dueDate: new Date('2026-01-18'),
      },
    });

    const card5 = await prisma.card.create({
      data: {
        title: 'Fix authentication bug',
        description: 'Users are being logged out unexpectedly. Investigate and fix.',
        position: 1,
        listId: doingList.id,
      },
    });

    // Cards in Done
    const card6 = await prisma.card.create({
      data: {
        title: 'Database schema design',
        description: 'Design and implement PostgreSQL schema for all entities.',
        position: 0,
        listId: doneList.id,
      },
    });

    const card7 = await prisma.card.create({
      data: {
        title: 'Set up project repository',
        description: 'Initialize Git repository and configure project structure.',
        position: 1,
        listId: doneList.id,
      },
    });

    // Assign labels to cards
    await prisma.cardLabel.createMany({
      data: [
        { cardId: card1.id, labelId: labels[4].id },
        { cardId: card2.id, labelId: labels[1].id },
        { cardId: card3.id, labelId: labels[3].id },
        { cardId: card4.id, labelId: labels[1].id },
        { cardId: card5.id, labelId: labels[0].id },
        { cardId: card5.id, labelId: labels[5].id },
      ],
    });

    // Assign members
    await prisma.cardMember.createMany({
      data: [
        { cardId: card1.id, memberId: members[3].id },
        { cardId: card2.id, memberId: members[2].id },
        { cardId: card3.id, memberId: members[0].id },
        { cardId: card4.id, memberId: members[0].id },
        { cardId: card4.id, memberId: members[1].id },
        { cardId: card5.id, memberId: members[1].id },
        { cardId: card6.id, memberId: members[0].id },
        { cardId: card7.id, memberId: members[2].id },
      ],
    });

    // Checklist for card4
    const checklist = await prisma.checklist.create({
      data: { title: 'Implementation Steps', position: 0, cardId: card4.id },
    });

    await prisma.checklistItem.createMany({
      data: [
        { title: 'Install React Beautiful DnD', completed: true, position: 0, checklistId: checklist.id },
        { title: 'Implement list drag and drop', completed: true, position: 1, checklistId: checklist.id },
        { title: 'Implement card drag and drop', completed: false, position: 2, checklistId: checklist.id },
        { title: 'Add animations', completed: false, position: 3, checklistId: checklist.id },
        { title: 'Test on mobile devices', completed: false, position: 4, checklistId: checklist.id },
      ],
    });

    console.log("Seed completed successfully!");
    console.log(`Board ID: ${board.id}`);

  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { runSeed };

// Allow "npx prisma db seed" usage
if (require.main === module) {
  runSeed().finally(() => prisma.$disconnect());
}
