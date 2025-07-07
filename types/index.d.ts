export interface UserProfile {
  id?: string;
  avatar: string;
  full_name: string;
  location: string;
  formatted_address: string;
  area: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  profession: string;
  annual_income: string;
  investment_budget: string;
  phone: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PhoneSession {
  userId: string;
  secret?: string;
  expire?: string;
}

// Extend the Account type from Appwrite to include phone methods
declare module 'appwrite' {
  interface Account {
    createPhoneSession(userId: string, phone: string): Promise<PhoneSession>;
    updatePhoneSession(userId: string, secret: string): Promise<any>;
  }
} 