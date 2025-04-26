import pool from "@/lib/db"; 

export default async function handler(req, res) {
  switch (req.method) { 
    case "POST":
      return await handlSale(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
} 

const handlSale = async (req, res) => {

    const sales = req.body; // List of sales, same format as provided JSON

    console.log(sales);
    if (!Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty sales list.' });
    }

    // Get a connection from the pool
    const conn = await pool.getConnection();

    try {
        // Begin the transaction using the connection
        await conn.beginTransaction();

        for (const sale of sales) {
            const { 
              quantity,
              location_id,
              productId,
              description,
              InventoryID,   
              customername
            } = sale;
      
            if (!productId || !location_id || !quantity) {
              throw new Error('Missing required fields for one or more sales.');
            }
      
            // Lock the inventory row for the product+location combination
            const [rows] = await conn.execute(
              `SELECT quantity FROM inventory WHERE product_id = ? AND location_id = ? FOR UPDATE`,
              [productId, location_id]
            );
      
            if (rows.length > 0) {
              const existingQuantity = rows[0].quantity;

              // Check if sufficient quantity is available
              if (existingQuantity < quantity) {
                throw new Error(`Not enough stock. Available: ${existingQuantity}, Requested: ${quantity}`);
              }

              const newQuantity = existingQuantity - quantity;
      
              // Update the inventory quantity after the sale
              await conn.execute(
                `UPDATE inventory SET quantity = ? WHERE product_id = ? AND location_id = ?`,
                [newQuantity, productId, location_id]
              );
            } else {
              throw new Error('inventory record not found for product or location.');
            }
      
            // Insert the sale record into the Sales table
            await conn.execute(
              `INSERT INTO sales (product_id, inventory_id, quantity, description, customer) VALUES (?, ?, ?, ?,?)` ,
              [productId, InventoryID, quantity, description, customername]
            );
          } 
      
          // Commit the transaction
          await conn.commit();
          res.status(200).json({ message: 'Sales recorded and inventory updated.' });
        
    } catch (err) { 
        // If an error occurs, rollback the transaction to ensure no partial updates
        await conn.rollback();
        console.error('Sale Error:', err);
        res.status(500).json({ error: 'Something went wrong. ' + err.message });
    } finally {
        // Always release the connection back to the pool
        await conn.release();
    }
};
