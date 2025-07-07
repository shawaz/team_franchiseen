import React from 'react'
import Image from 'next/image'

function ActivityList() {
  return (
      <div className="flex items-start mb-8 relative">
          <div className="w-10 h-10 relative rounded-full border-2 border-stone-800 dark:border-stone-50">
            <Image 
              src="/avatar/avatar-m-5.png" 
              alt="avatar" 
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="ml-4">
          <div className="font-semibold">Samuel Green</div>
          <div className="text-gray-500 text-sm">Registered as a new user</div>
          <div className="text-xs text-gray-400 mt-1">10m ago</div>
          </div>
      </div>
  )
}

export default ActivityList