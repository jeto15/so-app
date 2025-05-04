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
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>

      <div className="overflow-y-auto max-h-96">
        <div className="relative">
          {/* Transaction List */}
          <ul className="space-y-4 pl-6">
            {transactions.map((transaction, index) => (
              <li key={index} className="relative flex items-start space-x-3">
                {/* Circle for Sale or Purchase */}
                <div
                  className={`w-6 h-6 rounded-full border-2 ${
                    transaction.type === 'sale'
                      ? 'border-green-500 bg-green-100'
                      : 'border-blue-500 bg-blue-100'
                  } flex items-center justify-center`}
                >
                  <span
                    className={`text-xs font-semibold ${
                      transaction.type === 'sale' ? 'text-green-600' : 'text-blue-600'
                    }`}
                  >
                    {transaction.type === 'sale' ? 'S' : 'P'}
                  </span>
                </div>

                {/* Transaction Content */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Intl.DateTimeFormat('en-PH', {
                      timeZone: 'Asia/Manila',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    }).format(new Date(transaction.date))}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TransactionColumn;
