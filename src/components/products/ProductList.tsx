"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";

import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button"; 
import Label from "../form/Label";
 
 
// Define the TypeScript interface for the table rows
interface Product {
  id: number; // Unique identifier for each product
  name: string; // Product name
  variants: string; // Number of variants (e.g., "1 Variant", "2 Variants")
  category: string; // Category of the product
  price: string; // Price of the product (as a string with currency symbol)
  // status: string; // Status of the product
  image: string; // URL or path to the product image
  status: "Delivered" | "Pending" | "Canceled"; // Status of the product
}

// Define the table data using the interface
const tableData: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    variants: "2 Variants",
    category: "Laptop",
    price: "$2399.00",
    status: "Delivered",
    image: "/images/product/product-01.jpg", // Replace with actual image URL
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    variants: "1 Variant",
    category: "Watch",
    price: "$879.00",
    status: "Pending",
    image: "/images/product/product-02.jpg", // Replace with actual image URL
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    variants: "2 Variants",
    category: "SmartPhone",
    price: "$1869.00",
    status: "Delivered",
    image: "/images/product/product-03.jpg", // Replace with actual image URL
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    variants: "2 Variants",
    category: "Electronics",
    price: "$1699.00",
    status: "Canceled",
    image: "/images/product/product-04.jpg", // Replace with actual image URL
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    variants: "1 Variant",
    category: "Accessories",
    price: "$240.00",
    status: "Delivered",
    image: "/images/product/product-05.jpg", // Replace with actual image URL
  },
];

export default function ProductList(  ) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [query, setQuery] = useState("");

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };

  const fetchProducts = async ( searchKey = "" ) => {
      try {
        console.log('searchKeysearchKey',searchKey);
        const response = await axios.get("/api/products",{ params: { searchKey  }});
        //console.log(response.data);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
  };
  useEffect(() => {
  
    fetchProducts( );
  }, []);

  const filteredProducts = products;


   // Function to handle voice input
  const handleVoiceSearch = () => {

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    recognition.lang = "en-US"; // Set language
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log(transcript);
      //onSearch(transcript);
      setQuery(transcript);
      //onSearch(transcript); // Pass the recognized text to the search function
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };
  };

  const handleSearchProduct = (keyword) => { 
    fetchProducts( keyword.target.value );
  } 
  
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">

    

          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Search here      
          </h3>
 
        </div>

        <div className="flex items-center gap-3">
  
          <button  onClick={openModal} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Add New
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="d-flex">
          <Input  type="text"  placeholder="Search products..."  className="form-control mb-3 "  value={search}  onChange={handleSearchProduct} />

       {/* <Input  type="text"
            placeholder="Search products..."
            className="form-control mb-3 "
            value={search}
            onChange={(e) => setSearch(e.target.value)} /> */}

        </div>    
        {/*<div className="d-flex">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={query}  
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary ms-2" onClick={handleVoiceSearch}>
              🎤
            </button>
        </div>*/} 
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell> 
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Action
              </TableCell> 
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
        
            
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (

                <TableRow key={product.Id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.product_code}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.product_details}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.product_category}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.product_price}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 
                  <button>Edit</button>
                </TableCell>
              </TableRow>

              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No products found
                </td>
              </tr>
            )}

          </TableBody>
        </Table>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input type="text" defaultValue="United States" />
                </div>

                <div>
                  <Label>City/State</Label>
                  <Input type="text" defaultValue="Arizona, United States." />
                </div>

                <div>
                  <Label>Postal Code</Label>
                  <Input type="text" defaultValue="ERT 2489" />
                </div>

                <div>
                  <Label>TAX ID</Label>
                  <Input type="text" defaultValue="AS4568384" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
    
  );
}
