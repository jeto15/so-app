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
  const { isOpen,  closeModal } = useModal();
  const [selectedItems, setSelectedItems] = useState<ProductObj[]>([]);
  const [actiontype, setActionType] = useState(String);
  const [supplierId, setSupplierId] = useState(String);
  //Stock in states
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [sale_price, setSale_price] = useState<Record<number, number>>({});
  const [customerName, setCustomerName] = useState('');
  const [stockInReason, setStockInReason] = useState('');
  const [showLeft, setShowLeft] = useState(true);

  const [transactoinError, setTransactionError] = useState(String);

  const [active, setActive] = useState('Purchase');

  const buttons = [
    {
      label: 'Purchase',
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
    },
    {
      label: 'Sale',
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
    },
    {
      label: 'Stock In',
      bg: 'bg-yellow-500',
      hover: 'hover:bg-yellow-600',
    },
    {
      label: 'Stock Out',
      bg: 'bg-red-500',
      hover: 'hover:bg-red-600',
    },
  ];

 

  useEffect(() => { 
    fetchProducts( '', parseInt(locId) ); 
  }, [locId]); 
  

  const fetchProducts = async ( searchKey = "", locId = 0 ) => {
      try { 

        const response = await axios.get("/api/inventoryregistry",{ params: { searchKey , locId  }});
      //  setActionType('Purchase');
        setProducts(response.data);  
      } catch (error) {
        console.error("Error fetching products:", error);
      }
  };
 
 
  const handleSearchProduct = (keyword: React.ChangeEvent<HTMLInputElement>) => {   
    fetchProducts( keyword.target.value.toLowerCase() ,parseInt(locId));
  } 
 
  const handleSelect = (product: ProductObj) => {
    const isAlreadySelected = selectedItems.some(item => item.InventoryID === product.InventoryID);

    

    if (isAlreadySelected) {
      // Deselect: remove from selectedItems
      setSelectedItems(selectedItems.filter(item => item.InventoryID !== product.InventoryID));
    } else {
      // Select: add to selectedItems
      setSelectedItems([...selectedItems, product]);
    }
  };
  
  const handleRemove = (Id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.Id !== Id));
 
  };
 
  const handlSaveTransaction = async ( ) => { 
    try{ 

        const now = new Date();
        const prefix = 'TXN'
        const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
        const randomPart = Math.floor(10000 + Math.random() * 90000); // random 5-digit number
   
        const tran_number =  `${prefix}-${datePart}-${randomPart}`; 
        let descriptions  = '';
        let supId = '';
        let apiRequstString = '';  
  
        supId = supplierId;
    

          /*
          Example req.body:
          {
            transaction: {
              transaction_type: 'Purchase',
              location_id: 1,
              description: 'Supplier delivery #5678',
              supplier_id: 123
            },
            lines: [
              { productId: 10, quantity: 5, unit_cost: 12.0 },
              { productId: 15, quantity: 3, unit_cost: 8.5 }
            ]
          }
          */
                      
        if(actiontype === 'Purchase' ){

          descriptions =  stockInReason+' Supplier delivery #'+tran_number;
          apiRequstString = '/api/transaction/transaction_purchase';

          const selectedList = selectedItems
          .map((product) => (
            { 
              ...product, 
              productId: product.Id,   
              quantity: quantities[parseInt(product.Id)] || 0,
              sale_price: sale_price[parseInt(product.Id)] || 0,
            }
          )).filter((item) => item.quantity > 0); 

          const  transactions_payload = {
            transaction: {
              transaction_type: actiontype,
              location_id: locId,
              description: descriptions,
              supplier_id: supId
            },
            lines : selectedList
          } 
  
          if( apiRequstString != '' ){
            await axios.post(apiRequstString, transactions_payload);   

            alert('Tansaction '+actiontype+' Complete!');
          } 

        }
      

        /*
        Example req.body:
        {
          transaction: {
            transaction_type: 'Sale',
            location_id: 1,
            description: 'Customer Order #1234',
            customername: 'John Doe',
          },
          lines: [
            { productId: 10, quantity: 2, sale_price: 15.5 },
            { productId: 11, quantity: 1, sale_price: 10 }
          ]
        }
        */

        if(actiontype === 'Sale' ){
           
          descriptions = stockInReason+ 'Customer Order #'+tran_number;
       
          apiRequstString = '/api/transaction/transaction_sales';

          const selectedList = selectedItems
          .map((product) => (
            { 
              ...product, 
              productId: product.Id,  
              quantity: quantities[parseInt(product.Id)] || 0,
              sale_price: sale_price[parseInt(product.Id)] || 0,
            }
          )).filter((item) => item.quantity > 0); 

          const  transactions_payload = {
            transaction: {
              transaction_type: actiontype,
              location_id: locId,
              description: descriptions,
              customername: customerName
            },
            lines : selectedList
          } 
  
          if( apiRequstString != '' ){
            await axios.post(apiRequstString, transactions_payload);   

            alert('Tansaction '+actiontype+' Complete!');
          } 

        }

        /*
        Example req.body:
        {
          transaction: {
            transaction_type: 'Stock In',
            location_id: 1,
            description: 'Manual stock entry',
          },
          lines: [
            { productId: 10, quantity: 5 },
            { productId: 15, quantity: 3 }
          ]
        }
        */
        if(actiontype === 'Stock In'){
           
          descriptions = 'Manual stock entry |'+stockInReason;
       
          apiRequstString = '/api/transaction/stock_in';

          const selectedList = selectedItems
          .map((product) => (
            { 
              ...product, 
              productId: product.Id,   
              quantity: quantities[parseInt(product.Id)] || 0
            }
          )).filter((item) => item.quantity > 0); 

          const  transactions_payload = {
            transaction: {
              transaction_type: actiontype,
              location_id: locId,
              description: descriptions
            },
            lines : selectedList
          } 
  
          if( apiRequstString != '' ){
            await axios.post(apiRequstString, transactions_payload);   

            alert('Tansaction '+actiontype+' Complete!');
          } 
 
        }

        /*
        Example req.body:
        {
          transaction: {
            transaction_type: 'Stock Out',
            location_id: 1,
            description: 'Damaged goods removal',
            customername: null
          },
          lines: [
            { productId: 10, quantity: 2 },
            { productId: 11, quantity: 1 }
          ]
        }
        */
        if(actiontype === 'Stock Out' ){
           
          descriptions = 'Damaged goods removal '+stockInReason;
       
          apiRequstString = '/api/transaction/stock_out';

          const selectedList = selectedItems
          .map((product) => (
            { 
              ...product, 
              productId: product.Id,  
              quantity: quantities[parseInt(product.Id)] || 0,
            }
          )).filter((item) => item.quantity > 0); 

          const  transactions_payload = {
            transaction: {
              transaction_type: actiontype,
              location_id: locId,
              description: descriptions,
              customername: ''
            },
            lines : selectedList
          } 
  
          if( apiRequstString != '' ){
            await axios.post(apiRequstString, transactions_payload);   

            alert('Tansaction '+actiontype+' Complete!');
          } 

        }

      
        fetchProducts( '', parseInt(locId) );   
        setStockInReason('');  
        setActionType(actiontype);
        setActive(actiontype);  
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

  const handleSalePriceChange = (productId: number, saleprice: number): void => {
    setSale_price((prev) => ({
    ...prev,
    [productId]: saleprice,
    }));
  };
   
  const handleClikTransaction = ( action_type : string ) =>{

    setActionType(action_type);
    setActive(action_type);
    setTransactionError('');
    setCustomerName('');  
    //clearAllItemFields();

  }

  const handleEnterCustomer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; 
    setCustomerName(value);
  };

  const handleEnterStockInReason = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; 
    setStockInReason(value);
  };

  const clearAllItemFields = () => {
    const updatedItems = selectedItems.map(item => ({
      ...item,
      quantity: 0,
      sale_price: 0,
    })); 
    setSelectedItems(updatedItems);

    setQuantities([]);
    setSale_price([]);
  };
  

  const filteredProducts: ProductObj[] = products;
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-md">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Inventory Products 
          </h3> 
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

       

           {/* Toggle Button */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowLeft(!showLeft)}
        >
          {showLeft ? 'Hide Product List' : 'Show Product List'}
        </button>
      </div>

      <div className="flex gap-4">
        {/* Left Column – Product List */}
        {showLeft && (
        <div className="w-[700px] bg-white p-4 rounded shadow transition-all">
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
                <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 
                  <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.product_category}
                    </span>
                </TableCell>
                <TableCell className="py-1">
                  <div className="flex items-center gap-3"> 
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.product_code}
                      </p>  
                  </div>
                </TableCell>
                <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 
                    <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {product.product_details}
                    </span>
                </TableCell>
                <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {product.quantity} 
                  </p>
                </TableCell>  
                <TableCell className="py-1 text-gray-500 text-theme-sm dark:text-gray-400"> 

                  <div className="flex gap-5">
                  <a href={`/products/product-record?id=${product.Id}`} target="_blank">
                        <EyeIcon       /> 
                    </a> 
                    <button 
                      onClick={() => handleSelect(product)} 
                      className={`inline-flex items-center px-2.5 py-0.5 justify-center gap-1 rounded-full font-medium text-sm ${
                        selectedItems.some(item => item.InventoryID === product.InventoryID)
                          ? 'bg-red-500 text-white' // Deselect style
                          : 'bg-brand-50 text-brand-500 dark:bg-brand-500/15 dark:text-brand-400' // Select style
                      }`}
                    >
                      {selectedItems.some(item => item.InventoryID === product.InventoryID) ? 'Deselect' : 'Select'}
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
        )}

        {/* Right Column – Selected Items Table */}
        <div className={`${showLeft ? 'w-1/2' : 'w-full'} bg-white p-4 rounded shadow transition-all`} >
          <div className="flex flex-wrap gap-4 p-4">
            {buttons.map((btn) => {
              const isActive = active === btn.label;
              const activeStyles = isActive
                ? 'ring-4 ring-offset-2 ring-white scale-125'
                : '';

              return (
                <button
                  key={btn.label}
                  onClick={() => handleClikTransaction(btn.label)}
                  className={`text-white font-bold py-2 px-4 rounded shadow transform transition-all duration-200 ${btn.bg} ${btn.hover} ${activeStyles}`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
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
                        <Label>Customer Name?</Label>
                        <Input
                          type="text"
                          placeholder="Enter Customer Name"
                          className="form-control mb-3"
                          onChange={handleEnterCustomer}
                          defaultValue={customerName}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-7">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                    <div className="col-span-2 lg:col-span-1">
                      <Label>Descriptions</Label>
                      <Input
                        type="text"
                        placeholder="Example: Note, Reason or Label"
                        className="form-control mb-3"
                        onChange={handleEnterStockInReason}
                        defaultValue={stockInReason}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Table Section */}
            <div className="flex flex-col">
              <div className="w-full overflow-auto max-w-full max-h-[50vh] sm:max-h-[60vh] lg:max-h-[70vh]">
                <div className="min-w-[600px] lg:min-w-full">
                  <Table className="table-auto w-full border-collapse">
                    <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
                      <tr>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Category</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Product</th>
                        {(actiontype === 'Sale' || actiontype === 'Purchase') && (
                          <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Price</th>
                        )}
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Qty</th>
                        <th className="px-2 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {selectedItems.length > 0 ? (
                        selectedItems.map((product) => (
                          <TableRow key={product.Id} className="text-sm">
                            <TableCell className="py-1 px-2 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {product.product_category}
                            </TableCell>
                            <TableCell className="py-1 px-2 text-gray-500 dark:text-gray-400">
                              [{product.product_code}] {product.product_details} | SRP: {product.product_price}
                            </TableCell>
                            {(actiontype === 'Sale' || actiontype === 'Purchase') && (
                              <TableCell className="py-1 px-2 text-gray-500 dark:text-gray-400">
                              <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  placeholder="Enter Price: 0.00"
                                  className="border px-2 py-1 w-full max-w-[120px] rounded text-sm"
                                  value={sale_price[parseFloat(product.Id)] || ''}
                                  onChange={(e) =>
                                    handleSalePriceChange(parseInt(product.Id), parseFloat(e.target.value || '0'))
                                  }
                                />  
                          
                              </TableCell>
                            )}
                            <TableCell className="py-1 px-2 text-gray-500 dark:text-gray-400">
                              <input
                                type="number"
                                min={0}
                                placeholder="QTY"
                                className="border px-2 py-1 w-full max-w-[80px] rounded text-sm"
                                value={quantities[parseInt(product.Id)] || ''}
                                onChange={(e) =>
                                  handleQtyChange(parseInt(product.Id), parseInt(e.target.value || '0', 10))
                                }
                              />
                            </TableCell>
                            <TableCell className="py-1 px-2 text-gray-500 dark:text-gray-400">
                              <button
                                onClick={() => handleRemove(product.Id)}
                                className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200"
                              >
                                Remove
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-4 text-sm text-gray-500">
                            No products found
                          </td>
                        </tr>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
                  <Button size="sm" variant="outline" onClick={clearAllItemFields}>
                    Clear Fields
                  </Button>
                  <Button size="sm" onClick={handlSaveTransaction}>
                    [ {actiontype} ]Save Changes 
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[1000px] m-4">
      <div className="no-scrollbar relative w-full max-w-[1000px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {actiontype}
          </h4>
          {transactoinError && <div className="text-red-500 mt-2">{transactoinError}</div>}
        </div>

 
      </div>
    </Modal>

    </div>
    
  );
}
