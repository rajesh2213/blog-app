const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

const seed = async () => {
    /*
    const adminEmail = 'admin@gmail.com'
    const existingAdmin =  await prisma.user.findUnique({
        where: {
            email: adminEmail
        }
    })
    if(existingAdmin){
        console.log('Admin already exists')
        return
    }
    const hashPassword = await bcrypt.hash('admin123', 10)
    const user = await prisma.user.create({
        data: {
            email: adminEmail,
            username: 'admin',
            password: hashPassword,
            role: 'admin'
        }
    })
    console.log('Admin created: ', user)
    */
    try {

        const parentComment = await prisma.comment.create({
            data: {
                content: 'This is a parent comment about the blog post',
                authorId: 'cmaw2vbci0000u1x4fb3sowvj',
                postId: 'cmb2memh50002u1mwhyldr358'
            }
        });
        console.log('Created parent comment:', parentComment.id);

        const childComment1 = await prisma.comment.create({
            data: {
                content: 'This is a reply to the parent comment',
                authorId: 'cmaw2vbci0000u1x4fb3sowvj',
                postId: 'cmb2memh50002u1mwhyldr358',
                parentId: parentComment.id
            }
        });
        console.log('Created first child comment:', childComment1.id);

        const childComment2 = await prisma.comment.create({
            data: {
                content: 'Another reply to the parent comment',
                authorId: 'cmaw2vbci0000u1x4fb3sowvj',
                postId: 'cmb2memh50002u1mwhyldr358',
                parentId: parentComment.id
            }
        });
        console.log('Created second child comment:', childComment2.id);

        const grandchildComment = await prisma.comment.create({
            data: {
                content: 'This is a reply to the first child comment',
                authorId: 'cmaw2vbci0000u1x4fb3sowvj',
                postId: 'cmb2memh50002u1mwhyldr358',
                parentId: childComment1.id
            }
        });
        console.log('Created grandchild comment:', grandchildComment.id);

        console.log('Successfully created comment thread!');
    } catch (error) {
        console.error('Error seeding comments:', error);
        throw error;
    }
}

seed()
    .catch(err => {
        console.log('Seed error', err)
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect()
    })