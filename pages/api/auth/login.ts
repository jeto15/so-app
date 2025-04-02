import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import db from "@/lib/db";
import { RowDataPacket } from "mysql2/promise";  // Import this to correctly type rows

interface User {
    id: number;
    username: string;
    password: string;
    role: string;
}  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    const { username, password } = req.body;

    try {
        const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM users WHERE username = ?", [username]);

        console.log('rows', rows);
        if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = rows[0] as User; // Cast rows[0] to User
        
        if (password !== user.password) {
          return res.status(401).json({ error: "Invalid username or password" });
        }   

        console.log('jwt here',{ id: user.id, role: user.role });

        const token = jwt.sign({ id: user.id, name:user.username, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}
