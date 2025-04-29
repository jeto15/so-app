import pool from "@/lib/db"; 

export default async function handler(req, res) {
  switch (req.method) { 
    case "POST":
      return await handlPurchase(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
} 

const handlPurchase = async (req, res) => {

    const purchases = req.body; // List of purchases, same format as provided JSON
 
    if (!Array.isArray(purchases) || purchases.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty purchases list.' });
    } 

    // Get a connection from the pool
    const conn = await pool.getConnection();

    try {
        // Begin the transaction using the connection
        await conn.beginTransaction();

        for (const purchase of purchases) {
            const {             // Optional field, not used here
              quantity,
              location_id,
              productId,
              description, 
              supplierId,          // Optional, can be used for notes or logging4
              sale_price,
              InventoryID
            } = purchase;
      
            if (!productId || !location_id || !quantity) {
              throw new Error('Missing required fields for one or more purchases.');
            }
      
            // Lock the inventory row for the product+location combination
            const [rows] = await conn.execute(
              `SELECT quantity FROM inventory WHERE product_id = ? AND location_id = ? FOR UPDATE`,
              [productId, location_id]
            );
      
            if (rows.length > 0) {
              // Inventory exists, update by adding the purchased quantity
              const existingQuantity = rows[0].quantity;
              const newQuantity = existingQuantity + quantity;
      
              // Update the inventory quantity
              await conn.execute(
                `UPDATE inventory SET quantity = ? WHERE product_id = ? AND location_id = ?`,
                [newQuantity, productId, location_id]
              );
            } else {
              // No inventory exists for this product/location, insert a new record
              await conn.execute(
                `INSERT INTO inventory (product_id, location_id, quantity) VALUES (?, ?, ?)` ,
                [productId, location_id, quantity]
              );
            }
      
            // Insert the purchase record into the Purchase table
         
            if( !supplierId ) {
              console.log('Is Stockin '); 
              await conn.execute(
                `INSERT INTO purchases (product_id, inventory_id, quantity, description) VALUES (?, ?, ?, ?)` ,
                [productId, InventoryID, quantity, description]
              ); 
            } else {
              
              console.log('Sell '); 
              await conn.execute(
                `INSERT INTO purchases (product_id, inventory_id, quantity, description, supplier_id,unit_cost) VALUES (?, ?, ?, ?, ?, ?)` ,
                [productId, InventoryID, quantity, description, supplierId, sale_price]
              ); 
            }
              
        
          } 


          // Commit the transaction
          await conn.commit();
          res.status(200).json({ message: 'Purchases recorded and inventory updated.' });
        
    } catch (err) { 
        // If an error occurs, rollback the transaction to ensure no partial updates
        await conn.rollback();
        console.error('Purchase Error:', err);
        res.status(500).json({ error: 'Something went wrong. ' + err.message });
    } finally {
        // Always release the connection back to the pool
        await conn.release();
    }
};
