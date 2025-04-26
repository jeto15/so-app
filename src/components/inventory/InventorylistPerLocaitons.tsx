"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell, 
  TableHeader,
  TableRow,
} from "../ui/table";

import Input from "../form/input/InputField";  

import Label from "../form/Label";

import {EyeIcon } from "@/icons";
import SupplierInput from "../customs/SupplierInputs";

 

 
type ProductObj = {
  Id: string;  // Ensure this matches your actual API response
  product_details: string;
  product_code: string;
  product_category: string;
  product_cpt_price: number;
  product_ws_price: number;
  product_price: number;
  quantity: number;
  reorder_level: number;
  InventoryID : number;
  description: string;
  supplierId: string;
};


export default function InventorylistPerLocaitons() {
  const searchParams = useSearchParams();
  const locId = searchParams?.get('id') ?? 'default-id'; // Fallback to a default value if 'id' is null
  const [products, setProducts] = useState([]);   
  const { isOpen, openModal, closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<ProductObj[]>([]);
  const [actiontype, setActionType] = useState(String);
  const [supplierId, setSupplierId] = useState(String);
  //Stock in states
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [customerName, setCustomerName] = useState('');
 
  const [transactoinError, setTransactionError] = useState(String);


  useEffect(() => { 
    fetchProducts( '', parseInt(locId) ); 
  }, [locId]); 
  

  const fetchProducts = async ( searchKey = "", locId = 0 ) => {
      try { 

        const response = await axios.get("/api/inventoryregistry",{ params: { searchKey , locId  }});
 
        setProducts(response.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
  };
 
 
  const handleSearchProduct = (keyword: React.ChangeEvent<HTMLInputElement>) => {   
    fetchProducts( keyword.target.value.toLowerCase() ,parseInt(locId));
  } 

  
  // const getProduct =  (id: number) => {
  //   try { 

  //     if (!filteredProducts || filteredProducts.length === 0) {
  //       console.error('filteredProducts is empty or undefined');
  //       return;
  //     }

  
  //     const ProdID = id; 
  //     const result = filteredProducts.filter(resProd =>  (resProd as ProductObj).InventoryID === ProdID);

  //     if (result.length === 0) {
  //       console.error('No matching product found');
  //       return; 
  //     }
  

  //     const prodItems = { 
  //       Id: ProdID,
  //       productName: result[0].product_details ?? '',
  //       productCode: result[0].product_code ?? '',
  //       productCategory: result[0].product_category ?? '',
  //       cptPrice: result[0].product_cpt_price ?? 0,
  //       wlprice: result[0].product_ws_price ?? 0,
  //       srpPrice: result[0].product_price ?? 0
  //     };
      
  //     console.log(prodItems); 
  //   //  setNewProduct(prodItems);  
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //   }
  // };
  

  const handleSelect = (item: ProductObj) => {

    console.log('ProductObj',item);

    const alreadySelected = selectedItems.find((i) => i.Id === item.Id);
    if (!alreadySelected) {
      setSelectedItems([...selectedItems, item]);
    }
     
  };
  
  const handleRemove = (Id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.Id !== Id));
  };

 
  const handlSaveTransaction = async ( ) => { 
    try{ 
        let descriptions  = '';
        let supId = '';
        let apiRequstString = '';
        if( actiontype === 'Stock Out' ){
          descriptions =  'Manual Stockout Entry';
          apiRequstString = '/api/transaction/sales';
        }
        if( actiontype === 'Stock In' ){
          descriptions =  'Manual Stockin Entry';
          apiRequstString = '/api/transaction/purchase';
        }
        
        
        if( actiontype === 'Sale' ){ 
          descriptions =  'Selling Stockin Entry';
          apiRequstString = '/api/transaction/sales';
        }

        if( actiontype === 'Purchase' ){
          supId = supplierId;
          descriptions =  'Purchasing Stockin Entry';
          apiRequstString = '/api/transaction/purchase';
        }

        

        const selectedList = selectedItems
        .map((product) => (
          { 
            ...product, 
            description: descriptions, 
            supplierId: supId,
            productId: product.Id,  
            customername: customerName, 
            quantity: quantities[parseInt(product.Id)] || 0,
          }
        )).filter((item) => item.quantity > 0); 

        if( apiRequstString != '' ){
          await axios.post(apiRequstString, selectedList);   
        }
    
        setSelectedItems([]);

        fetchProducts( '', parseInt(locId) );  

        setActionType('');

        closeModal(); 
        setTransactionError(''); 

    } catch (error) {
        
       

        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error; 

          setTransactionError(errorMessage); 
          // you can also set it to state or show in UI
        } else {
          console.error('Unexpected Error:', error);
        }
       // setError('Failed to add product. Please try again.');
    }
  }

  const handleQtyChange = (productId: number, qty: number): void => {
    setQuantities((prev) => ({
    ...prev,
    [productId]: qty,
    }));
  };
 
 
  const openModalStockIn =() =>{
    setActionType("Stock In");
    setTransactionError('');
    setCustomerName('');
    openModal();
  }

  const openModalStockOut =() =>{
    setActionType("Stock Out");
    setTransactionError('');
    setCustomerName('');
    openModal();

  }

  const openModalStockPurchase =() =>{
    setActionType("Purchase");
    setTransactionError('');
    setCustomerName(''); 
    openModal();
  }
  const openModalStockSales =() =>{
    setActionType("Sale");
    setTransactionError('');
    openModal();

  }

  const handleEnterCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('Typed value:', value); // ✅ you get the value here
    setCustomerName(value);
  };

  const filteredProducts: ProductObj[] = products;
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Inventory Products 
          </h3>
          {/* <Button size="sm" variant="outline" onClick={handleVoiceSearch}>
            🎤 Speak to Search
          </Button> */}
        </div> 
        <div>
                        
            <button
            onClick={openModalStockPurchase}
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 m-1"
            > 
              Purchase 
            </button>

            <button
            onClick={openModalStockSales}
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 m-1"
            > 
              Sale 
            </button>

            <button
            onClick={openModalStockIn}
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300  m-1"
            > 
              Stock In 
            </button>

            <button 
            onClick={openModalStockOut}
            className="inline-flex items-center justify-center font-medium gap-2 rounded-lg transition  px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300  m-1"
            > 
              Stock Out 
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="d-flex">
          <Input 
            type="text"  
            placeholder="Search products..."  
            className="form-control mb-3 "    
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
                Products Code
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Products Details
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Stocks And Restocks Level
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

                <TableRow key={product.InventoryID} className="">
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 
                  <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.product_category}
                    </span>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-3"> 
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.product_code}
                      </p>  
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.product_details}
                    </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {product.quantity} 
                  </p>
                </TableCell>  
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"> 

                  <div className="flex gap-5">
                  <a href={`/products/product-record?id=${product.Id}`} target="_blank">
                        <EyeIcon       /> 
                    </a> 
                    <button 
                      onClick={() => handleSelect(product)} 
                      className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400"    >
                        Select
                    </button>

                    
 
                    {/* <button  onClick={() => removeProduct(product.Id)}  >
                      <TrashBinIcon />
                    </button> */}
                  </div>
 
                </TableCell>
              </TableRow>

              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No products found
                </td>
              </tr>
            )}

          </TableBody>
        </Table>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1000px] m-4">
        <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {actiontype}
            </h4> 
            {transactoinError && <div className="text-red-500 mt-2">{transactoinError}</div>} 
          </div> 
          <div className="flex flex-col">
            <div className="custom-scrollbar px-1 pb-3">
      
            {actiontype === 'Purchase' && (
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Supplier is?</Label>
                    <SupplierInput
                      onChange={(selectedSupplier) => {
                        setSupplierId(selectedSupplier.id.toString());
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

          {actiontype === 'Sale' && (
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Supplier is?</Label> 
                    <Input 
                      type="text"  
                      placeholder="Customer name"  
                      className="form-control mb-3 "    
                      onChange={handleEnterCustomer} 
                      defaultValue={customerName}
                    />
                  </div>
                </div>
              </div>
            )}
            </div> 
          </div>
          <div  className="flex flex-col">   
            <div className="w-full overflow-x-auto">
                <Table className="min-w-[1000px] table-auto">
                  {/* Table Header */} 
                      {/* Table Body */} 
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800"> 
                        {selectedItems.length > 0 ? (
                            selectedItems.map((product) => (

                            <TableRow key={product.Id} className="">
                            <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 
                            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                {product.product_category}
                            </span>
                            </TableCell> 
                            <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 
                                <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                                  [{product.product_code}] {product.product_details}   
                                </span>
                            </TableCell>
                            <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 
                                <input
                                    type="number"
                                    min={0}
                                    className="border px-2 py-1 w-20"  
                                    value={quantities[parseInt(product.Id)] || ''}
                                    onChange={(e) => handleQtyChange(  parseInt(product.Id) , parseInt(e.target.value || '0', 10))}
                                />
                            </TableCell>  
                            
                            <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 

                            <div className="flex gap-5">
                              <button 
                                onClick={() => handleRemove(product.Id)}
                                className="inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400"    >
                                  Remove
                              </button> 
                            </div>
                            </TableCell>
                        </TableRow>

                        ))
                        ) : (
                        <tr>
                            <td colSpan={4} className="text-center">
                            No products found
                            </td>
                        </tr>
                        )}

                    </TableBody>
                </Table>
            </div>  
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                <Button size="sm" variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button size="sm" onClick={handlSaveTransaction} >
                  Save Changes
                </Button>
              </div>
            )}

          </div>
        </div>
      </Modal>
 
    </div>
    
  );
}
