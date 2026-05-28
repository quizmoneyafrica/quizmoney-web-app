"use client";
import React from "react";
import { Grid, Skeleton } from "@radix-ui/themes";
import { Package, ShoppingBag, Eraser as EraserIcon } from "lucide-react";
import { useStoreInventory } from "@/lib/queries";
import { InventoryEntry } from "@/app/api/storeApi";
import CustomButton from "@/app/utils/CustomBtn";

const displayColor = [
  { bg: "bg-[#ECF6FD]", text: "text-[#2A75BC]", badge: "bg-[#17478B]", border: "border-[#2980D6]" },
  { bg: "bg-[#E7FEED]", text: "text-[#00C449]", badge: "bg-[#009028]", border: "border-[#00B23D]" },
  { bg: "bg-[#F6E4F6]", text: "text-[#85119F]", badge: "bg-[#85119F]", border: "border-[#9817A6]" },
  { bg: "bg-[#FFEAEE]", text: "text-[#DE1528]", badge: "bg-[#C30012]", border: "border-[#DE1528]" },
  { bg: "bg-[#DFF9FF]", text: "text-[#00BBE3]", badge: "bg-[#00BBE3]", border: "border-[#00BBE3]" },
  { bg: "bg-[#FFFCE7]", text: "text-[#F8B93C]", badge: "bg-[#F8B93C]", border: "border-[#F4A235]" },
];

function InventoryCard({ entry, index }: { entry: InventoryEntry; index: number }) {
  const colors = displayColor[index % displayColor.length];
  const lastUpdated = new Date(entry.updated_at).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className={`relative ${colors.bg} ${colors.border} border-2 rounded-3xl p-5 overflow-hidden`}
    >
      {/* Watermark icon */}
      <EraserIcon
        size={80}
        className={`absolute -bottom-3 -right-3 ${colors.text} opacity-10`}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header row: name + quantity badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`${colors.text} text-xl font-bold leading-tight`}>
              {entry.item.name}
            </p>
            {entry.item.description && (
              <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                {entry.item.description}
              </p>
            )}
          </div>
          <div
            className={`${colors.badge} text-white rounded-2xl px-3 py-1.5 text-center min-w-[56px] shrink-0`}
          >
            <p className="text-xl font-bold leading-none">{entry.quantity}</p>
            <p className="text-[10px] font-medium opacity-90 mt-0.5">owned</p>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t ${colors.border}`} />

        {/* Footer: item type + last updated */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold ${colors.text} bg-white ${colors.border} border rounded-full px-2.5 py-1`}
          >
            <Package size={11} />
            {entry.item.item_type.replace(/_/g, " ")}
          </span>
          <span className="text-[11px] text-neutral-400">
            Updated {lastUpdated}
          </span>
        </div>
      </div>
    </div>
  );
}

function InventorySkeleton() {
  return (
    <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="20px">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="h-[148px] bg-white border border-neutral-200 rounded-3xl p-5 space-y-3"
          >
            <div className="flex justify-between">
              <div className="space-y-2 flex-1">
                <Skeleton width="120px" height="18px" />
                <Skeleton width="80px" height="12px" />
              </div>
              <Skeleton width="56px" height="56px" />
            </div>
            <Skeleton width="100%" height="1px" />
            <div className="flex justify-between">
              <Skeleton width="80px" height="24px" />
              <Skeleton width="90px" height="12px" />
            </div>
          </div>
        ))}
    </Grid>
  );
}

function EmptyInventory({ onShopClick }: { onShopClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-5">
        <ShoppingBag size={32} className="text-neutral-400" />
      </div>
      <p className="font-bold text-neutral-800 text-lg">Your inventory is empty</p>
      <p className="text-sm text-neutral-400 mt-1.5 mb-6 max-w-[240px]">
        Head to the shop and pick up some erasers to use in your next game.
      </p>
      <CustomButton onClick={onShopClick} className="!px-8">
        Go Shopping
      </CustomButton>
    </div>
  );
}

export default function Inventory({ onShopClick }: { onShopClick: () => void }) {
  const { data: inventory, isLoading } = useStoreInventory();

  if (isLoading) return <InventorySkeleton />;

  if (!inventory || inventory.length === 0) {
    return <EmptyInventory onShopClick={onShopClick} />;
  }

  const totalItems = inventory.reduce((sum: number, entry: InventoryEntry) => sum + entry.quantity, 0);

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-2xl px-4 py-3">
        <Package size={16} className="text-primary-600" />
        <p className="text-sm font-semibold text-primary-800">
          You own{" "}
          <span className="text-primary-900 font-bold">{totalItems}</span>{" "}
          item{totalItems !== 1 ? "s" : ""} across{" "}
          <span className="text-primary-900 font-bold">{inventory.length}</span>{" "}
          type{inventory.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Cards grid */}
      <Grid columns={{ initial: "1", md: "2", lg: "3" }} gap="20px">
        {inventory.map((entry: InventoryEntry, index: number) => (
          <InventoryCard key={entry.inventory_id} entry={entry} index={index} />
        ))}
      </Grid>
    </div>
  );
}
