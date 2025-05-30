"use client";
import { Grid, Skeleton } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "./productCard";
import StoreAPI from "@/app/api/storeApi";
import { useAppDispatch, useAppSelector } from "@/app/hooks/useAuth";
import { setStoreProducts } from "@/app/store/storeSlice";

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
    return (
      <div className="p-4 space-y-6 bg-zinc-50  min-h-[100dvh]">
        <Skeleton width={{ initial: "100px", md: "300px" }} height={"20px"} />
        <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap={"20px"}>
          {Array(6)
            .fill(3)
            .map((_, idx) => (
              <div
                key={idx}
                className="h-[187px] md:h-[217px] bg-white border-zinc-200 border rounded-3xl p-8"
              >
                <div className="flex justify-between">
                  <div className="flex-1 space-y-7">
                    <div className="space-y-3">
                      <Skeleton
                        width={{ initial: "70px", md: "130px" }}
                        height={"15px"}
                      />
                      <Skeleton
                        width={{ initial: "80%", md: "80%" }}
                        height={"15px"}
                      />
                      <Skeleton
                        width={{ initial: "70px", md: "130px" }}
                        height={"15px"}
                      />
                    </div>
                    <div className="h-[40px] w-[100px] rounded-xl overflow-clip">
                      <Skeleton width={"100%"} height={"100%"} />
                    </div>
                  </div>
                  <div className="flex-[.4]">
                    <div className="h-[80%] w-full rounded-xl overflow-clip">
                      <Skeleton width={"100%"} height={"100%"} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </Grid>
      </div>
    );
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
