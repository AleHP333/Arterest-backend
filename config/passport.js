const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const extractJwt = require("passport-jwt").ExtractJwt;
const { SECRET_KEY } = process.env;

const User = require("../src/models/user");

passport.use(
    new jwtStrategy(
        {
            jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SECRET_KEY
        },
        async (jwt_payload, done) => {
            User.findOne({_id: jwt_payload._id})
                .then((user) => {
                    if(user){
                        return done(null, user);
                    } else if (err){
                        return done(err, false);
                    } else {
                        return done(null, false);
                    }
                })
                .catch((err) => {
                    console.log(err)
                    return done(err, false);
                });
        }
    )
);

module.exports = passport;