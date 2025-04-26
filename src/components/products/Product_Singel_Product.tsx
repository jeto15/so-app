"use client"; 
import { useSearchParams } from 'next/navigation'; 
import React from "react";  


import ProductRecordDetail from "../products/product_record";
 
 
export default function Product_Singel_Product() {
    const searchParams = useSearchParams();
    const id = searchParams?.get('id') ?? 'default-id'; // Fallback to a default value if 'id' is null
    
 
    return (
        <>  
            <ProductRecordDetail recordId={id}/>
        </>
    );
}    