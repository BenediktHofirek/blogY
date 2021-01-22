const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { sequelize } = require("../database/models/index.js");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.PUBLIC_KEY,
  algorithms: ['RS256']
};

// app.js will pass the global passport object here, and this function will configure it
module.exports = (passport) => {
    // The JWT payload is passed into the verify callback
    passport.use(new JwtStrategy(options, function(jwt_payload, done) {
        console.log('JWT payload', jwt_payload);

        sequelize.query(`
          SELECT 
            id,
            description,
            email,
            photo_url as "photoUrl",
            username,
            created_at as "createdAt",
            updated_at as "updatedAt"
          FROM users
          WHERE id = :userId
        `, {
          userId: jwt_payload.sub,
        })
        .then(([user]) => {
            console.log('resultJWT authentication', user);
            return done(null, user || false);
        })
        .catch((err) => {
            return done(err, false);
        })
    }));
}