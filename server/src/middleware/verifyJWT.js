import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token = req.header("Authorization")?.replace("Bearer ", "");
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded.UserInfo.username;
    next();
  });
};
export default verifyJWT;
