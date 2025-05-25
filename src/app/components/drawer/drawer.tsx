"use client";

import * as React from "react";
import { Drawer } from "vaul";

type VaulDrawerProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  heightClass?: string;
  desktopHeightClass?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function QmDrawer({
  trigger,
  children,
  title,
  heightClass = "h-auto",
  desktopHeightClass = "h-auto", //(h-auto or h-full only)
  open,
  onOpenChange,
}: VaulDrawerProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          aria-describedby="Drawer Content"
          className={`bg-grayy-100 flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 outline-none ${heightClass} md:top-1/2 md:bottom-auto md:translate-y-[-80%] md:${desktopHeightClass} md:rounded-[10px] md:max-w-xl md:mx-auto ${
            !open ? "md:translate-y-[80%]" : ""
          }`}
        >
          <div className="p-4 bg-white rounded-t-[10px] md:rounded-[10px] flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-4 " />
            {title && (
              <Drawer.Title className="text-center text-lg font-semibold mb-4 text-gray-900">
                {title}
              </Drawer.Title>
            )}
            <div className="pb-6">{children}</div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
