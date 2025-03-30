import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get token from cookies
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return res.status(200).json(decoded); // Send user info
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid Token" });
  }
}
