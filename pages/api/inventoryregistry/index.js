import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) { 
    case "GET":
      return await getProducts(req, res);
    case "POST":
      return await addInventoryProducts(req, res);  
    default:
      return res.status(405).end(); // Method Not Allowed
  }
} 

const getProducts = async (req, res) => {
  try { 

    const { searchKey = "",  locId } = req.query;

    console.log('locId',locId);
    let rows;

    if (searchKey.trim() === '') {
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
        WHERE inventory.location_id = ?
        LIMIT 20;`,
            [locId] 
      );
    } else {
      const search = `%${searchKey.toLowerCase()}%`;
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
            WHERE 
            inventory.location_id = ? AND (
              LOWER(products.product_details) LIKE ? 
              OR LOWER(products.product_code) LIKE ? 
              OR LOWER(products.product_category) LIKE ?
             )
            ORDER BY Id DESC LIMIT 20
            ` ,
        [locId,search, search, search]
      );
    }
 
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
 
 

//Add a Location
const addInventoryProducts = async (req, res) => {
  try {
    
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    } 

    // Prepare bulk values: [[name1, address1], [name2, address2], ...]
    const values = items.map((item) => [item.productId, 1, item.quantity, item.reorderQty  ]); 
    const [result] = await pool.query(
      "INSERT INTO  inventory (product_id, location_id, quantity, reorder_level) VALUES ?",
      [values] // Note: passed as a nested array
    );

    return res.status(200).json({ message: "Inserted successfully", insertedRows: result.affectedRows });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}; 