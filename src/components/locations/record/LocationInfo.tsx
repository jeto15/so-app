"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import axios from "axios";


import React from "react";
import { useModal } from "../../../hooks/useModal";
import InventorylistPerLocaitons from "../../inventory/InventorylistPerLocaitons";



 
export default function LocationInfo() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id') ?? 'default-id'; // Fallback to a default value if 'id' is null
    
    type locationsObj = {
        id: string;  // Ensure this matches your actual API response
        name: string;
        address: string;
    };

    const [locationRecord, setLocationRecord] = useState([]); 
 

    useEffect(() => { 
        fetchLocationRecord();   
    }, []); 

 
    
    const fetchLocationRecord = async () => {
        try {  
            const response = await axios.get("/api/location/"+id,{}); 
 
            setLocationRecord(response.data);
  
          } catch (error) {
            console.error("Error fetching products:", error);
          }
    }; 
    
    const locRecord : locationsObj = locationRecord[0]; 
    return (
        <>
            <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Location Information 
                        </h4>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                            <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Name
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {locRecord?.name}
                            </p>
                            </div>

                            <div>
                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                Address
                            </p>
                            <p className="text-sm font-medium text-gray-800 dark:text-white/90"> 
                                <a href={locRecord?.address} target="_blank"> Click to see the Address</a> 
                            </p>
                            </div>
    
                        </div>
                    </div> 
                </div>

           
            </div>
 
            <InventorylistPerLocaitons /> 
        </>

    );
}    