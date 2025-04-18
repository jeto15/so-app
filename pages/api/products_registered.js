import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getProducts(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
} 

// Get all products
const getProducts = async (req, res) => {
  try { 

    const { searchKey = ""} = req.query;
    let rows;

    if (searchKey.trim() === '') {
      [rows] = await pool.query(
        `
        SELECT
            products.Id
            , products.product_details
            , products.product_code
            , products.product_price
            , products.product_cpt_price
            , products.product_ws_price
            , products.product_category
            , products.created_at
            , inventory.location_id
            , inventory.quantity
            , inventory.reorder_level
        FROM
            stvno.inventory
            RIGHT JOIN stvno.products 
                ON (inventory.product_id = products.Id);
        `
      );
    } else {
      const search = `%${searchKey.toLowerCase()}%`;
      [rows] = await pool.query(
        `SELECT * FROM products 
         WHERE LOWER(product_details) LIKE ? 
           OR LOWER(product_code) LIKE ? 
           OR LOWER(product_category) LIKE ? 
         ORDER BY Id DESC LIMIT 20`,
        [search, search, search]
      );
    }
 
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
 
 