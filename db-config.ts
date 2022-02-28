import { Pool } from 'pg';

const isProduction = process.env.NODE_ENV === 'production'

const dbConnectionString = 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const dbConnectionPool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : process.env.DB_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
})

dbConnectionPool.on('connect', () => {
  // console.log('Successfully connected to PostgreSQL DB pool');
});

export default dbConnectionPool;