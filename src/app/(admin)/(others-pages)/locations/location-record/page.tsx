import PageBreadcrumb from "@/components/common/PageBreadCrumb";  
import LocationInfo from "@/components/locations/record/LocationInfo";

import { Metadata } from "next"; 
import React from "react"; 

export const metadata: Metadata = { 
    title: "Your Location Record Details | Steven Ortega Consumer Goods Trading",
    description: "This will manage the poducts",
};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Location Record Details" />  
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="space-y-6"> 
 
            <LocationInfo />  
 
          </div>
        </div>
    </div> 
  );
}
