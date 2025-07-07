"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import Table from "@/components/ui/table/Table";
import TableHead from "@/components/ui/table/TableHead";
import TableBody from "@/components/ui/table/TableBody";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import TableHeaderCell from "@/components/ui/table/TableHeaderCell";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import WalletCard from "@/components/wallet/WalletCard";
import { useUser } from "@clerk/nextjs";
// import StripeCardList from '@/components/wallet/StripeCardList';
// import StripeCardTransactions from '@/components/wallet/StripeCardTransactions';
// import StripeCardholderForm from '@/components/wallet/StripeCardholderForm';

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export default function TransactionsPage() {
  const { user } = useUser();
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || "";
  const convexUser = useQuery(
    api.myFunctions.getUserByEmail,
    userEmail ? { email: userEmail } : "skip",
  ) as Doc<"users"> | null | undefined;
  // For user wallet, we'll get all invoices or user-specific data
  // const invoices = useQuery(api.franchise.list, {}) as Doc<"franchise">[] | undefined;
  const franchises = useQuery(api.franchise.list, {}) as
    | Doc<"franchise">[]
    | undefined;
  // const [selectedCardId, setSelectedCardId] = React.useState<string | null>(null);

  // Calculate wallet balance (placeholder for user wallet)
  const balance = React.useMemo(() => {
    // For now, return a placeholder balance
    // In a real app, this would come from user's actual wallet balance
    return 50000;
  }, []);

  // Map franchiseId to franchise name/building
  const franchiseMap = React.useMemo(() => {
    if (!franchises) return {};
    return franchises.reduce(
      (acc, f) => {
        acc[f._id] = f.building || "Franchise";
        return acc;
      },
      {} as Record<string, string>,
    );
  }, [franchises]);

  // Placeholder handlers
  const handleAddMoney = React.useCallback(() => {
    // TODO: Implement add money logic/modal
    alert("Add Money clicked!");
  }, []);
  const handleWithdraw = React.useCallback(() => {
    // TODO: Implement withdraw logic/modal
    alert("Withdraw clicked!");
  }, []);

  // if (convexUser && (!convexUser.stripeCardholderId || !convexUser.isActivated)) {
  //   return (
  //     <StripeCardholderForm />
  //   );
  // }

  return (
    <div>
      <div className=" w-full">
        <WalletCard
          balance={balance}
          userName={
            convexUser && (convexUser.first_name || convexUser.family_name)
              ? `${convexUser.first_name || ""} ${convexUser.family_name || ""}`.trim()
              : user?.fullName || user?.firstName || "Username"
          }
          onAddMoney={handleAddMoney}
          onWithdraw={handleWithdraw}
          className="w-full"
        />
      </div>
      {/* Stripe Issuing Card List and Transactions */}
      {/* <StripeCardList
      cardholderId={convexUser?.stripeCardholderId}
      onSelectCard={setSelectedCardId}
      selectedCardId={selectedCardId}
    /> */}
      {/* <StripeCardTransactions cardId={selectedCardId} /> */}
      <div className="overflow-x-auto rounded-lg">
        <Table className="min-w-full divide-y divide-gray-200 rounded-xl shadow-sm mt-8 p-0 overflow-hidden">
          <TableHead>
            <TableRow className="bg-muted/30">
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Franchise</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {false ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Loading...
                </TableCell>
              </TableRow>
            ) : true ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ([] as any[]).map((invoice: any) => {
                // For now, treat all as income (ArrowDownCircle, green)
                const isIncome = true;
                return (
                  <TableRow
                    key={invoice._id}
                    className="hover:bg-muted/20 transition-colors group"
                  >
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">
                      {formatDate(invoice.createdAt)}
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-stone-900 font-medium flex items-center gap-2">
                      {isIncome ? (
                        <ArrowDownCircle size={18} color="#34C759" />
                      ) : (
                        <ArrowUpCircle size={18} color="#FF3B30" />
                      )}
                      Franchise Payment
                    </TableCell>
                    <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">
                      {franchiseMap[invoice.franchiseId] || invoice.franchiseId}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 whitespace-nowrap text-sm font-semibold ${isIncome ? "text-[#34C759]" : "text-[#FF3B30]"}`}
                    >
                      {isIncome ? "+" : "-"}₹
                      {Math.abs(invoice.totalAmount).toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center gap-1 text-[#34C759]`}
                    >
                      Completed
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
