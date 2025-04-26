import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) { 
    case "GET":
      return await getInventoryProducts(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
} 

const getInventoryProducts = async (req, res) => {
  try { 
    const { id } = req.query; 
    let rows;
 
    [rows] = await pool.query(
    `SELECT 
            products.Id
        , products.product_details
        , products.product_code
        , products.product_price
        , products.product_cpt_price
        , products.product_ws_price
        , products.product_category
        , products.location_registered
        , products.created_at
        , inventory.location_id
        , inventory.quantity
        , inventory.reorder_level
        , inventory.last_updated 
        , inventory.id as InventoryID
    FROM
        stvno.inventory
        INNER JOIN stvno.products 
        ON (inventory.product_id = products.Id)
    WHERE products.Id = ?
    LIMIT 20;`,
        [id] 
    );


    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
 