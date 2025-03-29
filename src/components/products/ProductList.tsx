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

import { BoxIcon, PencilIcon,TrashBinIcon } from "@/icons";
import Button from "../ui/button/Button"; 
import Label from "../form/Label";
 
export default function ProductList(  ) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const { isOpen, openModal, closeModal } = useModal();
  const [query, setQuery] = useState("");
  const [searchVoice, setSearchVoice] = useState("");
  const [labelProdisCreate,setLabelProdisCreate]  = useState("");

  const [newProduct, setNewProduct] = useState(
    { 
      productName: '',
      productCode: '', 
      productCategory: '',
      cptPrice: 0,
      wlprice: 0,
      srpPrice:0
    }
  );
  
  const [prodDetails, setProdDetails] = useState(
    { 
      productName: '',
      productCode: '', 
      productCategory: '',
      cptPrice: 0,
      wlprice: 0,
      srpPrice:0
    }
  );
    
  const filteredProducts = products;

  useEffect(() => {
    fetchProducts( );
  }, []); 

  const openFormModal = ()=> {
    openModal();
    setLabelProdisCreate('Enter New');
    const prodItems = { 
      productName: '',
      productCode: '', 
      productCategory: '',
      cptPrice: 0,
      wlprice: 0,
      srpPrice:0
    };

    setProdDetails(prodItems);  
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log('newProduct', newProduct);
      await axios.post('/api/products', newProduct); 
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error('Error adding product:', error);
     // setError('Failed to add product. Please try again.');
    }
  };

  const fetchProducts = async ( searchKey = "" ) => {
      try { 

        const response = await axios.get("/api/products",{ params: { searchKey  }});
        //console.log(response.data);
        setProducts(response.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
  };
 
  const handleVoiceSearch = () => {

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    recognition.lang = "en-US"; // Set language
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchVoice(transcript);
      fetchProducts( transcript.toLowerCase().replace(/\./g, "") );
      
      //onSearch(transcript); // Pass the recognized text to the search function
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };
  };

  const handleSearchProduct = (keyword) => {  
    fetchProducts( keyword.target.value.toLowerCase() );
  } 

 
  const getProduct =  (id) => {
    try {
      openModal();
      setLabelProdisCreate('Update');
      const ProdID = id; 
      const result = filteredProducts.filter(product => product.Id ===  ProdID);
      
      const prodItems = { 
        productName: result[0].product_details,
        productCode: result[0].product_code, 
        productCategory: result[0].product_category,
        cptPrice: result[0].product_cpt_price,
        wlprice: result[0].product_ws_price,
        srpPrice:result[0].product_price
      };
 
      setProdDetails(prodItems);  
    } catch (error) {
      console.error('Error deleting product:', error); 
    }
  };

  

  
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Search here  {searchVoice}
          </h3>
          <Button size="sm" variant="outline" onClick={handleVoiceSearch}>
            🎤 Speak to Search
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <button  onClick={openFormModal} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Add New Product
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="d-flex">
          <Input 
            type="text"  
            placeholder="Search products..."  
            className="form-control mb-3 "  
            value={search}  
            onChange={handleSearchProduct} 
          />
        </div>    
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
                Category
              </TableCell>
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
                Wholesale Price
              </TableCell> 
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Capital Price
              </TableCell> 
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                SRP Price
              </TableCell> 
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-min"
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
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {product.product_category}
                </TableCell>
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
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {product.product_ws_price}
                  </p> 
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {product.product_cpt_price}
                  </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {product.product_price}
                  </p>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 

                  <div className="flex gap-5">
                    <Button size="sm" variant="primary" endIcon={<PencilIcon />}  onClick={() => getProduct(product.Id)}  >
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" endIcon={<TrashBinIcon />}>
                      Remove
                    </Button>
                  </div>

                  
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
              {labelProdisCreate} Product
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Log new items and store product details along with prices.
            </p>
          </div>
          <form onSubmit={handleSave} className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
             <div className="py-2 grid grid-cols-1 gap-x-6 gap-y-5 ">
                  <div>
                    <Label>Product Category</Label>
                    <Input 
                      type="text"  
                      value={newProduct.productCategory}
                      onChange={(e) => setNewProduct({ ...newProduct, productCategory: e.target.value })}
                      defaultValue={prodDetails.productCategory}
                     />
                  </div>
             </div>
             <div className="py-2 grid grid-cols-1 gap-x-6 gap-y-5 ">
                  <div>
                    <Label>Product Code</Label>
                    <Input 
                      type="text"  
                      value={newProduct.productCode}
                      onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value })}
                      defaultValue={prodDetails.productCode}
                      />
                  </div>
              </div>
              <div className="py-2 grid grid-cols-1 gap-x-6 gap-y-5 ">
                  <div>
                    <Label>Product Details</Label>
                    <Input 
                      type="text" 
                      value={newProduct.productName}
                      onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                      defaultValue={prodDetails.productName} />
                  </div> 
              </div>
              <div className="py-2 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div> 
                  <Label>Capital Price</Label>
                  <Input 
                    type="number" 
                    min="1" step="any" 
                    value={newProduct.cptPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, cptPrice: e.target.value })}
                    defaultValue={prodDetails.cptPrice} />
                </div>

                <div>
                  <Label>Wholesale Price</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    step="any" 
                    value={newProduct.wlprice}
                    onChange={(e) => setNewProduct({ ...newProduct, wlprice: e.target.value })}
                    defaultValue={prodDetails.wlprice} />
                </div>

                <div>
                  <Label>SRP Price</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={newProduct.srpPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, srpPrice: e.target.value })}
                    step="any" defaultValue={prodDetails.srpPrice} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
    
  );
}
