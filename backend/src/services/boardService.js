const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getBoard = async (id) => {
  const board = await prisma.board.findUnique({
    where: { id },
    include: {
      lists: {
        orderBy: { position: 'asc' },
        include: {
          cards: {
            where: { archived: false },
            orderBy: { position: 'asc' },
            include: {
              labels: {
                include: {
                  label: true,
                },
              },
              members: {
                include: {
                  member: true,
                },
              },
              checklists: {
                orderBy: { position: 'asc' },
                include: {
                  items: {
                    orderBy: { position: 'asc' },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!board) {
    const error = new Error('Board not found');
    error.statusCode = 404;
    throw error;
  }

  return board;
};

exports.createBoard = async (title) => {
  return await prisma.board.create({
    data: { title },
  });
};