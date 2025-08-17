# Solana Integration

This document describes the Solana wallet integration added to the Franchiseen platform.

## Features

### 🔗 Wallet Connection
- **Phantom Wallet Support**: Connect your Phantom wallet to the platform
- **Auto-connect**: Automatically reconnects to previously connected wallets
- **Multi-wallet Support**: Ready for additional wallet adapters

### 💰 Balance Display
- **Real-time SOL Balance**: Shows current SOL balance in your connected wallet
- **Auto-refresh**: Balance updates every 30 seconds
- **Network Support**: Works on Devnet, Testnet, and Mainnet

### 🚀 Devnet Features
- **Free SOL Airdrop**: Get 1 SOL instantly on devnet for testing
- **Faucet Integration**: Easy access to devnet SOL for development

### 💸 Transaction Features
- **Send SOL**: Send SOL to any Solana address
- **Transaction Confirmation**: Wait for transaction confirmation
- **Explorer Integration**: View transactions on Solana Explorer

## Components

### SolanaWalletProvider
- Wraps the app with Solana wallet context
- Configures network and RPC endpoint
- Provides wallet adapters

### SolanaWalletCard
- Displays SOL balance and wallet status
- Connect/disconnect wallet functionality
- Airdrop button for devnet
- Send SOL functionality

### SendSolModal
- Modal for sending SOL to other addresses
- Input validation and error handling
- Transaction status feedback

### useSolana Hook
- Custom hook for Solana operations
- Balance fetching
- Transaction sending
- Airdrop requests

## Environment Variables

```env
# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_PRIVATE_KEY=your_private_key_here
COMPANY_WALLET_ADDRESS=your_company_wallet_address
```

## Usage

### Profile Wallet Page
Navigate to `/profile/wallet` to see both traditional wallet and Solana wallet cards side by side.

### Connecting Wallet
1. Click "Connect Wallet" button
2. Select Phantom from the wallet list
3. Approve connection in Phantom
4. Your SOL balance will be displayed

### Getting Devnet SOL
1. Connect your wallet
2. Click "Get 1 SOL (Devnet)" button
3. Wait for transaction confirmation
4. Balance will update automatically

### Sending SOL
1. Click "Send SOL" button
2. Enter recipient address and amount
3. Confirm transaction in Phantom
4. Transaction will be processed

## Network Configuration

### Devnet (Default)
- Network: `devnet`
- RPC: `https://api.devnet.solana.com`
- Explorer: `https://explorer.solana.com?cluster=devnet`

### Mainnet
- Network: `mainnet-beta`
- RPC: `https://api.mainnet-beta.solana.com`
- Explorer: `https://explorer.solana.com`

## Security Notes

- Private keys are stored in environment variables
- Transactions require user approval in wallet
- All transactions are confirmed on-chain
- Network configuration prevents mainnet airdrops

## Future Enhancements

- [ ] SPL Token support
- [ ] NFT integration
- [ ] DeFi protocol integration
- [ ] Multi-signature wallet support
- [ ] Transaction history
- [ ] Advanced transaction features
