import React from 'react'
import BudgetDetailsCard from './BudgetDetailsCard'
import BudgetSummaryCard from './BudgetSummaryCard'
import TransactionsCard from './TransactionsCard'
import FranchiseHeader from '@/components/franchise/FranchiseHeader'
function FranchiseBudget() {
  return (
    <>
      <FranchiseHeader />
      <BudgetSummaryCard />
      <BudgetDetailsCard />
      <TransactionsCard />
    </>
  )
}

export default FranchiseBudget