"use client";

import React, { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import SendSOLModal from '@/components/wallet/SendSOLModal';
import SOLPaymentModal from '@/components/franchise/SOLPaymentModal';
import MobileProfileModal from '@/components/modals/MobileProfileModal';
import SettingsModal from '@/components/modals/SettingsModal';

/**
 * Centralized Modal Manager
 * 
 * This component manages all modals in the application from a single location.
 * It listens to the modal context and renders the appropriate modal based on the current state.
 */
const ModalManager: React.FC = () => {
  const { currentModal, modalData, closeModal } = useModal();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsModalTab, setSettingsModalTab] = useState<'currency' | 'theme'>('theme');

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

  // Render Mobile Profile Modal
  if (currentModal === 'mobileProfile') {
    return (
      <>
        <MobileProfileModal
          isOpen={true}
          onClose={closeModal}
          onSettingsClick={() => {
            setSettingsModalTab('theme');
            setIsSettingsModalOpen(true);
          }}
        />
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          initialTab={settingsModalTab}
        />
      </>
    );
  }

  // No modal to render
  return null;
};

export default ModalManager;
