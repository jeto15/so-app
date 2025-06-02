'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
 
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


 

 
type TransactionRecord = {
  customer_name : string;
  description : string;
  id : number;
  location_id : number;
  product_id : number;
  quantity : number;
  supplier_id : number;
  transaction_date : string;
  transaction_header_id : number;
  transaction_type : string;
  unit_price : number;
  supplier_name : string;
}

 

const LocationTransaction: React.FC<LocationTransaction> = ({ recordId ,  productId , reaminaingQty}) => {
  const router = useRouter();

  const [record, setRecord] = useState<LocRecordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [transactionHistory, setTransactionHistory] = useState([]);

  const getTransactionHistoryRecord = async (recordId = "", productId = "") => {
    try {
      const response = await axios.get("/api/transaction/get/transaction_per_product", {
        params: { recordId, productId },
      });
 
      setTransactionHistory(response.data);
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
    getTransactionHistoryRecord(recordId,productId); 

  }, [recordId,productId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!record) return <p>No record found.</p>;
 
  const fetTransactionRecords: TransactionRecord[] = transactionHistory;

  
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
  
        </div>

        {/* Right: Quantity Card */}
        <div className="md:w-1/2  items-center  p-6 space-y-4">
          <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-sm text-center border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">🛒 Quantity Available</h3>
              <div className="text-4xl font-bold text-blue-600 mb-1">{reaminaingQty} Units</div> 
          </div>
    
        </div> 
        {/* <div className="md:w-1/2 flex items-center justify-center">
         
        </div> */}
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border text-xs text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-1">Date</th>
                  <th className="border px-3 py-1">Type</th> 
                  <th className="border px-3 py-1">Customer/Supplier</th>
                  <th className="border px-3 py-1">Description</th>
                  <th className="border px-3 py-1">Qty</th>
                  <th className="border px-3 py-1">Price</th>
                </tr>
              </thead>
              <tbody>
                {fetTransactionRecords.map((trans) => (
                  <tr key={trans.id} className="border-t">
                    <td className="border px-3 py-1 whitespace-nowrap">
                      {new Intl.DateTimeFormat('en-PH', {
                        timeZone: 'Asia/Manila',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      }).format(new Date(trans.transaction_date))}
                    </td>
                    <td className="border px-3 py-1">{trans.transaction_type}</td> 
                    <td className="border px-3 py-1">{trans.customer_name} {trans.supplier_name}</td>
                    <td className="border px-3 py-1">{trans.description}</td>
                    <td className="border px-3 py-1">
                      {trans.quantity}
                    </td>
                    <td className="border px-3 py-1">{trans.unit_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
 
    </>
  
  );
};

export default LocationTransaction;
