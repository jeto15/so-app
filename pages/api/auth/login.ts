import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { username, password } = req.body;

    try {
        const [rows]: any = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        console.log('rows', rows);
        if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = rows[0];
        // const passwordMatch = await bcrypt.compare(password, user.password);

        // if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });
        if (password !== user.password) {
          return res.status(401).json({ error: "Invalid username or password" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}
