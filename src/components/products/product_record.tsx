'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import  LocationTransaction  from "../locations/LocationTransaction"; // Import LocationTransaction
import { FaBox, FaTag, FaDollarSign, FaClipboardList } from 'react-icons/fa';

interface RecordDetailProps {
  recordId: string;
} 

interface RecordData {
  Id: string;
  product_category: string;
  product_code: string;
  product_details: string;
  product_cpt_price: number;
  product_price: number;
  product_ws_price: number;
}

interface RecordInvProdObj {
  Id: string;
  location_id: string;
  quantity: number;
  InventoryID: number;
}

const RecordDetail: React.FC<RecordDetailProps> = ({ recordId }) => {
  const [record, setRecord] = useState<RecordData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inventoryProd, setInventoryProd] = useState([]); 

  const fetchInventooryRecords = async (prodId = '') => {
    try {
      const response = await axios.get('/api/inventoryregistry/get_per_product/' + prodId);
      setInventoryProd(response.data);
    } catch (error) {
      console.error("Failed to fetch purchase record:", error);
    }
  };

  useEffect(() => {
    const fetchRecord = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await axios.get<RecordData>(`/api/view/product/${recordId}`);
        setRecord(response.data);
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
    fetchInventooryRecords(recordId);

  }, [recordId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!record) return <p>No record found.</p>;

  const fetachInvProd: RecordInvProdObj[] = inventoryProd;
  return (
    <>
      <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
        Product Information
      </h4>

      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <FaClipboardList className="inline mr-2" />
                  Product Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {record.product_code}
                </p>
              </div> 

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <FaTag className="inline mr-2" />
                  Product Category
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {record.product_category}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <FaBox className="inline mr-2" />
                  Product Details
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {record.product_details}
                </p>
              </div>

              <div></div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <FaDollarSign className="inline mr-2" />
                  Capital Price
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {record.product_cpt_price}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <FaDollarSign className="inline mr-2" />
                  Wholesale Price
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {record.product_ws_price}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  <FaDollarSign className="inline mr-2" />
                  Retail Price
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {record.product_price}
                </p>
              </div>
            </div>
          </div> 
        </div> 
      </div>

      
      <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
        Locations Information
      </h5>


      {fetachInvProd.map((InvProdRec) => (
      <div key={InvProdRec.InventoryID} className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="lg:flex-row lg:items-start lg:justify-between">
          <div>
            <LocationTransaction recordId={InvProdRec.location_id} productId={record.Id} reaminaingQty={InvProdRec.quantity} />
          </div>
        </div> 
      </div>
      ))}
    </>
  );
};

export default RecordDetail;
