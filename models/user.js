import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize.js";

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  avatarURL: { type: DataTypes.STRING },
  token: { type: DataTypes.STRING },
});

export default User;