"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface ResponsiveDialogProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export default function ResponsiveDialog({
  trigger,
  children,
  title,
  description,
  open,
  onOpenChange,
  className,
}: ResponsiveDialogProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect if we're on mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        {/* Overlay/Backdrop */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Content - Modal for desktop, Bottom sheet for mobile */}
        <Dialog.Content
          className={`
            fixed z-50 bg-white min-h-[400px] outline-none
            data-[state=open]:animate-in data-[state=closed]:animate-out duration-200
            ${
              isMobile
                ? "inset-x-0 bottom-0 rounded-t-lg w-full max-w-full data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
                : "top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 rounded-lg data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 max-w-lg w-full shadow-lg"
            }
            ${className}
          `}
        >
          {/* Header Area */}
          {(title || description) && (
            <div className="p-6 pb-2">
              {title && (
                <Dialog.Title className="text-lg font-medium text-gray-900 ">
                  {title}
                </Dialog.Title>
              )}
              {description && (
                <Dialog.Description className="mt-1 text-sm text-gray-500 ">
                  {description}
                </Dialog.Description>
              )}
            </div>
          )}

          {/* Content Area */}
          <div
            className={`p-6 pt-0 ${
              isMobile ? "max-h-[75vh] overflow-y-auto" : ""
            }`}
          >
            {children}
          </div>
          {/* Close Button */}
          <Dialog.Close className="absolute right-9 top-5 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none  disabled:pointer-events-none">
            <div className="text-2xl ">x</div>
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
