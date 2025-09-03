"use client";

import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider } from '@coral-xyz/anchor';
import { validateAnchorSetup } from '@/lib/anchor/franchise-program';
import { useFranchiseProgram } from '@/hooks/useFranchiseProgram';

export default function AnchorDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const { connection } = useConnection();
  const wallet = useWallet();
  const { program, connected: programConnected } = useFranchiseProgram();

  useEffect(() => {
    const runDebug = async () => {
      try {
        // Test Anchor setup validation
        const validation = validateAnchorSetup();
        
        // Test provider creation
        let providerStatus = 'Not available';
        let providerError = null;
        
        if (wallet.publicKey && wallet.signTransaction && connection) {
          try {
            const provider = new AnchorProvider(
              connection,
              {
                publicKey: wallet.publicKey,
                signTransaction: wallet.signTransaction,
                signAllTransactions: wallet.signAllTransactions || (async (txs) => {
                  const signedTxs = [];
                  for (const tx of txs) {
                    signedTxs.push(await wallet.signTransaction!(tx));
                  }
                  return signedTxs;
                }),
              },
              { commitment: 'confirmed' }
            );
            providerStatus = 'Available';
          } catch (error) {
            providerStatus = 'Error';
            providerError = error instanceof Error ? error.message : 'Unknown error';
          }
        } else {
          providerStatus = 'Wallet not connected';
        }

        setDebugInfo({
          validation,
          wallet: {
            connected: wallet.connected,
            publicKey: wallet.publicKey?.toString(),
            hasSignTransaction: !!wallet.signTransaction,
          },
          connection: {
            rpcEndpoint: connection.rpcEndpoint,
            commitment: connection.commitment,
          },
          provider: {
            status: providerStatus,
            error: providerError,
          },
          program: {
            available: !!program,
            connected: programConnected,
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    };

    runDebug();
  }, [connection, wallet, program, programConnected]);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show debug info in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">Anchor Debug Info</h3>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}
