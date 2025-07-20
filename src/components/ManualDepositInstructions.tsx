// src/components/ManualDepositInstructions.tsx

import React from "react";

const ManualDepositInstructions = () => {
  return (
    <div className="space-y-2 text-sm text-white bg-slate-900 border border-orange-500 p-4 rounded-lg">
      <p><strong>Manual Deposit Instructions</strong></p>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>Business Number:</strong> 984522</li>
        <li><strong>Account Number:</strong> Your phone number or registered email</li>
        <li><strong>Amount:</strong> Your desired deposit amount (minimum $17)</li>
        <li><strong>Currency:</strong> USD or KES accepted</li>
      </ul>
      <p className="text-orange-400 text-xs mt-2">
        After sending, email proof of payment to <strong>finance@tradify.app</strong>
      </p>
    </div>
  );
};

export default ManualDepositInstructions;
