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
  
    const [rows] = await pool.query("SELECT * FROM products Where LOWER(product_details) Like ? OR LOWER(product_code) Like ? OR LOWER(product_category) Like ?  ORDER BY Id DESC limit 20",[
      `%${searchKey}%`,`%${searchKey}%`,`%${searchKey}%`
    ]);

    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Add a new product
// const addProduct = async (req, res) => {
//   try {
//     const { name, price, stock } = req.body;
//     if (!name || !price || !stock) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const [result] = await pool.query("INSERT INTO products (name, price, stock) VALUES (?, ?, ?)", 
//       [name, price, stock]);

//     return res.status(201).json({ id: result.insertId, name, price, stock });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

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

    console.log({
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
    const { id, name, price, stock } = req.body;
    if (!id || !name || !price || !stock) {
      return res.status(400).json({ message: "Missing fields" });
    }

    await pool.query("UPDATE products SET name=?, price=?, stock=? WHERE id=?", 
      [name, price, stock, id]);

    return res.status(200).json({ id, name, price, stock });
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
