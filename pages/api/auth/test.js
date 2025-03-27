import db from "../../lib/db";

export default async function handler(req, res) {
  try {
    const [rows] = await db.execute("SELECT 1+1 AS result");
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
