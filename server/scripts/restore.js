const fs = require('fs');
const { PrismaClient } = require('../generated/prisma');
const path = require('path');

const prisma = new PrismaClient();

const backupPath = path.join(__dirname, '..', 'backup.json');

async function restore() {
    try {
        console.log('Reading backup file...');
        const backup = JSON.parse(fs.readFileSync(backupPath));

        console.log('Restoring users...');
        for (const user of backup.users) {
            await prisma.user.create({
                data: user
            });
        }

        console.log('Restoring posts...');
        for (const post of backup.posts) {
            await prisma.post.create({
                data: post
            });
        }

        console.log('Restoring comments...');
        for (const comment of backup.comments) {
            await prisma.comment.create({
                data: comment
            });
        }

        console.log('Restore completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error during restore:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

restore();
