'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import DateRangePicker from '@/components/customs/DateRangePicker';
import TransactionColumn from '@/components/customs/TransactionColumn';
//import TopSellingChart from '@/components/customs/TopSellingChart';

const getThisWeekRange = (): [Date, Date] => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return [start, end];
};

interface Purchase {
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
  product_details: string;
  product_code: string;
  location_name: string;
}

interface Sale {
  saleId: number;
  inventory_id: number;
  product_id: number;
  location_id: number;
  quantity: number;
  description: string;
  sale_date: string;
  sale_price: number;
  customer: string; 
  product_details: string;
  product_code: string; 
  location_name: string;
}

interface Transaction {
  description: string;
  date: string;
  type: 'sale' | 'purchase';
}

export default function Ecommerce() {
  const [fromDate, setFromDate] = useState<Date | null>(getThisWeekRange()[0]);
  const [toDate, setToDate] = useState<Date | null>(getThisWeekRange()[1]);
  const [purchaseTransactionsTransform, setPurchaseTransactionsTransform] = useState<Transaction[]>([]);
  const [salesTransactionsTransform, setSalesTransactionsTransform] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // const topSellingProducts = [
  //   { name: 'Product A', sales: 1200 },
  //   { name: 'Product B', sales: 850 },
  //   { name: 'Product C', sales: 900 },
  //   { name: 'Product D', sales: 600 },
  //   { name: 'Product E', sales: 1500 },
  //   // Add more products here
  // ];


  // Fetch transactions when the component mounts (default to current week range)
  useEffect(() => {
    handleRunClick();
  }, []); // Empty dependency array means it runs once when the component is first mounted.

  const handleRunClick = async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/transaction/get/bothtransaction', {
        params: {
          fromDate: fromDate.toISOString(),
          toDate: toDate.toISOString(),
        },
      });

      const { purchases, sales } = response.data;

      const mappedTransactionsPurchase = purchases.map((transaction: Purchase) => ({
        description: '['+transaction.product_code+']'+transaction.product_details +'| '+ transaction.description+': '+transaction.quantity+'| Where at '+ transaction.location_name,
        date: transaction.purchase_date, // Format the date if necessary
        type: 'purchase', // Ensure this is either 'sale' or 'purchase'
      }));

      const mappedTransactionsSale = sales.map((transaction: Sale) => ({
        description: '['+transaction.product_code+']'+transaction.product_details +'| '+ transaction.description+': '+transaction.quantity+'| Where at '+ transaction.location_name,
        date: transaction.sale_date, // Format the date if necessary
        type: 'sale', // Ensure this is either 'sale' or 'purchase'
      }));
   

      setPurchaseTransactionsTransform(mappedTransactionsPurchase || []);
      setSalesTransactionsTransform(mappedTransactionsSale || []);
  //    setSalesTransactions(sales || []);

      // console.log('Purchases:', purchases);
      // console.log('Sales:', sales);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (

     <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Dashoard
        </h3>

        <div className="p-6 space-y-6">
          <DateRangePicker
            fromDate={fromDate}
            toDate={toDate}
            onFromChange={setFromDate}
            onToChange={setToDate}
          />
          <button
            onClick={handleRunClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Run'}
          </button>

            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TransactionColumn
            title="Sale & Stock-out Transactions"
            transactions={salesTransactionsTransform}
            />
            <TransactionColumn
            title="Purchase & Stock-in Transactions"
            transactions={purchaseTransactionsTransform}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
