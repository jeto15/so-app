import PageBreadcrumb from "@/components/common/PageBreadCrumb"; 
import LocationList from  "@/components/locations/LocationList";
import { Metadata } from "next";
import React from "react"; 

export const metadata: Metadata = {
    title: "Your Warehouse | Steven Ortega Consumer Goods Trading",
    description: "This will manage the poducts",
};

export default function BlankPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Locations" /> 
      <LocationList />   
    
    </div>
  );
}
