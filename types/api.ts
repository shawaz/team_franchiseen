export interface BaseDocument {
  _id: string;
  _creationTime: number;
}

export interface Invoice extends BaseDocument {
  createdAt: number;
  franchiseId: string;
  userId: string;
  serviceFee: number;
  gst: number;
  totalAmount: number;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  type: 'franchise' | 'funding' | 'payout';
  description?: string;
  paymentMethod?: string;
  transactionId?: string;
}

export interface User extends BaseDocument {
  firstName?: string;
  familyName?: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles?: string[];
  isActivated?: boolean;
  // Add other user fields as needed
}

export interface Business extends BaseDocument {
  name: string;
  logoUrl?: string;
  // Add other business fields as needed
}

export interface Share extends BaseDocument {
  userId: string;
  franchiseId: string;
  // Add other share fields as needed
}

export type FranchiseStatus = 'Pending Approval' | 'Approval' | 'Funding' | 'Launching' | 'Active' | 'Closed';

export interface BaseFranchise {
  _id: string;
  _creationTime: number;
  businessId: string;
  building: string;
  locationAddress?: string;
  status: FranchiseStatus | string; // Allow string for Convex document types
  launchStartDate?: number;
  launchEndDate?: number;
  owner_id: string;
  createdAt: number;
  costPerArea: number;
  totalInvestment?: number;
  carpetArea?: number;
  selectedShares?: number;
  totalShares?: number;
  // Add other franchise fields as needed
}

export type Franchise = BaseFranchise & {
  [key: string]: unknown; // Allow additional properties from Convex
};
