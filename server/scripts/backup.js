const { PrismaClient } = require('../generated/prisma');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  const posts = await prisma.post.findMany();
  const comments = await prisma.comment.findMany();

  const backup = {
    users,
    posts,
    comments
  };

  const backupPath = path.join(__dirname, '..', 'backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log('Backup completed successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
