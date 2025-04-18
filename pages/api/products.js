import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getProducts(req, res);
    case "POST":
      return await addProduct(req, res);
    case "PUT":
      return await updateProduct(req, res);
    case "DELETE":
      return await deleteProduct(req, res);
    default:
      return res.status(405).end(); // Method Not Allowed
  }
}

// Get all products
const getProducts = async (req, res) => {
  try { 

    const { searchKey = ""} = req.query;
    let rows;

    if (searchKey.trim() === '') {
      [rows] = await pool.query(
        'SELECT * FROM products ORDER BY Id DESC LIMIT 20'
      );
    } else {
      const search = `%${searchKey.toLowerCase()}%`;
      [rows] = await pool.query(
        `SELECT * FROM products 
         WHERE LOWER(product_details) LIKE ? 
           OR LOWER(product_code) LIKE ? 
           OR LOWER(product_category) LIKE ? 
         ORDER BY Id DESC LIMIT 20`,
        [search, search, search]
      );
    }
 
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
 
 
const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productCode,  
      productCategory,  // Fixed typo
      srpPrice,         // This should be the product_price
      cptPrice, 
      wlprice
    } = req.body; 
 

    const category = productCategory?.trim() || "Uncategorized";
  
    const srp = parseFloat(srpPrice) || 0;
    const cpt = parseFloat(cptPrice) || 0;
    const wl = parseFloat(wlprice) || 0;


    // if ( category == ""  ) {
    //   return res.status(400).json({ message: "Missing fields" });
    // }

    // const category = productCategory?.trim() || "Uncategorized";

    const [result] = await pool.query(
      "INSERT INTO products (product_details, product_code, product_price, product_cpt_price, product_ws_price, product_category) VALUES (?, ?, ?, ?, ?, ?)", 
      [productName, productCode, srp, cpt, wl, category] // Ensure the order matches
    );

    return res.status(201).json({ 
      id: result.insertId, 
      productName,  
      productCode,  
      productCategory, // Fixed typo
      srpPrice, 
      cptPrice,   
      wlprice 
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Update a product
const updateProduct = async (req, res) => {
  try {
    const {
      Id,
      productName,
      productCode,  
      productCategory,  // Fixed typo
      srpPrice,         // This should be the product_price
      cptPrice, 
      wlprice
    } = req.body;

    console.log({
      Id,
      productName,
      productCode,  
      productCategory,  // Fixed typo
      srpPrice,         // This should be the product_price
      cptPrice, 
      wlprice
    });

    const category = productCategory?.trim() || "Uncategorized";
  
    const srp = parseFloat(srpPrice) || 0;
    const cpt = parseFloat(cptPrice) || 0;
    const wl = parseFloat(wlprice) || 0;
 
    const [result] = await pool.query(
      "UPDATE products SET product_details=?, product_code=?, product_price=?, product_cpt_price=?, product_ws_price=?, product_category=? WHERE id=?", 
      [productName, productCode, srp, cpt, wl, category, Id] // Ensure the order matches
    );
   
    return res.status(201).json({ 
      id: result.insertId, 
      productName,  
      productCode,  
      productCategory, // Fixed typo
      srpPrice, 
      cptPrice,   
      wlprice 
    }); 
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Missing product ID" });
    }

    await pool.query("DELETE FROM products WHERE id=?", [id]);
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
