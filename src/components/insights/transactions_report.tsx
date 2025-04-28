// pages/inventory-report.js
'use client'; 

export default function TransactionReport() {
  // const [transactions, setTransactions] = useState([]);
  // const [period, setPeriod] = useState('daily'); // default period
  // const [loading, setLoading] = useState(false);

  // // Static JSON data for transactions
  // const staticData = {
  //   daily: [
  //     { transaction_id: 1, product_name: 'Product A', quantity: 10, price: 25.5, transaction_date: '2025-04-25T12:00:00Z' },
  //     { transaction_id: 2, product_name: 'Product B', quantity: 5, price: 15.75, transaction_date: '2025-04-25T14:00:00Z' },
  //   ],
  //   monthly: [
  //     { transaction_id: 3, product_name: 'Product A', quantity: 30, price: 25.5, transaction_date: '2025-04-15T12:00:00Z' },
  //     { transaction_id: 4, product_name: 'Product C', quantity: 8, price: 45.0, transaction_date: '2025-04-20T14:00:00Z' },
  //   ],
  //   annual: [
  //     { transaction_id: 5, product_name: 'Product B', quantity: 60, price: 15.75, transaction_date: '2025-01-12T12:00:00Z' },
  //     { transaction_id: 6, product_name: 'Product D', quantity: 20, price: 35.0, transaction_date: '2025-02-18T14:00:00Z' },
  //   ]
  // };

  // useEffect(() => {
  //   setLoading(true);
  //   // Simulate fetching data
  //   setTimeout(() => {
  //     setTransactions(staticData[period]);
  //     setLoading(false);
  //   }, 1000);
  // }, [period]); 

  return (
      <>
         <div className="container mx-auto p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-600">Welcome to Our Inventory Management System</h1>
        <p className="mt-4 text-lg text-gray-600">
          Manage your products and inventory with ease. Record purchases, sales, and keep track of your stock in real-time.
        </p>
      </header>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="feature-card p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-blue-600">Product Management</h2>
          <p className="mt-2 text-gray-500">
            Easily add new products, edit existing ones, and list all your products in a user-friendly interface. Our product management system allows you to quickly search through products with ease.
          </p>
        </div>

        <div className="feature-card p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-blue-600">Inventory Tracking</h2>
          <p className="mt-2 text-gray-500">
            Keep track of your stock levels effortlessly. Record purchases, sales, and manual stock movements. Our system ensures that your inventory stays up-to-date and accurate at all times.
          </p>
        </div>

        <div className="feature-card p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold text-blue-600">Search & Filter</h2>
          <p className="mt-2 text-gray-500">
            Search for products by name or category. Filter your inventory records to easily find and manage the items you need.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-center text-blue-600">How It Works</h2>
        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800">1. Manage Products</h3>
          <p className="mt-2 text-gray-500">
            Add new products to your catalog, update existing products, and maintain a comprehensive list that can be searched and edited at any time.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800">2. Track Inventory Movements</h3>
          <p className="mt-2 text-gray-500">
            Record purchases to increase stock, sales to reduce stock, and even manually adjust stock levels based on inventory checks.
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-semibold text-gray-800">3. Stay Organized</h3>
          <p className="mt-2 text-gray-500">
            All your product and inventory data is organized and accessible. You can quickly search and filter inventory records to find what you need.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mt-16 text-center">
        <h2 className="text-3xl font-semibold text-blue-600">Get Started Today!</h2>
        <p className="mt-4 text-lg text-gray-600">
          Start using our Inventory Management System today to keep your business organized and running smoothly. Sign up now and manage your products and inventory with ease.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-full text-lg hover:bg-blue-700">
          Get Started
        </button>
      </section>
    </div>
      </>
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

    //   {/* Transaction Table */}
    //   {!loading && (
    //     <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
    //       <table className="min-w-full table-auto text-gray-800">
    //         <thead>
    //           <tr className="bg-blue-100 text-left">
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700">Transaction ID</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700">Product</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700">Quantity</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700">Price</th>
    //             <th className="px-4 py-2 text-sm font-medium text-gray-700">Date</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {transactions.length > 0 ? (
    //             transactions.map((transaction) => (
    //               <tr key={transaction.transaction_id} className="border-b hover:bg-gray-50">
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
  );
}
