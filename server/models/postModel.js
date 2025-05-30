const { Prisma, PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()
const { sql } = Prisma


const getFilteredPosts = async (published = null, offset = null, limit = null, searchParams) => {
    /*
    const SQL = Prisma.sql`
        SELECT * FROM posts 
        WHERE published IN (${Prisma.join(published)})
        ORDER BY createdAt DESC
        OFFSET ${offset}
        LIMIT ${limit}
    `
    const posts = await prisma.$queryRaw(SQL)
    */
    /*
    const filter = {
        where: {
            OR: published.map(value => ({ published: value }))
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: true
        }
    }
    if(offset){
        filter.skip = parseInt(offset)
    }
    if(limit){
        filter.take = parseInt(limit)
    }
    const posts = await prisma.post.findMany(filter)
    */
    const conditions = []
    if (searchParams && searchParams.trim()) {
        conditions.push(sql`p.fts @@ plainto_tsquery('english', ${searchParams})`)
    }
    if (published !== null) {
        conditions.push(sql`p.published = ${published}`)
    }
    const whereClause = conditions.length > 0
        ? conditions.reduce((acc, condition, index) => {
            if (index === 0) return sql`WHERE ${condition}`;
            return sql`${acc} AND ${condition}`;
        }, sql``)
        : sql``;
    const query = sql`
        SELECT 
            p.id,
            p.title,
            p.content,
            p.published,
            p."authorId",
            p."createdAt",
            p."updatedAt",
            p.image,
            p.fts::text as fts,
            u.email as "email", 
            u.username as "username"
        FROM "posts" p
        JOIN "users" u ON u.id = p."authorId"
        ${whereClause}
        ORDER BY p."createdAt" DESC
        LIMIT ${parseInt(limit) ?? 25}
        OFFSET ${parseInt(offset) ?? 0}
    `

    const posts = await prisma.$queryRaw(query)
    return posts
}

const getPostById = async (postId) => {
    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    return post
}

const createPost = async (title, content, published, authorId, imageUrl) => {
    const post = await prisma.post.create({
        data: {
            title,
            content,
            published,
            image: imageUrl,
            author: {
                connect: {
                    id: authorId
                }
            }
        },
        include: {
            author: true
        }
    })
    return post
}

const updatePost = async (postId, title, content, published) => {
    const updatedPost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            title,
            content,
            published
        }
    })
    return updatedPost
}

const deletePost = async (postId) => {
    const deletedPost = await prisma.post.delete({
        where: {
            id: postId
        }
    })
    return deletedPost
}

module.exports = {
    getFilteredPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}