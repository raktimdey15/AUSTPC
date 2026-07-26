import { createAdminToken, verifyAdminCredentials } from "../utils/adminAuth.js";

export function loginAdmin(req, res) {
  const { username = "", password = "" } = req.body || {};

  if (!username.trim() || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!verifyAdminCredentials(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = createAdminToken(username.trim());
  return res.json({ token, username: username.trim() });
}

export function getAdminSession(req, res) {
  return res.json({ authenticated: true, admin: req.admin?.sub || null });
}