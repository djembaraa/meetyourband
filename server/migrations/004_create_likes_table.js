exports.up = function(knex) {
  return knex.schema.createTable('likes', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.integer('post_id').unsigned().references('id').inTable('posts').onDelete('CASCADE').nullable();
    table.integer('comment_id').unsigned().references('id').inTable('comments').onDelete('CASCADE').nullable();
    table.timestamps(true, true);
    table.unique(['user_id', 'post_id']);
    table.unique(['user_id', 'comment_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('likes');
};