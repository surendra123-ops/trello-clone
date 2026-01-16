const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllMembers = async () => {
  return await prisma.member.findMany({
    orderBy: { name: 'asc' },
  });
};