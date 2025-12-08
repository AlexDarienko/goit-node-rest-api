import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(id);

    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Not authorized" });
  }
};