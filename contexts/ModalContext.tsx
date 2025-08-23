"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Modal types
export type ModalType =
  | 'sendSOL'
  | 'solPayment'
  | 'walletConnect'
  | 'mobileProfile'
  | 'createFranchise'
  | 'typeformCreateFranchise'
  | 'typeformRegisterBrand'
  | 'userOnboarding'
  | 'mobileMenu'
  | 'accountSelection'
  | null;

// Modal data interfaces
export interface SendSOLModalData {
  onSuccess?: (signature: string) => void;
}

export interface SOLPaymentModalData {
  franchiseData: {
    name: string;
    logo: string;
    address: string;
    totalShares: number;
    soldShares: number;
    costPerShare: number;
    franchiseId: string;
  };
}

export interface MobileProfileModalData {
  onSettingsClick?: () => void;
}

export interface UserOnboardingModalData {
  onComplete?: (userType: 'investor' | 'brand_owner') => void;
}

export interface ModalData {
  sendSOL?: SendSOLModalData;
  solPayment?: SOLPaymentModalData;
  mobileProfile?: MobileProfileModalData;
  createFranchise?: {};
  typeformCreateFranchise?: { brandSlug?: string };
  typeformRegisterBrand?: {};
  userOnboarding?: UserOnboardingModalData;
  mobileMenu?: MobileProfileModalData;
  accountSelection?: {};
}

// Context interface
interface ModalContextType {
  // Current modal state
  currentModal: ModalType;
  modalData: ModalData;
  
  // Modal actions
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  
  // Specific modal openers
  openSendSOLModal: (data?: SendSOLModalData) => void;
  openSOLPaymentModal: (data: SOLPaymentModalData) => void;
  openMobileProfileModal: (data?: MobileProfileModalData) => void;
  openCreateFranchiseModal: () => void;
  openTypeformCreateFranchiseModal: (brandSlug?: string) => void;
  openTypeformRegisterBrandModal: () => void;
  openUserOnboardingModal: (data?: UserOnboardingModalData) => void;
  openMobileMenuModal: (data?: MobileProfileModalData) => void;
  openAccountSelectionModal: () => void;
}

// Create context
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<ModalData>({});

  const openModal = (type: ModalType, data: ModalData = {}) => {
    setCurrentModal(type);
    setModalData(data);
  };

  const closeModal = () => {
    setCurrentModal(null);
    setModalData({});
  };

  const openSendSOLModal = (data: SendSOLModalData = {}) => {
    openModal('sendSOL', { sendSOL: data });
  };

  const openSOLPaymentModal = (data: SOLPaymentModalData) => {
    openModal('solPayment', { solPayment: data });
  };

  const openMobileProfileModal = (data: MobileProfileModalData = {}) => {
    openModal('mobileProfile', { mobileProfile: data });
  };

  const openCreateFranchiseModal = () => {
    openModal('createFranchise', { createFranchise: {} });
  };

  const openTypeformCreateFranchiseModal = (brandSlug?: string) => {
    openModal('typeformCreateFranchise', { typeformCreateFranchise: { brandSlug } });
  };

  const openTypeformRegisterBrandModal = () => {
    openModal('typeformRegisterBrand', { typeformRegisterBrand: {} });
  };

  const openUserOnboardingModal = (data: UserOnboardingModalData = {}) => {
    openModal('userOnboarding', { userOnboarding: data });
  };

  const openMobileMenuModal = (data: MobileProfileModalData = {}) => {
    openModal('mobileMenu', { mobileMenu: data });
  };

  const openAccountSelectionModal = () => {
    openModal('accountSelection', { accountSelection: {} });
  };

  const value: ModalContextType = {
    currentModal,
    modalData,
    openModal,
    closeModal,
    openSendSOLModal,
    openSOLPaymentModal,
    openMobileProfileModal,
    openCreateFranchiseModal,
    openTypeformCreateFranchiseModal,
    openTypeformRegisterBrandModal,
    openUserOnboardingModal,
    openMobileMenuModal,
    openAccountSelectionModal,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

// Hook to use modal context
export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Export types for use in components
export type { ModalContextType };
