import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getSupplier(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
}

// Get all products
const getSupplier = async (req, res) => {
    const { keyword = '' } = req.query;

    if (!keyword.trim()) {
      return res.status(200).json([]);
    }

    console.log(keyword);
  
    try {
      const search = `%${keyword.toLowerCase()}%`;
      const [rows] = await pool.query(
        `
            SELECT id, name
            FROM suppliers
            WHERE LOWER(name) LIKE ?
            ORDER BY name ASC
            LIMIT 10 
        `, 
        [search]
      );
  
      return res.status(200).json(rows); // send full row with id + name
    } catch (error) {
      console.error('Category fetch error:', error);
      return res.status(500).json({ error: 'Server error' });
    } 
};
 
  