"use client";
import { Grid } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "./productCard";
import StoreAPI from "@/app/api/storeApi";
import { Product } from "@/app/api/interface";
import AppLoader from "@/app/components/loader/loader";

function Page() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setLoading(true);
    StoreAPI.getProducts().then((res) => {
      console.log(res.data);
      setLoading(false);
      setProducts(res.data.result.allProducts);
    });
  }, []);
  if (loading) {
    return <AppLoader />;
  }

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
          {products.map((product) => (
            <ProductCard key={product.objectId} product={product} />
          ))}
        </Grid>
      </div>
    </motion.div>
  );
}

export default Page;
