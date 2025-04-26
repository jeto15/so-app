'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

type SaleRecord = {
  inventory_id: number;
  product_id: number;
  location_id: number;
  saleId: number;
  description: string;
  customer:string;
  quantity: number;
  sale_date: string;
};

type SaleTableProps = {
  records: SaleRecord[];
};

const Sale_Table: React.FC<SaleTableProps> = ({ records }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
        Sale (Stock Out)
      </h2>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <Table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            <TableRow>
              <TableCell isHeader className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">
                Created Date
              </TableCell>
              <TableCell isHeader className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">
                Description
              </TableCell>
              <TableCell isHeader className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">
                Customer
              </TableCell>
              <TableCell isHeader className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-300">
                Quantity
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {records.map((record) => (
              <TableRow key={record.saleId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <TableCell className="py-3 px-4">
                  {record.sale_date}
                </TableCell>
                <TableCell className="py-3 px-4">
                  {record.description} (Qty Out: {record.quantity})
                </TableCell>
                <TableCell className="py-3 px-4">
                  {record.customer}   
                </TableCell>
                <TableCell className="py-3 px-4">
                  {record.quantity}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Sale_Table;
