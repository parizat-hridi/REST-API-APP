const seedDatabase = require("./seed");

// Require the framework and instantiate it
const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("fastify-mysql"), {
  connectionString: "mysql://root:admin@localhost/apartment-db",
});

fastify.register(require("fastify-cors"), {});

const PORT = 3000;
const app = fastify;

// CRUD (Create - read - update- delete) Operation

// Create Operation
fastify.post("/apartment/create", function (request, reply) {
  const { location, rent, size, picture } = request.body;

  if (!location || !rent || !size || !picture)
    return reply.send({ err: "All the field is necessary field" });

  fastify.mysql.getConnection(onConnect);

  function onConnect(err, client) {
    if (err) return reply.send(err);

    client.query(
      `INSERT INTO apartment (location, rent, size, picture) values('${location}', '${rent}', '${size}', '${picture}')`,
      function onResult(err, result) {
        client.release();
        reply.send(err || result);
      }
    );
  }
});
// Read Operation
fastify.get("/apartments", function (request, reply) {
  fastify.mysql.getConnection(onConnect);

  function onConnect(err, client) {
    if (err) return reply.send(err);

    client.query(`SELECT * FROM apartment`, function onResult(err, result) {
      client.release();
      reply.send(err || result);
    });
  }
});

// Update Operation
fastify.put("/apartment/:id", function (request, reply) {
  const { id } = request.params;
  const { location, rent, size, picture } = request.body;

  if (!id) reply.send({ err: "Id is necessary" });

  if (!location || !rent || !size || !picture)
    return reply.send({ err: "All the field is necessary field" });

  fastify.mysql.getConnection(onConnect);

  function onConnect(err, client) {
    if (err) return reply.send(err);

    client.query(
      `UPDATE apartment SET location='${location}',rent='${rent}', size='${size}' ,picture='${picture}'
        WHERE id='${id}'
        `,
      function onResult(err, result) {
        client.release();
        reply.send(err || result);
      }
    );
  }
});

// Delete Operation
fastify.delete("/apartment/:id", function (request, reply) {
  const { id } = request.params;

  if (!id) reply.send({ err: "Id is necessary" });

  fastify.mysql.getConnection(onConnect);

  function onConnect(err, client) {
    if (err) return reply.send(err);

    client.query(
      `DELETE FROM apartment WHERE id='${id}'
        `,
      function onResult(err, result) {
        client.release();
        reply.send(err || result);
      }
    );
  }
});

// Run the server!
app.listen(PORT, function (err, address) {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`server listening on ${address}`);
  seedDatabase(fastify);
});
