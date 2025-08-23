"use client";

import React, { useState } from 'react';
import { useModal } from '@/contexts/ModalContext';
import SendSOLModal from '@/components/wallet/SendSOLModal';
import SOLPaymentModal from '@/components/franchise/SOLPaymentModal';
import CreateFranchiseModal from '@/components/modals/CreateFranchiseModalTest';
import TypeformCreateFranchiseModal from '@/components/modals/CreateFranchiseModal';
import TypeformRegisterBrandModal from '@/components/modals/RegisterBrandModal';
import MobileMenuModal from '@/components/modals/MobileMenuModal';
import AccountSelectionModal from '@/components/modals/AccountSelectionModal';
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

  // Mobile Profile Modal is no longer used - functionality moved to other modals

  // Render Create Franchise Modal
  if (currentModal === 'createFranchise') {
    return (
      <CreateFranchiseModal
        isOpen={true}
        onClose={closeModal}
      />
    );
  }

  // Render Typeform Create Franchise Modal
  if (currentModal === 'typeformCreateFranchise') {
    return (
      <TypeformCreateFranchiseModal
        isOpen={true}
        onClose={closeModal}
        brandSlug={modalData.typeformCreateFranchise?.brandSlug}
      />
    );
  }

  // Render Typeform Register Brand Modal
  if (currentModal === 'typeformRegisterBrand') {
    return (
      <TypeformRegisterBrandModal
        isOpen={true}
        onClose={closeModal}
      />
    );
  }

  // Render Mobile Menu Modal
  if (currentModal === 'mobileMenu') {
    return (
      <>
        <MobileMenuModal
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

  // Render Account Selection Modal
  if (currentModal === 'accountSelection') {
    return (
      <AccountSelectionModal
        isOpen={true}
        onClose={closeModal}
      />
    );
  }

  // No modal to render
  return null;
};

export default ModalManager;
