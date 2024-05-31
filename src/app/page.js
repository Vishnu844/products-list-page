"use client";

import { useState } from "react";
import Head from "next/head";
import useSWR from "swr";
import Loading from "./components/loading";
import Modal from "./components/modal";
import Rating from "./components/rating";
import Product from "./components/product";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home() {
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data, error, isLoading } = useSWR(
    "https://fakestoreapi.com/products",
    fetcher
  );

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <img className="size-1/2" src="/images/error.svg" />
      </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }

  const filteredProducts = data.filter((product) =>
    product.title.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const handleModal = () => {
    setSelectedProduct(null);
  };

  const handleModalData = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Head>
        <title>Product Listing</title>
      </Head>

      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Product Listing</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Product product={product} handleModalData={handleModalData} />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <Modal selectedProduct={selectedProduct} handleModal={handleModal} />
      )}
    </div>
  );
}
