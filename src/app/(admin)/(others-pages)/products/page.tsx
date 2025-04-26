import PageBreadcrumb from "@/components/common/PageBreadCrumb";  
import RecentOrders from "@/components/products/ProductList";
import { Metadata } from "next";
import React, { Suspense } from "react"; // 👈 import Suspense!

export const metadata: Metadata = {
  title: "Products | Steven Ortega Consumer Goods Trading",
  description: "This will manage the products",
};

export default function BlankPage() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Products" />
          <div className="space-y-6">
            <Suspense fallback={<div>Loading products...</div>}>
              <RecentOrders />
            </Suspense>
          </div>
        </div>
    );
}
