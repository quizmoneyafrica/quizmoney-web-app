import React from "react";

export default function WithdrawalAccounts() {
  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Withdrawal Accounts</h2>
      <div className="space-y-4">
        {[1, 2].map((_, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p className="text-lg">15** **** **7</p>
              <div className="flex items-center gap-2">
                <p>JOSEPH MICHEAL.O</p>
                <span>Access Bank</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <span>🔗</span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded text-red-500">
                <span>🗑</span>
              </button>
            </div>
          </div>
        ))}
        <button className="w-full border-2 border-dashed border-gray-300 p-4 rounded-lg text-gray-500 hover:bg-gray-50">
          + Add new Bank
        </button>
      </div>
    </div>
  );
}
