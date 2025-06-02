import pool from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return getTransactionRecords(req, res);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}

const getTransactionRecords = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query; 

    if (!fromDate || !toDate) {
      return res.status(400).json({ message: 'fromDate and toDate are required' });
    } 

    console.log(fromDate, toDate);

    const [transactions] = await pool.query(
      `
        SELECT
            inventory_transaction_headers.id
            , inventory_transaction_headers.transaction_type
            , inventory_transaction_headers.location_id
            , inventory_transaction_headers.transaction_date
            , inventory_transaction_headers.description
            , inventory_transaction_headers.customer_name
            , inventory_transaction_headers.supplier_id
            , locations.name as location_name
            , locations.address
        FROM
            stvno.inventory_transaction_headers
            LEFT JOIN stvno.suppliers 
                ON (inventory_transaction_headers.supplier_id = suppliers.id)
            INNER JOIN stvno.locations 
                ON (inventory_transaction_headers.location_id = locations.id)
        WHERE  inventory_transaction_headers.transaction_date BETWEEN ? AND ?
        ORDER BY inventory_transaction_headers.transaction_date DESC 
      `,
      [ fromDate, toDate]
    ); 
 

    res.status(200).json({
      transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
