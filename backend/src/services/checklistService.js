const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.addChecklistItem = async (checklistId, title) => {
  // Get highest position
  const lastItem = await prisma.checklistItem.findFirst({
    where: { checklistId },
    orderBy: { position: 'desc' },
  });

  const position = lastItem ? lastItem.position + 1 : 0;

  return await prisma.checklistItem.create({
    data: {
      title,
      checklistId,
      position,
    },
  });
};

exports.updateChecklistItem = async (id, updateData) => {
  const item = await prisma.checklistItem.findUnique({ where: { id } });
  
  if (!item) {
    const error = new Error('Checklist item not found');
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = ['title', 'completed'];
  const filteredData = {};
  
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  return await prisma.checklistItem.update({
    where: { id },
    data: filteredData,
  });
};

exports.deleteChecklistItem = async (id) => {
  const item = await prisma.checklistItem.findUnique({ where: { id } });
  
  if (!item) {
    const error = new Error('Checklist item not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.checklistItem.delete({ where: { id } });
};