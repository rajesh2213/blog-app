const {PrismaClient} = require('../generated/prisma')
const prisma = new PrismaClient()

const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    return user
}

const getUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })
    return user
}


const createUser = async (email, username, hashPassword, role) => {
    const data = {
        email,
        username,
        password: hashPassword
    }
    if(role === 'admin' || role === 'user'){
        data.role = role
    }
    const user = await prisma.user.create({
        data
    })
    return user
}

const getProfile = async (userId) => {
    const userData = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
            posts: {
                orderBy: {
                    createdAt: 'desc'
                }
            },
            comments: {
                include: {
                    post: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    })
    return userData
}

module.exports = {
    getUserByEmail,
    getUserById,
    createUser,
    getProfile
}