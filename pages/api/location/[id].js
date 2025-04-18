import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getLocations(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
}


// Get all Locations
const getLocations = async (req, res) => {
    const { id } = req.query;
    try { 
      const [rows] = await pool.query(
        `
          SELECT id, name, address 
          FROM locations   
          WHERE id=?
        `,
        [id]
      );
 
 
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Location not found' });
      }
  
      return res.status(200).json(rows); 
    } catch (error) {
      console.error('Category fetch error:', error);
      return res.status(500).json({ error: 'Server error' });
    } 
};
 