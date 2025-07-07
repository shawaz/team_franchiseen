"use client";

import React, { useState } from "react";
import PaymentModal from "./PaymentModal";
import EmailVerificationModal from "../EmailVerificationModal";
import { useUser } from "@clerk/nextjs";

interface FranchiseData {
  name: string;
  logo: string;
  address: string;
  totalShares: number;
  soldShares: number;
  costPerShare: number;
  franchiseId: string;
}

export default function BuySharesButtonClient({ franchiseData }: { franchiseData: FranchiseData }) {
  const [showModal, setShowModal] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <>
      <button
        className="flex-1 bg-primary text-white dark:bg-stone-100 dark:text-stone-900 py-3 rounded-lg font-medium hover:bg-primary/90 dark:hover:bg-stone-200 transition-colors"
        onClick={() => setShowModal(true)}
      >
        Buy Shares
      </button>
      {isSignedIn ? (
        <PaymentModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          franchiseData={franchiseData}
        />
      ) : (
        <EmailVerificationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
      /> */}
    </>
  );
} 