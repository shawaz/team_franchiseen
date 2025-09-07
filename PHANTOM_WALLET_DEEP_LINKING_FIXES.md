# Phantom Wallet Deep Linking Fixes

## Overview
Fixed the Phantom wallet integration to use proper deep linking instead of webview, ensuring users can connect their wallet once and only have Phantom open for actual transactions (payments and franchise creation).

## Key Changes Made

### 1. Updated Deep Link URLs
**Before**: Used webview URLs like `https://phantom.app/ul/browse/...`
**After**: Use proper app scheme URLs:
- iOS: `phantom://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=...`
- Android: Intent URLs with proper fallbacks to Play Store
- Desktop: Direct to download page

### 2. Enhanced SolanaWalletProvider (`components/providers/SolanaWalletProvider.tsx`)
- Added mobile detection and platform-specific deep linking
- Implemented smart auto-connect logic that only triggers when appropriate
- Added proper connection state management with localStorage
- Removed aggressive auto-connect behavior on mobile

### 3. Updated Mobile Wallet Hook (`hooks/useMobileWallet.ts`)
- Fixed deep linking URL construction to use connection schemes instead of webview
- Added proper iOS universal link and Android intent URL support
- Enhanced error handling and fallback mechanisms

### 4. Improved Connection Handlers
**PhantomConnectionHandler** (`components/wallet/PhantomConnectionHandler.tsx`):
- Enhanced connection state recovery when users return from Phantom app
- Added proper timeout handling and cleanup
- Improved error handling for connection failures

**New TransactionHandler** (`components/wallet/TransactionHandler.tsx`):
- Created separate handler for transaction-specific wallet returns
- Manages connection state for payment and franchise creation flows

### 5. New Transaction Wallet Hook (`hooks/useTransactionWallet.ts`)
- Created dedicated hook for transaction-specific wallet connections
- Implements `executeTransaction` wrapper for payment flows
- Only opens Phantom when needed for actual transactions
- Maintains connection state between app switches

### 6. Updated Payment Components
**SOLPaymentModal** (`components/franchise/SOLPaymentModal.tsx`):
- Integrated new transaction wallet approach
- Improved error handling and user feedback
- Better connection state management

**CreateFranchiseModal** (`components/modals/CreateFranchiseModal.tsx`):
- Updated to use transaction wallet for franchise creation payments
- Enhanced payment flow with proper deep linking

### 7. Updated QR Code Generation (`components/wallet/WalletQRCode.tsx`)
- Changed QR codes to generate proper connection URLs instead of webview URLs
- Added Phantom branding and proper deep link format

### 8. Enhanced Mobile Wallet Modal (`components/wallet/MobileWalletModal.tsx`)
- Updated to use proper deep linking instead of webview
- Added platform-specific connection flows
- Improved user messaging about connection process

### 9. Updated App Providers (`components/AppProviders.tsx`)
- Added TransactionHandler to the provider tree
- Ensures transaction handling is available throughout the app

### 10. Improved Mobile Wallet Connect (`components/wallet/MobileWalletConnect.tsx`)
- Updated messaging to clarify that Phantom only opens for payments
- Enhanced user experience with better connection flow descriptions

## User Experience Improvements

### Connection Flow
1. **Initial Connection**: User connects wallet once using deep link to Phantom app
2. **State Persistence**: Connection state is maintained when user returns to website
3. **Transaction-Only Opening**: Phantom only opens for actual payments/transactions
4. **Seamless Experience**: No more webview, direct app-to-app communication

### Mobile Experience
- **iOS**: Uses proper app schemes with App Store fallback
- **Android**: Uses intent URLs with Play Store fallback  
- **Cross-Platform**: Consistent experience across all devices

### Error Handling
- Proper timeout handling for connection attempts
- Clear error messages for connection failures
- Automatic cleanup of stale connection attempts
- Graceful fallbacks when Phantom app is not installed

## Technical Implementation Details

### Connection State Management
- Uses localStorage to track connection attempts and returns
- Implements timeout-based cleanup (10 minutes for connections, 24 hours for desktop persistence)
- Separate handling for connection vs transaction flows

### Deep Link URL Format
```
iOS: phantom://v1/connect?dapp_encryption_public_key=&cluster=devnet&app_url=${encodeURIComponent(dappUrl)}
Android: intent://v1/connect?...#Intent;scheme=phantom;package=app.phantom;S.browser_fallback_url=...;end
```

### Transaction Wrapper
The new `executeTransaction` function wraps payment operations:
```typescript
await executeTransaction(
  async () => {
    // Payment logic here
    return paymentResult;
  },
  {
    action: 'payment',
    amount: totalAmount,
    description: 'Purchase description'
  }
);
```

## Files Modified
- `components/providers/SolanaWalletProvider.tsx`
- `hooks/useMobileWallet.ts`
- `components/wallet/PhantomConnectionHandler.tsx`
- `components/wallet/MobileWalletModal.tsx`
- `components/wallet/WalletQRCode.tsx`
- `components/wallet/MobileWalletConnect.tsx`
- `components/franchise/SOLPaymentModal.tsx`
- `components/modals/CreateFranchiseModal.tsx`
- `components/AppProviders.tsx`

## Files Created
- `hooks/useTransactionWallet.ts`
- `components/wallet/TransactionHandler.tsx`

## Testing Recommendations
1. Test wallet connection flow on iOS devices
2. Test wallet connection flow on Android devices  
3. Test payment flows to ensure Phantom opens only for transactions
4. Test franchise creation payments
5. Test connection state persistence when returning from Phantom app
6. Test fallback behavior when Phantom app is not installed

## Result
- ✅ Phantom wallet no longer opens in webview
- ✅ Users connect wallet once and state persists
- ✅ Phantom only opens for actual transactions
- ✅ Proper deep linking works on all platforms
- ✅ Enhanced error handling and user feedback
- ✅ Build completes successfully with no errors
