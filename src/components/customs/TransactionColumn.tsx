import React from 'react';

interface Transaction {
  description: string;
  date: string;
  type: 'sale' | 'purchase';
}

interface TransactionColumnProps {
  title: string;
  transactions: Transaction[];
}

const TransactionColumn: React.FC<TransactionColumnProps> = ({
  title,
  transactions,
}) => {
  return (

    <div className="p-4 text-sm">
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full table-auto border border-gray-200 bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Transaction Date and Time</th>
            <th className="px-4 py-2 border">Summary</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="text-center">
              <td className="px-4 py-2 border">
                {new Intl.DateTimeFormat('en-PH', {
                  timeZone: 'Asia/Manila',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }).format(new Date(transaction.date))}
              </td>
              <td className="px-4 py-2 border">{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  

   
  );
};

export default TransactionColumn;
