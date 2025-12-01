const { Sequelize, DataTypes } = require('sequelize');

const connectionString = process.env.DATABASE_URL || "postgresql://dbcontacts_zlzs_user:yukDaLFXNDIMYf5VjAATmboP7miqdUUd@dpg-d4e5pk3gk3sc73bgvbng-a.oregon-postgres.render.com/dbcontacts_zlzs";

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

const Contact = sequelize.define('contact', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  favorite: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  timestamps: true,
  underscored: true
});

module.exports = {
  Contact,
  sequelize
};
