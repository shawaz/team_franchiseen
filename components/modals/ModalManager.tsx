"use client";

import React from 'react';
import { useModal } from '@/contexts/ModalContext';
import SendSOLModal from '@/components/wallet/SendSOLModal';
import SOLPaymentModal from '@/components/franchise/SOLPaymentModal';

/**
 * Centralized Modal Manager
 * 
 * This component manages all modals in the application from a single location.
 * It listens to the modal context and renders the appropriate modal based on the current state.
 */
const ModalManager: React.FC = () => {
  const { currentModal, modalData, closeModal } = useModal();

  // Render Send SOL Modal
  if (currentModal === 'sendSOL') {
    return (
      <SendSOLModal
        onClose={closeModal}
        onSuccess={modalData.sendSOL?.onSuccess}
      />
    );
  }

  // Render SOL Payment Modal
  if (currentModal === 'solPayment') {
    const franchiseData = modalData.solPayment?.franchiseData;

    if (!franchiseData) {
      console.error('SOL Payment Modal opened without franchise data');
      closeModal();
      return null;
    }

    return (
      <SOLPaymentModal
        onClose={closeModal}
        franchiseData={franchiseData}
      />
    );
  }

  // No modal to render
  return null;
};

export default ModalManager;
