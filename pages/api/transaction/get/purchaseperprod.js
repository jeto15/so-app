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
      `
        SELECT
          purchases.id AS purchaseId,
          inventory.product_id,
          purchases.inventory_id, 
          inventory.location_id,
          purchases.supplier_id,
          suppliers.name AS supplierName,
          purchases.description,
          purchases.quantity,
          purchases.unit_cost,
          purchases.purchase_date,
          suppliers.contact_info
        FROM stvno.purchases
        LEFT JOIN stvno.suppliers ON purchases.supplier_id = suppliers.id
        INNER JOIN stvno.inventory ON purchases.inventory_id = inventory.id
        WHERE inventory.location_id = ? AND  inventory.product_id = ?
        ORDER BY  purchases.purchase_date DESC
      `,
      [recordId, productId]
    );

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching purchase records:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
