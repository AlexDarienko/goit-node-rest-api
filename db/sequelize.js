import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DB_URL;
if (!connectionString) {
  console.error('DB_URL is not set in .env');
  process.exit(1);
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
});

export default sequelize;
