import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

function BusinessTaskOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Task Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md text-center uppercase font-semibold">Summary</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold">50</span>
          <span className="text-muted-foreground mt-2">Total Task Count</span>
        </CardContent>
      </Card>
      {/* In Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md text-center uppercase font-semibold">In Progress</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-orange-500">12</span>
          <span className="text-muted-foreground mt-2"><span className="font-semibold text-base text-foreground">6</span> In Progress</span>
        </CardContent>
      </Card>
      {/* Completed */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md text-center uppercase font-semibold">Completed</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-green-500">30</span>
          <span className="text-muted-foreground mt-2"><span className="font-semibold text-base text-foreground">8</span> Today Completed</span>
        </CardContent>
      </Card>
      {/* Overdue */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md text-center uppercase font-semibold">Overdue</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-red-500">8</span>
          <span className="text-muted-foreground mt-2"><span className="font-semibold text-base text-foreground">4</span> Yesterday</span>
        </CardContent>
      </Card>
    </div>
  )
}

export default BusinessTaskOverview