import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};


export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  const adminExists = await Admin.findOne({ username });
  if (adminExists) return res.status(400).json({ message: "Admin already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, password: hashedPassword });

  res.status(201).json({ _id: admin.id, username: admin.username, token: generateToken(admin._id) });
};


export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({ _id: admin.id, username: admin.username, token: generateToken(admin._id) });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};
