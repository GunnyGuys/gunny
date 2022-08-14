const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");
const config = require("./config");

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  // @required creates a new extractor that looks for the JWT in the authorization header with the scheme 'bearer'
  // @return either the JWT as a string or null.
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

/**
 *
 * @param {*} payload : is an object literal containing the decoded JWT payload
 * @param {*} done : is a passport error first callback accepting arguments done(error,user,info)
 * @returns
 */
const jwtVerify = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};
