import { useState, useEffect } from 'react';
import axios from 'axios';

interface Supplier {
  id: number;
  name: string;
}

interface SupplierInputsProps {
  onChange?: (value: Supplier) => void;
  defaultValue?: string;
}

export default function SupplierInputs({ onChange, defaultValue = '' }: SupplierInputsProps) {
  const [input, setInput] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Supplier[]>([]);

  const fetchSuggestions = async (keyword = '') => {
    try {
      const response = await axios.get('/api/supplier', {
        params: { keyword },
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (input.trim()) {
        fetchSuggestions(input);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [input]);

  useEffect(() => {
    setInput(defaultValue);
  }, [defaultValue]);

  const handleSelect = (supplier: Supplier) => {
    setInput(supplier.name);
    setSuggestions([]);
    if (onChange) onChange(supplier);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700"
        placeholder="Search supplier"
        autoComplete="off"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded w-full max-h-40 overflow-y-auto z-10">
          {suggestions.map((sup) => (
            <li
              key={sup.id}
              onClick={() => handleSelect(sup)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {sup.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
