"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid } from "@radix-ui/themes";
import { ShoppingBag, Package, Ticket } from "lucide-react";
import ProductCard from "./productCard";
import ProductSkeleton from "./productSkeleton";
import Inventory from "./Inventory";
import ScratchCard from "./ScratchCard";
import { useStoreCatalogue } from "@/lib/queries";
import { StoreItem } from "@/app/api/storeApi";

type Tab = "shop" | "inventory" | "scratch";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "shop", label: "Shop", icon: <ShoppingBag size={15} /> },
  { id: "inventory", label: "My Items", icon: <Package size={15} /> },
  { id: "scratch", label: "Scratch Card", icon: <Ticket size={15} /> },
];

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<Tab>("shop");
  const { data: products, isLoading } = useStoreCatalogue();

  return (
    <div className="min-h-[100dvh] pb-40">
      {/* ─── Header ───────────────────────────────── */}
      <div className="sm:px-4 pt-2 pb-4">
        {/* <div className="flex items-center justify-between mb-1">
          {balance && (
            <div className="flex items-center gap-1.5 bg-primary-50 text-primary-900 px-3 py-1.5 rounded-full text-sm font-semibold">
              <span className="text-xs text-primary-600 font-normal">
                Balance
              </span>
              <span>{formatNaira(balance.ngn_balance)}</span>
            </div>
          )}
        </div> */}
        <p className="text-sm text-neutral-500">
          Power up your game — stock up on erasers and try your luck.
        </p>
      </div>

      {/* ─── Tab Bar ──────────────────────────────── */}
      <div className="sm:px-4 mb-5">
        <div className="flex bg-neutral-100 rounded-xl p-1 gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white text-primary-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">
                {tab.label.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ──────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          {activeTab === "shop" && (
            <div className="sm:px-4 space-y-4">
              <p className="text-sm text-neutral-500">
                Erasers let you skip a wrong answer during a live game. Stock up
                to get more chances.
              </p>
              {isLoading ? (
                <ProductSkeleton />
              ) : !products || products.length === 0 ? (
                <EmptyShop />
              ) : (
                <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="20px">
                  {(products as StoreItem[]).map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                    />
                  ))}
                </Grid>
              )}
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="sm:px-4">
              <Inventory onShopClick={() => setActiveTab("shop")} />
            </div>
          )}

          {activeTab === "scratch" && (
            <div className="sm:px-4">
              <ScratchCard />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EmptyShop() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <ShoppingBag size={28} className="text-neutral-400" />
      </div>
      <p className="font-semibold text-neutral-700">No items available</p>
      <p className="text-sm text-neutral-400 mt-1">
        Check back soon for new items.
      </p>
    </div>
  );
}
