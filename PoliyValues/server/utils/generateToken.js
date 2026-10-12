import jwt from "jsonwebtoken";

const generateToken = (userId, isAdmin, res) => {
  const payload = { id: userId, isAdmin: isAdmin }; // 2. On l'ajoute au payload

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 3600 * 24 * 30,
  });
  return token;
};

export default generateToken;
