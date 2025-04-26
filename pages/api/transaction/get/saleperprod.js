import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getPurchaseRecords(req, res);
  }

  return res.status(405).json({ error: "Method Not Allowed" }); 
}

const getPurchaseRecords = async (req, res) => {
  try {
    const { recordId, productId } = req.query;

    if (!recordId) {
      return res.status(400).json({ error: "Missing required parameter: recordId" });
    }

    const [rows] = await pool.query(
        `SELECT
             sales.inventory_id 
            , inventory.product_id
            , inventory.location_id
            , sales.id as saleId
            , sales.quantity
            , sales.description 
            , sales.sale_date
            , sales.sale_price
            , sales.customer
        FROM
            stvno.sales
            INNER JOIN stvno.inventory 
                ON (sales.inventory_id = inventory.id)
        WHERE inventory.location_id = ? AND  inventory.product_id = ?
        ORDER BY sales.sale_date DESC
      `,
      [recordId, productId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching purchase records:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
