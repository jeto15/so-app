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

    const [purchases] = await pool.query(
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
          suppliers.contact_info,
          products.product_details,
          products.product_code,
          locations.name as location_name
        FROM stvno.purchases
          LEFT JOIN stvno.suppliers 
            ON purchases.supplier_id = suppliers.id
          INNER JOIN stvno.inventory 
            ON purchases.inventory_id = inventory.id
          LEFT JOIN stvno.products 
            ON purchases.product_id = products.Id
          LEFT JOIN stvno.locations 
            ON inventory.location_id = locations.Id
        WHERE  purchases.purchase_date BETWEEN ? AND ?
        ORDER BY purchases.purchase_date DESC 
      `,
      [ fromDate, toDate]
    ); 

    const [sales] = await pool.query(
      `
        SELECT
          sales.inventory_id,
          inventory.product_id,
          inventory.location_id,
          sales.id as saleId,
          sales.quantity,
          sales.description,
          sales.sale_date,
          sales.sale_price,
          sales.customer, 
          products.product_details,
          products.product_code, 
          locations.name as location_name
        FROM stvno.sales
          LEFT JOIN stvno.inventory 
            ON (sales.inventory_id = inventory.id)
          LEFT JOIN stvno.products 
            ON (sales.product_id = products.Id)
          LEFT JOIN stvno.locations 
            ON inventory.location_id = locations.Id
        WHERE  sales.sale_date BETWEEN ? AND ?
        ORDER BY sales.sale_date DESC
      `,
      [fromDate, toDate]
    );

    res.status(200).json({
      sales,
      purchases,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
