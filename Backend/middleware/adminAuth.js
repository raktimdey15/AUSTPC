import { verifyAdminToken } from "../utils/adminAuth.js";

export function requireAdminAuth(req, res, next) {
  const authorization = req.headers.authorization || "";
  const bearerToken = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const headerToken = req.headers["x-admin-token"];
  const token = bearerToken || headerToken;

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.admin = payload;
  return next();
}