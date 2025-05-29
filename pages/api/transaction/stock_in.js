import pool from '@/lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return handleInventoryStockIn(req, res);
    default:
      return res.status(405).end();
  }
}

const handleInventoryStockIn = async (req, res) => {
  const { transaction, lines } = req.body;

  /*
  Example req.body:
  {
    transaction: {
      transaction_type: 'Stock In',
      location_id: 1,
      description: 'Manual stock entry',
    },
    lines: [
      { productId: 10, quantity: 5 },
      { productId: 15, quantity: 3 }
    ]
  }
  */

  if (
    !transaction ||
    transaction.transaction_type !== 'Stock In' ||
    !transaction.location_id ||
    !Array.isArray(lines) ||
    lines.length === 0
  ) {
    return res.status(400).json({ error: 'Invalid transaction or lines data.' });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Insert header
    const [headerResult] = await conn.execute(
      `
        INSERT INTO inventory_transaction_headers
        (transaction_type, location_id, transaction_date, description)
        VALUES (?, ?, NOW(), ?)
      `,
      [
        transaction.transaction_type,
        transaction.location_id,
        transaction.description || null,
      ]
    );

    const transactionHeaderId = headerResult.insertId;

    for (const line of lines) {
      const { productId, quantity } = line;

      if (!productId || !quantity) {
        throw new Error('Missing productId or quantity in line.');
      }

      // Lock row
      const [rows] = await conn.execute(
        `
          SELECT quantity FROM inventory
          WHERE product_id = ? AND location_id = ? FOR UPDATE
        `,
        [productId, transaction.location_id]
      );

      if (rows.length > 0) {
        const newQuantity = rows[0].quantity + quantity;

        await conn.execute(
          `
            UPDATE inventory
            SET quantity = ?
            WHERE product_id = ? AND location_id = ?
          `,
          [newQuantity, productId, transaction.location_id]
        );
      } else {
        await conn.execute(
          `
            INSERT INTO inventory (product_id, location_id, quantity)
            VALUES (?, ?, ?)
          `,
          [productId, transaction.location_id, quantity]
        );
      }

      await conn.execute(
        `
          INSERT INTO inventory_transaction_lines
          (transaction_header_id, product_id, quantity, unit_price)
          VALUES (?, ?, ?, ?)
        `,
        [transactionHeaderId, productId, quantity, 0] // unit_price = 0 for Stock In
      );
    }

    await conn.commit();
    return res.status(200).json({ message: 'Stock In transaction recorded successfully.' });
  } catch (err) {
    await conn.rollback();
    console.error('Stock In transaction error:', err);
    return res.status(500).json({ error: `Stock In transaction failed: ${err.message}` });
  } finally {
    await conn.release();
  }
};
