const { verify } = require("../utils/jwt");
const knex = require("../../config/database");

const schema = {
  // "/themes": {
  //   GET: "see_theme",
  // },
};

module.exports = async (req, res, next) => {
  if (!schema[req.url] || !schema[req.url].hasOwnProperty(req.method)) {
    return next();
  }

  const token = req.headers.authorization;

  const { id } = await verify(token);

  const roles = await knex("user_roles").where({ id }).select("*");

  const permissions = new Set(
    (
      await knex("role_permissions")
        .join("permissions", "permissions.id", "role_permissions.id")
        .whereIn(
          "role_id",
          roles.map((r) => r.id)
        )
    ).map((p) => p.name)
  );

  if (!permissions.has(schema[req.url][req.method])) {
    return res.sendStatus(403);
  }

  return next();
};
