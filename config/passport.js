const passport = require('passport')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const db = require('../models')
const User = db.User

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true
}

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, cb) => {
  try {
    const user = await User.findByPk(payload.id)
    if (!user) {
      return cb(null, false)
    }
    return cb(null, user)
  } catch (e) {
    console.log(e)
  }
})

passport.use(jwtStrategy)

module.exports = passport
