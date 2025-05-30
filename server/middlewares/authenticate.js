const passport = require('../config/passport');

const isAuthenticated = (req, res, next) => {
    passport.authenticate('jwt', { session: false}, (err, user, info) => {
        if(err){
            return next(err)
        }
        if(!user){
            if(info && info.name === 'TokenExpiredError'){
                return res.status(401).json({ message: 'Access token expired' })
            }
            return res.status(401).json({ message: 'Unauthorized' })
        }
        req.user = user
        next()
    })(req, res, next)
}

module.exports = isAuthenticated