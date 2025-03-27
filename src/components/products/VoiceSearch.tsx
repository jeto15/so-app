// import { useState } from "react";
// import VoiceSearch from "./VoiceSearch"; // Import the component

// export default function ProductList() {
//   const [searchQuery, setSearchQuery] = useState("");

//   // Dummy product list
//   const products = [
//     { id: 1, name: "Laptop" },
//     { id: 2, name: "Mouse" },
//     { id: 3, name: "Keyboard" },
//     { id: 4, name: "Monitor" },
//   ];

//   // Filter products based on search query
//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div>
//       <h2>Product Inventory</h2>
//       <VoiceSearch onSearch={setSearchQuery} />

//       <ul>
//         {filteredProducts.length > 0 ? (
//           filteredProducts.map((product) => <li key={product.id}>{product.name}</li>)
//         ) : (
//           <li>No products found</li>
//         )}
//       </ul>
//     </div>
//   );
// }
