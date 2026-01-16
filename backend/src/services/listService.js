const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createList = async (title, boardId) => {
  // Get the highest position in the board
  const lastList = await prisma.list.findFirst({
    where: { boardId },
    orderBy: { position: 'desc' },
  });

  const position = lastList ? lastList.position + 1 : 0;

  return await prisma.list.create({
    data: {
      title,
      boardId,
      position,
    },
  });
};

exports.updateList = async (id, title) => {
  const list = await prisma.list.findUnique({ where: { id } });
  
  if (!list) {
    const error = new Error('List not found');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.list.update({
    where: { id },
    data: { title },
  });
};

exports.deleteList = async (id) => {
  const list = await prisma.list.findUnique({ where: { id } });
  
  if (!list) {
    const error = new Error('List not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.list.delete({ where: { id } });
};

exports.reorderLists = async (listIds) => {
  // Update position for each list
  const updatePromises = listIds.map((listId, index) =>
    prisma.list.update({
      where: { id: listId },
      data: { position: index },
    })
  );

  await Promise.all(updatePromises);
};