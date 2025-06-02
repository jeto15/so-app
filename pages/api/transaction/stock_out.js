import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      return await handleStockOutTransaction(req, res);
    default:
      return res.status(405).end();
  }
}

const handleStockOutTransaction = async (req, res) => {
  const { transaction, lines } = req.body;

  /*
  Example req.body:
  {
    transaction: {
      transaction_type: 'Stock Out',
      location_id: 1,
      description: 'Damaged goods removal',
      customername: null
    },
    lines: [
      { productId: 10, quantity: 2 },
      { productId: 11, quantity: 1 }
    ]
  }
  */

  if (
    !transaction ||
    transaction.transaction_type !== "Stock Out" ||
    !transaction.location_id ||
    !Array.isArray(lines) ||
    lines.length === 0
  ) {
    return res.status(400).json({ error: "Invalid transaction or lines data." });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Insert transaction header
    const [headerResult] = await conn.execute(
      `
      INSERT INTO inventory_transaction_headers
      (transaction_type, location_id, transaction_date, description, customer_name)
      VALUES (?, ?, NOW(), ?, ?)
      `,
      [
        transaction.transaction_type,
        transaction.location_id,
        transaction.description || null,
        transaction.customername || null,
      ]
    );

    const transactionHeaderId = headerResult.insertId;

    // Loop through all lines
    for (const line of lines) {
      const { productId, quantity } = line;

      if (!productId || !quantity) {
        throw new Error("Missing productId or quantity in line.");
      }

      const [rows] = await conn.execute(
        `SELECT quantity FROM inventory WHERE product_id = ? AND location_id = ? FOR UPDATE`,
        [productId, transaction.location_id]
      );

      if (rows.length === 0) {
        throw new Error(
          `Inventory record not found for product ${productId} at location ${transaction.location_id}`
        );
      }

      const existingQuantity = rows[0].quantity;
      const signedQuantity = -Math.abs(quantity);
      const newQuantity = existingQuantity + signedQuantity;

      if (newQuantity < 0) {
        throw new Error(
          `Insufficient stock for product ${productId} at location ${transaction.location_id}. Available: ${existingQuantity}, Required: ${quantity}`
        );
      }

      await conn.execute(
        `UPDATE inventory SET quantity = ? WHERE product_id = ? AND location_id = ?`,
        [newQuantity, productId, transaction.location_id]
      );

      await conn.execute(
        `
        INSERT INTO inventory_transaction_lines
        (transaction_header_id, product_id, quantity, unit_price)
        VALUES (?, ?, ?, ?)
        `,
        [transactionHeaderId, productId, signedQuantity, 0] // unit_price = 0 for Stock Out
      );
    }

    await conn.commit();
    res.status(200).json({ message: "Stock Out transaction recorded successfully." });
  } catch (err) {
    await conn.rollback();
    console.error("Stock Out transaction error:", err);
    res.status(500).json({ error: "Stock Out transaction failed: " + err.message });
  } finally {
    await conn.release();
  }
};
