module.exports = (fastify) => {
  // once the server get started we can seed the database table
  fastify.mysql.getConnection(onConnect);

  function onConnect(err, client) {
    if (err) return reply.send(err);

    client.query(
      `CREATE TABLE IF NOT EXISTS apartment (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        location VARCHAR(65), 
        rent INT(30),
        size INT(30),
        picture VARCHAR(500) 
    )`,
      function onResult(err, result) {
        client.release();

        if (err) console.log(err);

        console.log({ result });
      }
    );
  }
};
