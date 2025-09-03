"use client";

import React, { useState } from "react";
import { useModal } from "@/contexts/ModalContext";
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
  totalInvestment?: number; // Add optional totalInvestment for calculation
}

export default function BuySharesButtonClient({ franchiseData }: { franchiseData: FranchiseData }) {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { isSignedIn } = useUser();
  const { openSOLPaymentModal } = useModal();

  return (
    <>
      <button
        className="flex-1 bg-primary text-white dark:bg-stone-100 dark:text-stone-900 py-3 rounded-lg font-medium hover:bg-primary/90 dark:hover:bg-stone-200 transition-colors"
        onClick={() => {
          if (isSignedIn) {
            openSOLPaymentModal({ franchiseData });
          } else {
            setShowEmailModal(true);
          }
        }}
      >
        Buy Shares
      </button>
      {!isSignedIn && (
        <EmailVerificationModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
        />
      )}
      {/* <PhoneVerificationModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
      /> */}
    </>
  );
} 