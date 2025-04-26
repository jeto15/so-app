import PageBreadcrumb from "@/components/common/PageBreadCrumb";   
import ProductSingleRecord from "@/components/products/Product_Singel_Product";   
import { Metadata } from "next"; 
import React, { Suspense } from "react"; // 👈 make sure you import Suspense

export const metadata: Metadata = { 
    title: "Your Product Record Details | Steven Ortega Consumer Goods Trading",
    description: "This will manage the products",
};

export default function ProductDetails() { 
  return (
    <div>
      <PageBreadcrumb pageTitle="Product Record Details" />  
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="space-y-6"> 
          <Suspense fallback={<div>Loading Product Details...</div>}>
            <ProductSingleRecord />
          </Suspense>
        </div> 
      </div>
    </div>  
  );
}
