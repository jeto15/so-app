import pool from '@/lib/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      return handleInventoryPurchase(req, res);
    default:
      return res.status(405).end();
  }
}

const handleInventoryPurchase = async (req, res) => {
  const { transaction, lines } = req.body;

  /*
  Example req.body:
  {
    transaction: {
      transaction_type: 'Purchase',
      location_id: 1,
      description: 'Supplier delivery #5678',
      supplier_id: 123
    },
    lines: [
      { productId: 10, quantity: 5, sale_price: 12.0 },
      { productId: 15, quantity: 3, sale_price: 8.5 }
    ]
  }
  */

  if (
    !transaction ||
    transaction.transaction_type !== 'Purchase' ||
    !transaction.location_id ||
    !Array.isArray(lines) ||
    lines.length === 0
  ) {
    return res.status(400).json({ error: 'Invalid transaction or lines data.' });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Insert header and get header ID
    const [headerResult] = await conn.execute(
      `
        INSERT INTO inventory_transaction_headers
        (transaction_type, location_id, transaction_date, description, supplier_id)
        VALUES (?, ?, NOW(), ?, ?)
      `,
      [
        transaction.transaction_type,
        transaction.location_id,
        transaction.description || null,
        transaction.supplier_id || null,
      ]
    );

    const transactionHeaderId = headerResult.insertId;

    // Process each line
    for (const line of lines) {
      const { productId, quantity, sale_price } = line;

      if (!productId || !quantity) {
        throw new Error('Missing productId or quantity in line.');
      }

      // Lock inventory record for update
      const [rows] = await conn.execute(
        `
          SELECT quantity FROM inventory
          WHERE product_id = ? AND location_id = ? FOR UPDATE
        `,
        [productId, transaction.location_id]
      );

      if (rows.length > 0) {
        const existingQuantity = rows[0].quantity;
        const newQuantity = existingQuantity + quantity;

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
        [transactionHeaderId, productId, quantity, sale_price || 0]
      );
    }

    await conn.commit();
    return res.status(200).json({ message: 'Purchase transaction recorded successfully.' });
  } catch (err) {
    await conn.rollback();
    console.error('Purchase transaction error:', err); // Consider removing in production
    return res.status(500).json({ error: `Purchase transaction failed: ${err.message}` });
  } finally {
    await conn.release();
  }
};
