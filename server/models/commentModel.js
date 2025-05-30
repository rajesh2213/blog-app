const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient()

const getCommentsByPostID = async (postId) => {
    const comments = await prisma.comment.findMany({
        where: {
            postId
        },
        include: {
            author: {
                select: {
                    id: true,
                    username: true
                }
            },
            children: {
                include: {
                    author: {
                        select: {
                            id: true,
                            username: true
                        }
                    },
                    children: {
                        include: {
                            author: {
                                select: {
                                    id: true,
                                    username: true
                                }
                            },
                            children: true
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
    return comments
}

const createComment = async (authorId, postId, parentId, content) => {
    let data = {
        author: {
            connect: {
                id: authorId
            }
        },
        post: {
            connect: {
                id: postId
            }
        },
        content
    }
    if (parentId) {
        data.parent = {
            connect: {
                id: parentId
            }
        }
    }
    const comment = await prisma.comment.create({
        data,
        include: {
            author: true,
            post: true
        }
    })
    return comment
}

const deleteComment = async (commentId) => {
    const deletedComment = await prisma.comment.delete({
        where: {
            id: commentId
        }
    })
    return deletedComment
}

module.exports = {
    getCommentsByPostID,
    createComment,
    deleteComment
}