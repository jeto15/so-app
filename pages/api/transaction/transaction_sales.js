import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await handleInventoryTransaction(req, res);
    default:
      return res.status(405).end();
  }
}

const handleInventoryTransaction = async (req, res) => {
  const { transaction, lines } = req.body;

  /*
  Example req.body:
  {
    transaction: {
      transaction_type: 'Sale',
      location_id: 1,
      description: 'Customer Order #1234',
      customername: 'John Doe',
    },
    lines: [
      { productId: 10, quantity: 2, sale_price: 15.5 },
      { productId: 11, quantity: 1, sale_price: 10 }
    ]
  }
  */

  if (
    !transaction ||
    !transaction.transaction_type ||
    !transaction.location_id ||
    !Array.isArray(lines) ||
    lines.length === 0
  ) {
    return res.status(400).json({ error: "Invalid transaction or lines data." });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Insert header and get header id
    const [headerResult] = await conn.execute(
      `INSERT INTO inventory_transaction_headers
       (transaction_type, location_id, transaction_date, description, customer_name)
       VALUES (?, ?, NOW(), ?, ?)`,
      [
        transaction.transaction_type,
        transaction.location_id,
        transaction.description || null,
        transaction.customername || null,
      ]
    );

    const transactionHeaderId = headerResult.insertId;

    // 2. Process each line
    for (const line of lines) {
      const { productId, quantity, sale_price } = line;

      if (!productId || !quantity) {
        throw new Error("Missing productId or quantity in line.");
      }

      // Lock inventory record for update
      const [rows] = await conn.execute(
        `SELECT quantity FROM inventory WHERE product_id = ? AND location_id = ? FOR UPDATE`,
        [productId, transaction.location_id]
      );

      if (rows.length === 0) {
        throw new Error(`Inventory record not found for product ${productId} at location ${transaction.location_id}`);
      }

      const existingQuantity = rows[0].quantity;

      // Signed quantity based on transaction type
      const signedQuantity =
        transaction.transaction_type === "Sale" ? -Math.abs(quantity) : Math.abs(quantity);

      const newQuantity = existingQuantity + signedQuantity;

      if (newQuantity < 0) {
        throw new Error(
          `Insufficient stock for product ${productId} at location ${transaction.location_id}. Available: ${existingQuantity}, Required: ${Math.abs(signedQuantity)}`
        );
      }

      // Update inventory quantity
      await conn.execute(
        `UPDATE inventory SET quantity = ? WHERE product_id = ? AND location_id = ?`,
        [newQuantity, productId, transaction.location_id]
      );

      // Insert into transaction lines table
      await conn.execute(
        `INSERT INTO inventory_transaction_lines
         (transaction_header_id, product_id, quantity, unit_price)
         VALUES (?, ?, ?, ?)`,
        [transactionHeaderId, productId, signedQuantity, sale_price || 0]
      );
    }

    await conn.commit();
    res.status(200).json({ message: "Transaction recorded successfully." });
  } catch (err) {
    await conn.rollback();
    console.error("Transaction error:", err);
    res.status(500).json({ error: "Transaction failed: " + err.message });
  } finally {
    await conn.release();
  }
};
