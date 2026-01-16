const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllLabels = async () => {
  return await prisma.label.findMany({
    orderBy: { name: 'asc' },
  });
};