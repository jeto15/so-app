import PageBreadcrumb from "@/components/common/PageBreadCrumb";  
import RecentOrders from  "@/components/products/ProductList";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Steven Ortega Inventory",
  description: "This will manage the poducts",
};

export default function BlankPage() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Products" />
          <div className="space-y-6">
           <RecentOrders />
          </div>
        </div>
    );
}
