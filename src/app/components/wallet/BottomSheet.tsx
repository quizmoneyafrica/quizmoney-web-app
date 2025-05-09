import { ReactNode } from "react";

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed z-[100] inset-0">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 bg-opacity-40"
        onClick={onClose}
      />

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg p-5 pb-8 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6" />

        {title && (
          <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
};
