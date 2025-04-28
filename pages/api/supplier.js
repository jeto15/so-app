import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getSupplier(req, res); 
    case "POST":
      return await createSupplier(req, res); // Added POST handler
    default:
      return res.status(405).end(); // Method Not Allowed
  }
}

// Get all suppliers
const getSupplier = async (req, res) => {
  const { keyword = '' } = req.query;

  if (!keyword.trim()) {
    return res.status(200).json([]);
  }

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
    console.error('Supplier fetch error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Create a new supplier
const createSupplier = async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Supplier name is required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO suppliers (name) VALUES (?)", 
      [name]
    );

    // Fetch the newly added supplier with the generated id
    const [newSupplier] = await pool.query(
      "SELECT id, name FROM suppliers WHERE id = ?", 
      [result.insertId]
    );

    return res.status(201).json(newSupplier[0]); // Return the new supplier
  } catch (error) {
    console.error('Error creating supplier:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
