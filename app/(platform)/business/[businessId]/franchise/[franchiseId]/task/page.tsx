import React from 'react'
import BusinessTaskOverview from './BusinessTaskOverview'
import FranchiseHeader from '@/components/franchise/FranchiseHeader'
import TaskTableClient from '@/components/franchise/TaskTableClient'

async function FranchiseTaskPage() {
  return (
    <div>
      <FranchiseHeader />
      <BusinessTaskOverview />
      <TaskTableClient />
    </div>
  )
}

export default FranchiseTaskPage