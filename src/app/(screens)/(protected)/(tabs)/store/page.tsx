"use client";
import { Grid } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./productCard";
import StoreAPI from "@/app/api/storeApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { setStoreProducts } from "@/app/store/storeSlice";
import ProductSkeleton from "./productSkeleton";

function Page() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.store.products);
  const loading = products === null;

  useEffect(() => {
    if (!products) {
      StoreAPI.getProducts()
        .then((res) => {
          dispatch(setStoreProducts(res.data.result.allProducts));
        })
        .catch((err) => {
          console.error("Error fetching products:", err);
        });
    }
  }, [dispatch, products]);

  if (loading) {
    return <ProductSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="sm:p-4 space-y-6 min-h-[100dvh] pb-40">
        <p className="text-sm text-neutral-600">
          Erasers are single use per game. Stock up to get more chances.
        </p>

        <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap={"20px"}>
          {products?.map((product, index) => (
            <ProductCard
              key={product.objectId}
              product={product}
              index={index}
            />
          ))}
        </Grid>
      </div>
    </motion.div>
  );
}

export default Page;
