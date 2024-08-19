export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: {
    origins: process.env.CORS_ORIGINS.split(','),
  },
  db: {
    mongo: {
      name: process.env.MONGO_DB_NAME,
      user: process.env.MONGO_DB_USER,
      password: process.env.MONGO_DB_PASSWORD,
      host: process.env.MONGO_DB_HOST,
      port: parseInt(process.env.MONGO_DB_PORT, 10) || 27017,
    },
    postgres: {
      name: process.env.PG_DB_NAME,
      user: process.env.PG_DB_USER,
      password: process.env.PG_DB_PASSWORD,
      host: process.env.PG_DB_HOST,
      port: parseInt(process.env.PG_DB_PORT, 10) || 5432,
    },
    redis: {},
  },
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //   },
  //   mailServer: {
  //     host: process.env.MAIL_SERVER_HOST,
  //     port: parseInt(process.env.MAIL_SERVER_PORT, 10) || 587,
  //     user: process.env.MAIL_SERVER_USER,
  //     password: process.env.MAIL_SERVER_PASSWORD,
  //   },
  //   mailAddress: {
  //     admin: process.env.MAIL_ADDRESS_ADMIN,
  //     auth: process.env.MAIL_ADDRESS_AUTH,
  //     support: process.env.MAIL_ADDRESS_SUPPORT,
  //     contact: process.env.MAIL_ADDRESS_CONTACT,
  //   },
});
