import pool from "@/lib/db";

 

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getLocations(req, res); 
    case "POST":
      return await addLocations(req, res); 
    case "PUT":
      return await updateLocation(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
} 

// Get all Locations
const getLocations = async (req, res) => {
  
    try { 
      const [rows] = await pool.query(
        `
          SELECT id, name, address
          FROM locations   
        ` 
      );
  
      return res.status(200).json(rows); 
    } catch (error) {
      console.error('Category fetch error:', error);
      return res.status(500).json({ error: 'Server error' });
    } 
};


//Add a Location
const addLocations = async (req, res) => {
  try {
    const {
      name,
      address,   
    } = req.body; 
   
    if ( name == ""  ) {
      return res.status(400).json({ message: "Missing fields Name" });
    }

    const [prodRows] = await pool.query(
      `
        SELECT Id, product_details
        FROM products   
      ` 
    );  
    const productRows = prodRows; 

    const [result] = await pool.query(
      "INSERT INTO locations (name, address) VALUES (?, ?)", 
      [name, address ] // Ensure the order matches
    ); 

    const values = productRows.map((item) => [item.Id, result.insertId, 0, 0  ]); 
    await pool.query(
      "INSERT INTO  inventory (product_id, location_id, quantity, reorder_level) VALUES ?",
      [values] // Note: passed as a nested array
    );  
   
    return res.status(201).json({ 
      id: result.insertId,  
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } 
};
 
// Update a Location
const updateLocation = async (req, res) => {
  try {
    const {
      Id,
      name,
      address,   
    } = req.body; 
 
    if ( name == ""  ) {
      return res.status(400).json({ message: "Missing fields Name" });
    }
    
    const [result] = await pool.query(
      "UPDATE locations SET name=?, address=? WHERE id=?", 
      [name, address, Id] // Ensure the order matches
    );
   
    return res.status(201).json({ 
      id: result.insertId
    }); 
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};