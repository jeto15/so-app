'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Purchase_Table from "../pruchase/Purchase_Table";
import Sale_Table from "../sale/Sale_Table";
import { useRouter } from 'next/navigation';
 
import {  EyeIcon } from "@/icons";
 
 
interface LocationTransaction {
  recordId: string;
  productId: string;
  reaminaingQty: number;

}

interface LocRecordData {
    id: string; 
    name: string;  
    address: string;
}


type PurchaseRecord = {
  purchaseId: number;
  product_id: number;
  inventory_id: number;
  location_id: number;
  supplier_id: number;
  supplierName: string;
  description: string;
  quantity: number;
  unit_cost: number; 
  purchase_date: string;
  contact_info: string;
};


 
type SaleRecord = {
  inventory_id: number;
  product_id: number;
  location_id: number;
  saleId: number; 
  description: string;
  customer: string; 
  quantity: number; 
  sale_date: string; 
};

 

const LocationTransaction: React.FC<LocationTransaction> = ({ recordId ,  productId , reaminaingQty}) => {
  const router = useRouter();

  const [record, setRecord] = useState<LocRecordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [purchasesList, setPurchasesList] = useState([]);   
  const [saleList, setSaleList] = useState([]);   

 

  const fetchPurchaseRecord = async (recordId = "", productId = "") => {
    try {
      const response = await axios.get("/api/transaction/get/purchaseperprod", {
        params: { recordId, productId },
      });
 
      setPurchasesList(response.data);
    } catch (error) {
      console.error("Failed to fetch purchase record:", error);
    }
  }; 

  
  const fetchSaleRecord = async (recordId = "", productId = "") => {
    try {
      const response = await axios.get("/api/transaction/get/saleperprod", {
        params: { recordId, productId },
      });
       
      setSaleList(response.data);
    } catch (error) {
      console.error("Failed to fetch purchase record:", error);
    } 
  }; 

  
  const viewLocation = (id: string) => {
    try {
         
        router.push('/locations/location-record?id='+id);

    } catch (error) {
        console.error('Error deleting product:', error);
    }

}



  useEffect(() => {
    const fetchRecord = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<LocRecordData[]>(`/api/location/${recordId}`);
        //console.log(response.data); 
        setRecord(response.data[0]);
        setError(null);
      } catch (err: unknown) { 
        let message = 'Failed to load record.';
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message ?? err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
  
 
    fetchRecord();
    fetchPurchaseRecord(recordId,productId);
    fetchSaleRecord(recordId,productId);

  }, [recordId,productId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!record) return <p>No record found.</p>;



  const fetchPurchaseRecords: PurchaseRecord[] = purchasesList;
  const fetchSaleRecords: SaleRecord[] = saleList;

  
  return (
    <>  
    <div>

      <div className="flex flex-col md:flex-row gap-4 p-6 bg-gray-100 ">
        {/* Left: Location Details */}
        <div className="md:w-1/2 bg-white shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">📍 Location Details</h2>
          <div className="text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Location Name:</span> {record.name} </p>
            <p><span className="font-medium text-gray-800">Address:</span>    <a href={record.address} target="_blank"> Click to see the Address</a> </p>
            <button  > 
                  <EyeIcon   onClick={() => viewLocation(record.id)} /> 
            </button> 
          </div>

          <div className='mt-[5%]' >
                {/* Left Column Table */}
                <div className="overflow-auto">
                  <Purchase_Table records={fetchPurchaseRecords} />
                </div>
        
            </div>
        
            <div className='mt-[5%]'>
                {/* Left Column Table */}
                <div className="overflow-auto">   
                <Sale_Table records={fetchSaleRecords} />
                </div>
        
            </div>
        </div>

        {/* Right: Quantity Card */}
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm text-center border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">🛒 Quantity Available</h3>
            <div className="text-4xl font-bold text-blue-600 mb-1">{reaminaingQty} Units</div> 
          </div>
        </div>
      </div>
  
    </div>
 
    </>
  
  );
};

export default LocationTransaction;
