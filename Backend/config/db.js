const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://root:nimai1234$@localhost:5432/boom',
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('DB connection error:', err.stack);
  }
  console.log('Connected to PostgreSQL DB');

  client.query('SELECT NOW()', (err, result) => {
    release();

    if (err) {
      return console.error('Query error:', err.stack);
    }
    console.log('DB time:', result.rows[0]);
  });
});