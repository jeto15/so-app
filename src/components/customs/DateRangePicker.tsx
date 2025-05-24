import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
    fromDate: Date | null;
    toDate: Date | null;
    onFromChange: React.Dispatch<React.SetStateAction<Date | null>>;
    onToChange: React.Dispatch<React.SetStateAction<Date | null>>;
  }

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <div className="w-full md:w-auto">
        <label className="block text-sm font-medium mb-1">From</label>
        <DatePicker
          selected={fromDate}
          onChange={onFromChange}
          selectsStart
          startDate={fromDate}
          endDate={toDate}
          className="w-full border px-3 py-1 rounded"
          placeholderText="Start date"
        />
      </div>
      <div className="w-full md:w-auto">
        <label className="block text-sm font-medium mb-1">To</label>
        <DatePicker
          selected={toDate}
          onChange={onToChange}
          selectsEnd
          startDate={fromDate}
          endDate={toDate}
          className="w-full border px-3 py-1 rounded"
          placeholderText="End date"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
