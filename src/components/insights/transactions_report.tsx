// pages/inventory-report.js
'use client';
// pages/inventory-report.js 

export default function InventoryReport() {
//   const [transactions, setTransactions] = useState([]);
//   const [period, setPeriod] = useState('daily'); // default period
//   const [loading, setLoading] = useState(false);

//   // Static JSON data for transactions
//   const staticData = {
//     daily: [
//       { transaction_id: 1, product_name: 'Product A', quantity: 10, price: 25.5, transaction_date: '2025-04-25T12:00:00Z' },
//       { transaction_id: 2, product_name: 'Product B', quantity: 5, price: 15.75, transaction_date: '2025-04-25T14:00:00Z' },
//     ],
//     monthly: [
//       { transaction_id: 3, product_name: 'Product A', quantity: 30, price: 25.5, transaction_date: '2025-04-15T12:00:00Z' },
//       { transaction_id: 4, product_name: 'Product C', quantity: 8, price: 45.0, transaction_date: '2025-04-20T14:00:00Z' },
//     ],
//     annual: [
//       { transaction_id: 5, product_name: 'Product B', quantity: 60, price: 15.75, transaction_date: '2025-01-12T12:00:00Z' },
//       { transaction_id: 6, product_name: 'Product D', quantity: 20, price: 35.0, transaction_date: '2025-02-18T14:00:00Z' },
//     ]
//   };

//   useEffect(() => {
//     setLoading(true);
//     // Simulate fetching data
//     setTimeout(() => {
//       setTransactions(staticData[period]);
//       setLoading(false);
//     }, 1000);
//   }, [period]);

  return (
    // <div className="container mx-auto p-6">
    //   <h1 className="text-4xl font-semibold text-center mb-6 text-gray-800">Inventory Transaction Report</h1>

    //   {/* Period Selection Card */}
    //   <div className="max-w-sm mx-auto mb-6 bg-white shadow-lg rounded-lg p-6">
    //     <label htmlFor="period" className="block text-lg font-medium text-gray-700 mb-2">Select Report Period:</label>
    //     <select
    //       id="period"
    //       value={period}
    //       onChange={(e) => setPeriod(e.target.value)}
    //       className="w-full p-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     >
    //       <option value="daily">Daily</option>
    //       <option value="monthly">Monthly</option>
    //       <option value="annual">Annual</option>
    //     </select>
    //   </div>

    //   {/* Loading Spinner */}
    //   {loading && (
    //     <div className="flex justify-center items-center py-6">
    //       <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
    //     </div>
    //   )}

    //   {/* Transaction Table with Your Custom Styling */}
    //   {!loading && (
    //     <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
    //       <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
    //         <thead>
    //           <tr className="bg-gray-100 dark:bg-gray-800">
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Transaction ID</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Product</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Quantity</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Price</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {transactions.length > 0 ? (
    //             transactions.map((transaction) => (
    //               <tr key={transaction.transaction_id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
    //                 <td className="px-4 py-3 text-sm">{transaction.transaction_id}</td>
    //                 <td className="px-4 py-3 text-sm">{transaction.product_name}</td>
    //                 <td className="px-4 py-3 text-sm">{transaction.quantity}</td>
    //                 <td className="px-4 py-3 text-sm">${transaction.price.toFixed(2)}</td>
    //                 <td className="px-4 py-3 text-sm">{new Date(transaction.transaction_date).toLocaleString()}</td>
    //               </tr>
    //             ))
    //           ) : (
    //             <tr>
    //               <td colSpan="5" className="px-4 py-3 text-center text-sm text-gray-500">No transactions found</td>
    //             </tr>
    //           )}
    //         </tbody>
    //       </table>
    //     </div>
    //   )}
    // </div>
    <>
        <h1>hell world</h1>
    </>
  );
}
