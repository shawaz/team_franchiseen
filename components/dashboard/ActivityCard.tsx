import React from 'react'
import { Card } from '../ui/card'
import ActivityList from './ActivityList'

function ActivityCard() {
  return (
    <Card className="p-6 dark:bg-stone-800">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-1">User Activity</div>
          <div className="relative">
            <div className="absolute ml-4.5 top-8 bottom-2 w-0.5 bg-stone-800 dark:bg-stone-50" />
            <ActivityList />
            <ActivityList />
            <ActivityList />
            <ActivityList />
            <ActivityList />
           
          </div>
        </Card>
  )
}

export default ActivityCard

