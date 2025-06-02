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
            inventory_transaction_headers.transaction_type
            , inventory_transaction_headers.location_id
            , inventory_transaction_headers.transaction_date
            , inventory_transaction_headers.description
            , inventory_transaction_headers.customer_name
            , inventory_transaction_headers.supplier_id
            , inventory_transaction_lines.transaction_header_id
            , inventory_transaction_lines.id
            , inventory_transaction_lines.product_id
            , inventory_transaction_lines.quantity
            , inventory_transaction_lines.unit_price
            , suppliers.name AS supplier_name
        FROM
            stvno.inventory_transaction_lines
            INNER JOIN stvno.inventory_transaction_headers 
                ON (inventory_transaction_lines.transaction_header_id = inventory_transaction_headers.id)
            LEFT JOIN stvno.suppliers 
                ON (inventory_transaction_headers.supplier_id = suppliers.id)
        WHERE 
            inventory_transaction_headers.location_id = ? AND inventory_transaction_lines.product_id = ?;
      `,
      [recordId, productId]
    ); 

//     SELECT
//     inventory_transaction_headers.transaction_type
//     , inventory_transaction_headers.location_id
//     , inventory_transaction_headers.transaction_date
//     , inventory_transaction_headers.description
//     , inventory_transaction_headers.customer_name
//     , inventory_transaction_headers.supplier_id
//     , inventory_transaction_lines.transaction_header_id
//     , inventory_transaction_lines.id
//     , inventory_transaction_lines.product_id
//     , inventory_transaction_lines.quantity
//     , inventory_transaction_lines.unit_price
//     , suppliers.name
//     , products.product_details
//     , products.product_code
//     , products.product_price
//     , products.product_cpt_price
//     , products.product_ws_price
//     , products.product_category
//     , products.created_at
// FROM
//     stvno.inventory_transaction_lines
//     INNER JOIN stvno.inventory_transaction_headers 
//         ON (inventory_transaction_lines.transaction_header_id = inventory_transaction_headers.id)
//     LEFT JOIN stvno.suppliers 
//         ON (inventory_transaction_headers.supplier_id = suppliers.id)
//     LEFT JOIN stvno.products 
//         ON (inventory_transaction_lines.product_id = products.Id);

    return res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching purchase records:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
