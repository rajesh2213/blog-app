require('dotenv').config()
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { PrismaClient } = require('../generated/prisma')
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

passport.use( new JwtStrategy(opts, async (jwt_payload, done) => {
    try{
        const user = await prisma.user.findUnique({
            where:{
                id: jwt_payload.id
            }
        })
        if(user){
            return done(null, user)
        }
        return done(null, false, { message: 'User not found'})
    }catch(err){
        console.log('Error in passport stratedgy: ',err)
        done(err, false)
    }
}))

module.exports = passport