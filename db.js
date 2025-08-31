const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',     // teu usuário do Postgres
  password: 'P@ssW0rd', // tua senha do Postgres
  database: 'client_order_system',
  port: 5432,           // porta padrão do PostgreSQL
  max: 10               // equivalente ao connectionLimit
});

module.exports = pool;
