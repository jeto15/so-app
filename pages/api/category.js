import pool from "@/lib/db";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      return await getCategory(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
}

// Get all products
const getCategory = async (req, res) => {
    const { keyword = '' } = req.query;

    if (!keyword.trim()) {
      return res.status(200).json([]);
    }

    console.log(keyword);
  
    try {
      const search = `%${keyword.toLowerCase()}%`;
      const [rows] = await pool.query(
        `
          SELECT DISTINCT  product_category AS category
          FROM products
          WHERE LOWER(product_category) LIKE ?
          ORDER BY category ASC
          LIMIT 10 
        `, 
        [search]
      );
  
      const categories = rows.map((row) => row.category);
 
      return res.status(200).json(categories);
    } catch (error) {
      console.error('Category fetch error:', error);
      return res.status(500).json({ error: 'Server error' });
    } 
};
 
 
// const addProduct = async (req, res) => {
//   try {
//     const {
//       productName,
//       productCode,  
//       productCategory,  // Fixed typo
//       srpPrice,         // This should be the product_price
//       cptPrice, 
//       wlprice
//     } = req.body; 
 

//     const category = productCategory?.trim() || "Uncategorized";
  
//     const srp = parseFloat(srpPrice) || 0;
//     const cpt = parseFloat(cptPrice) || 0;
//     const wl = parseFloat(wlprice) || 0;


//     // if ( category == ""  ) {
//     //   return res.status(400).json({ message: "Missing fields" });
//     // }

//     // const category = productCategory?.trim() || "Uncategorized";

//     const [result] = await pool.query(
//       "INSERT INTO products (product_details, product_code, product_price, product_cpt_price, product_ws_price, product_category) VALUES (?, ?, ?, ?, ?, ?)", 
//       [productName, productCode, srp, cpt, wl, category] // Ensure the order matches
//     );

//     return res.status(201).json({ 
//       id: result.insertId, 
//       productName,  
//       productCode,  
//       productCategory, // Fixed typo
//       srpPrice, 
//       cptPrice,   
//       wlprice 
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };


// Update a product
// const updateProduct = async (req, res) => {
//   try {
//     const {
//       Id,
//       productName,
//       productCode,  
//       productCategory,  // Fixed typo
//       srpPrice,         // This should be the product_price
//       cptPrice, 
//       wlprice
//     } = req.body;

//     console.log({
//       Id,
//       productName,
//       productCode,  
//       productCategory,  // Fixed typo
//       srpPrice,         // This should be the product_price
//       cptPrice, 
//       wlprice
//     });

//     const category = productCategory?.trim() || "Uncategorized";
  
//     const srp = parseFloat(srpPrice) || 0;
//     const cpt = parseFloat(cptPrice) || 0;
//     const wl = parseFloat(wlprice) || 0;
 
//     const [result] = await pool.query(
//       "UPDATE products SET product_details=?, product_code=?, product_price=?, product_cpt_price=?, product_ws_price=?, product_category=? WHERE id=?", 
//       [productName, productCode, srp, cpt, wl, category, Id] // Ensure the order matches
//     );
   
//     return res.status(201).json({ 
//       id: result.insertId, 
//       productName,  
//       productCode,  
//       productCategory, // Fixed typo
//       srpPrice, 
//       cptPrice,   
//       wlprice 
//     }); 
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// Delete a product
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.body;
//     if (!id) {
//       return res.status(400).json({ message: "Missing product ID" });
//     }

//     await pool.query("DELETE FROM products WHERE id=?", [id]);
//     return res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };
