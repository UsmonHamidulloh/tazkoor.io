"use strict";

module.exports = ({
  knex = {},
  name = "name",
  tableName = "tablename",
  selectableProps = [],
  timeout = 10000,
}) => {
  const db = () => knex;

  const create = (props) => {
    delete props.id;

    return knex
      .insert(props)
      .returning(selectableProps)
      .into(tableName)
      .timeout(timeout);
  };

  const findAll = (
    { offset = 1, limit = 1000000, user_id = 0, is_deleted = false },
    filters
  ) => {
    if (user_id) {
      return knex
        .select(selectableProps)
        .from(tableName)
        .offset((offset - 1) * limit)
        .limit(limit)
        .orderBy("id", "desc")
        .where({ is_deleted, user_id })
        .timeout(timeout);
    } else if (filters) {
      return knex
        .select(selectableProps)
        .from(tableName)
        .offset((offset - 1) * limit)
        .limit(limit)
        .orderBy("id", "desc")
        .where(filters)
        .timeout(timeout);
    } else {
      return knex
        .select(selectableProps)
        .from(tableName)
        .offset((offset - 1) * limit)
        .limit(limit)
        .orderBy("id", "desc")
        .where({ is_deleted })
        .timeout(timeout);
    }
  };

  const find = (filters) =>
    knex
      .select(selectableProps)
      .from(tableName)
      .where(filters)
      .timeout(timeout);

  const findOne = (filters) =>
    find(filters).then((results) => {
      if (!Array.isArray(results)) return results;

      return results[0];
    });

  const findById = (id) =>
    knex.select(selectableProps).from(tableName).where({ id }).timeout(timeout);

  const update = (id, props) => {
    delete props?.id; // not allowed to set or update `id`

    return knex
      .update(props)
      .from(tableName)
      .where({ id: id || 0 })
      .returning(selectableProps)
      .timeout(timeout);
  };

  const destroy = (id) =>
    knex.del().from(tableName).where({ id }).timeout(timeout).returning("id");

  const destroySoft = (id) =>
    knex
      .update({ is_deleted: true })
      .from(tableName)
      .where({ id, is_deleted: false })
      .timeout(timeout);

  return {
    name,
    tableName,
    selectableProps,
    timeout,
    create,
    findAll,
    find,
    findOne,
    findById,
    destroySoft,
    update,
    destroy,
    db,
  };
};
