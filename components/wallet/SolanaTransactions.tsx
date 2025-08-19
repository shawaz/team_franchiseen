"use client";

import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { ParsedTransactionWithMeta } from "@solana/web3.js";
import Table from "@/components/ui/table/Table";
import TableHead from "@/components/ui/table/TableHead";
import TableBody from "@/components/ui/table/TableBody";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { ArrowDownCircle, ArrowUpCircle, ExternalLink, RefreshCw } from "lucide-react";
import { useSolOnly } from "@/contexts/SolOnlyContext";

interface SolanaTransaction {
  signature: string;
  slot: number;
  blockTime: number | null;
  fee: number;
  amount: number;
  type: "send" | "receive" | "fee";
  status: "success" | "failed";
  from?: string;
  to?: string;
}

export default function SolanaTransactions() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { formatSol } = useSolOnly();
  const [transactions, setTransactions] = useState<SolanaTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!publicKey) return;

    setLoading(true);
    setError(null);

    try {
      const signatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit: 20 }
      );

      const transactionDetails = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await connection.getParsedTransaction(sig.signature, {
              maxSupportedTransactionVersion: 0,
            });
            return { signature: sig, transaction: tx };
          } catch (error) {
            console.error(`Error fetching transaction ${sig.signature}:`, error);
            return null;
          }
        })
      );

      const parsedTransactions: SolanaTransaction[] = transactionDetails
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item): item is { signature: any; transaction: ParsedTransactionWithMeta } =>
          item !== null && item.transaction !== null
        )
        .map(({ signature, transaction }) => {
          const { meta, transaction: txData } = transaction;
          const accountKeys = txData.message.accountKeys.map(key => key.pubkey.toString());
          const userAccountIndex = accountKeys.indexOf(publicKey.toString());
          
          let amount = 0;
          let type: "send" | "receive" | "fee" = "fee";
          let from = "";
          let to = "";

          if (meta?.preBalances && meta?.postBalances && userAccountIndex !== -1) {
            const preBalance = meta.preBalances[userAccountIndex];
            const postBalance = meta.postBalances[userAccountIndex];
            const balanceChange = postBalance - preBalance;
            
            if (balanceChange > 0) {
              type = "receive";
              amount = balanceChange / 1e9; // Convert lamports to SOL
            } else if (balanceChange < 0) {
              type = "send";
              amount = Math.abs(balanceChange) / 1e9;
            }
          }

          // Try to determine from/to addresses
          if (txData.message.accountKeys.length > 1) {
            from = txData.message.accountKeys[0].pubkey.toString();
            to = txData.message.accountKeys[1]?.pubkey.toString() || "";
          }

          return {
            signature: signature.signature,
            slot: signature.slot,
            blockTime: signature.blockTime,
            fee: (meta?.fee || 0) / 1e9,
            amount,
            type,
            status: meta?.err ? "failed" : "success",
            from,
            to,
          };
        });

      setTransactions(parsedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchTransactions();
    }
  }, [publicKey]);

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Unknown";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };



  const getTransactionUrl = (signature: string) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  };

  if (!publicKey) {
    return (
      <div className="bg-white dark:bg-stone-800 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Transactions</h3>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Connect your wallet to view transactions
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
      

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHead>
            <TableRow className="bg-muted/30">
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Fee</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Details</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Loading transactions...
                  </div>
                </TableCell>
              </TableRow>
            ) : transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow
                  key={tx.signature}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">
                    {formatDate(tx.blockTime)}
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-2">
                    {tx.type === "receive" ? (
                      <>
                        <ArrowDownCircle size={18} className="text-green-500" />
                        <span className="text-green-600 dark:text-green-400">Received</span>
                      </>
                    ) : tx.type === "send" ? (
                      <>
                        <ArrowUpCircle size={18} className="text-red-500" />
                        <span className="text-red-600 dark:text-red-400">Sent</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpCircle size={18} className="text-gray-500" />
                        <span className="text-gray-600 dark:text-gray-400">Fee</span>
                      </>
                    )}
                  </TableCell>
                  <TableCell className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${
                    tx.type === "receive" ? "text-green-600 dark:text-green-400" : 
                    tx.type === "send" ? "text-red-600 dark:text-red-400" : 
                    "text-gray-600 dark:text-gray-400"
                  }`}>
                    {tx.type === "receive" ? "+" : tx.type === "send" ? "-" : ""}
                    {formatSol(tx.amount)}
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                    {formatSol(tx.fee)}
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tx.status === "success" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                    }`}>
                      {tx.status === "success" ? "Success" : "Failed"}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm">
                    <a
                      href={getTransactionUrl(tx.signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
