import pool from "@/lib/db";
import { stringify } from "node:querystring";

export default async function handler(req, res) {
  switch (req.method) { 
    case "POST":
      return await addStocks(req, res); 
    default:
      return res.status(405).end(); // Method Not Allowed
  }
}

 
 
const addStocks = async (req, res) => {
  try {
    
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    } 
     
    console.log('items', stringify.json(items)); 
 
    // const [result] = await pool.query(
    //   "INSERT INTO products (product_details, product_code, product_price, product_cpt_price, product_ws_price, product_category) VALUES (?, ?, ?, ?, ?, ?)", 
    //   [productName, productCode, srp, cpt, wl, category] // Ensure the order matches
    // );

    return res.status(201).json({ 
      id: '123'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


 