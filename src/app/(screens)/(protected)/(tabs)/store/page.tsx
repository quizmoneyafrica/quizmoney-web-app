"use client";
import { Grid } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./productCard";
import StoreAPI from "@/app/api/storeApi";
import { Product } from "@/app/api/interface";
import AppLoader from "@/app/components/loader/loader";

const mockProduct = [
  {
    productImage: {
      __type: "File",
      name: "3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
      url: "https://parsefiles.back4app.com/dowjS3cNrNj5Vw20BJARrzFjP6NWYTjSmCqA64XU/3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
    },
    productDescription: "Let you correct wrong answers in the game.",
    productName: "Eraser",
    productPrice: 100,
    productQuantity: 1,
    productCategory: "eraser",
    stock: "in stock",
    createdAt: "2024-04-26T03:48:40.804Z",
    updatedAt: "2024-04-26T03:48:40.804Z",
    objectId: "56nNdh0lAJ",
    __type: "Object",
    className: "Products",
  },
  {
    productImage: {
      __type: "File",
      name: "3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
      url: "https://parsefiles.back4app.com/dowjS3cNrNj5Vw20BJARrzFjP6NWYTjSmCqA64XU/3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
    },
    productDescription: "Let you correct wrong answers in the game.",
    productName: "Eraser",
    productPrice: 100,
    productQuantity: 1,
    productCategory: "eraser",
    stock: "in stock",
    createdAt: "2024-04-26T03:48:40.804Z",
    updatedAt: "2024-11-11T13:54:39.280Z",
    objectId: "8UiHc39QoO",
    __type: "Object",
    className: "Products",
  },
  {
    productImage: {
      __type: "File",
      name: "3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
      url: "https://parsefiles.back4app.com/dowjS3cNrNj5Vw20BJARrzFjP6NWYTjSmCqA64XU/3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
    },
    productDescription: "Let you correct wrong answers in the game.",
    productName: "Eraser",
    productPrice: 100,
    productQuantity: 1,
    productCategory: "eraser",
    stock: "in stock",
    createdAt: "2024-11-11T13:54:27.816Z",
    updatedAt: "2024-11-11T13:54:27.816Z",
    objectId: "AXX3a3JrJk",
    __type: "Object",
    className: "Products",
  },
  {
    productImage: {
      __type: "File",
      name: "3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
      url: "https://parsefiles.back4app.com/dowjS3cNrNj5Vw20BJARrzFjP6NWYTjSmCqA64XU/3afd95340def28c119870a682b8ba5f9_Solomonwole.png",
    },
    productDescription: "Let you correct wrong answers in the game.",
    productName: "Eraser",
    productPrice: 100,
    productQuantity: 1,
    productCategory: "eraser",
    stock: "in stock",
    createdAt: "2024-11-11T13:54:27.816Z",
    updatedAt: "2024-11-11T13:54:37.010Z",
    objectId: "pf5NeBWiju",
    __type: "Object",
    className: "Products",
  },
];
function Page() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    StoreAPI.getProducts().then((res) => {
      console.log(res.data);
      setLoading(false);
      setProducts(res.data.results.allProducts);
    });
  }, []);
  if (loading) {
    return <AppLoader />;
  }
  console.log(products);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="p-4 space-y-6 bg-zinc-50  min-h-[100dvh] pb-40">
        <p>Get more erasers to stay in the game</p>

        <Grid
          columns={{
            initial: "1",
            md: "2",
            lg: "3",
          }}
          gap={"20px"}
        >
          {mockProduct.map((product) => (
            <ProductCard key={product.objectId} product={product} />
          ))}
        </Grid>
      </div>
    </motion.div>
  );
}

export default Page;
