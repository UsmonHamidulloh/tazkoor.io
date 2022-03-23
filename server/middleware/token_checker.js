const { verify } = require("../utils/jwt");
const { User } = require("../modules/collector");

module.exports = async function (req, res, next) {
  try {
    const token = req.headers.authorization;

    if (token) {
      const user = await verify(token);

      if (user) {
        if (await User.findOne({ id: user.id })) {
          req.user = user;

          next();
        } else {
          next();
        }
      }
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};
