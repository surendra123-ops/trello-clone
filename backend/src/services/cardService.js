const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createCard = async ({ title, listId, description }) => {
  // Get highest position in the list
  const lastCard = await prisma.card.findFirst({
    where: { listId, archived: false },
    orderBy: { position: 'desc' },
  });

  const position = lastCard ? lastCard.position + 1 : 0;

  return await prisma.card.create({
    data: {
      title,
      description,
      listId,
      position,
    },
    include: {
      labels: { include: { label: true } },
      members: { include: { member: true } },
      checklists: { include: { items: true } },
    },
  });
};

exports.updateCard = async (id, updateData) => {
  const card = await prisma.card.findUnique({ where: { id } });
  
  if (!card) {
    const error = new Error('Card not found');
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = ['title', 'description', 'dueDate', 'archived'];
  const filteredData = {};
  
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  return await prisma.card.update({
    where: { id },
    data: filteredData,
    include: {
      labels: { include: { label: true } },
      members: { include: { member: true } },
      checklists: { include: { items: { orderBy: { position: 'asc' } } } },
    },
  });
};

exports.deleteCard = async (id) => {
  const card = await prisma.card.findUnique({ where: { id } });
  
  if (!card) {
    const error = new Error('Card not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.card.delete({ where: { id } });
};

exports.reorderCards = async (cardIds, listId) => {
  const updatePromises = cardIds.map((cardId, index) =>
    prisma.card.update({
      where: { id: cardId },
      data: { position: index, listId },
    })
  );

  await Promise.all(updatePromises);
};

exports.moveCard = async (cardId, sourceListId, destListId, newPosition) => {
  // Update card's list and position
  await prisma.card.update({
    where: { id: cardId },
    data: {
      listId: destListId,
      position: newPosition,
    },
  });

  // Reorder remaining cards in source list
  const sourceCards = await prisma.card.findMany({
    where: { listId: sourceListId, archived: false, id: { not: cardId } },
    orderBy: { position: 'asc' },
  });

  const sourceUpdatePromises = sourceCards.map((card, index) =>
    prisma.card.update({
      where: { id: card.id },
      data: { position: index },
    })
  );

  // Reorder cards in destination list
  const destCards = await prisma.card.findMany({
    where: { listId: destListId, archived: false },
    orderBy: { position: 'asc' },
  });

  const destUpdatePromises = destCards.map((card, index) =>
    prisma.card.update({
      where: { id: card.id },
      data: { position: index },
    })
  );

  await Promise.all([...sourceUpdatePromises, ...destUpdatePromises]);
};

exports.searchCards = async (query) => {
  return await prisma.card.findMany({
    where: {
      archived: false,
      title: {
        contains: query,
        mode: 'insensitive',
      },
    },
    include: {
      list: true,
      labels: { include: { label: true } },
      members: { include: { member: true } },
    },
  });
};

exports.filterCards = async (filters) => {
  const where = { archived: false };

  if (filters.labels && filters.labels.length > 0) {
    where.labels = {
      some: {
        labelId: { in: filters.labels },
      },
    };
  }

  if (filters.members && filters.members.length > 0) {
    where.members = {
      some: {
        memberId: { in: filters.members },
      },
    };
  }

  if (filters.due) {
    const now = new Date();
    if (filters.due === 'overdue') {
      where.dueDate = { lt: now };
    } else if (filters.due === 'today') {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      where.dueDate = { gte: now, lt: tomorrow };
    } else if (filters.due === 'week') {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      where.dueDate = { gte: now, lt: nextWeek };
    }
  }

  return await prisma.card.findMany({
    where,
    include: {
      list: true,
      labels: { include: { label: true } },
      members: { include: { member: true } },
    },
  });
};

exports.addLabel = async (cardId, labelId) => {
  // Check if association already exists
  const existing = await prisma.cardLabel.findUnique({
    where: {
      cardId_labelId: { cardId, labelId },
    },
  });

  if (existing) {
    return existing;
  }

  return await prisma.cardLabel.create({
    data: { cardId, labelId },
    include: { label: true },
  });
};

exports.removeLabel = async (cardId, labelId) => {
  await prisma.cardLabel.delete({
    where: {
      cardId_labelId: { cardId, labelId },
    },
  });
};

exports.addMember = async (cardId, memberId) => {
  // Check if association already exists
  const existing = await prisma.cardMember.findUnique({
    where: {
      cardId_memberId: { cardId, memberId },
    },
  });

  if (existing) {
    return existing;
  }

  return await prisma.cardMember.create({
    data: { cardId, memberId },
    include: { member: true },
  });
};

exports.removeMember = async (cardId, memberId) => {
  await prisma.cardMember.delete({
    where: {
      cardId_memberId: { cardId, memberId },
    },
  });
};

exports.addChecklist = async (cardId, title) => {
  // Get highest position
  const lastChecklist = await prisma.checklist.findFirst({
    where: { cardId },
    orderBy: { position: 'desc' },
  });

  const position = lastChecklist ? lastChecklist.position + 1 : 0;

  return await prisma.checklist.create({
    data: {
      title,
      cardId,
      position,
    },
    include: {
      items: { orderBy: { position: 'asc' } },
    },
  });
};