import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import FranchiseHeader from '@/components/franchise/FranchiseHeader'

function FranchiseSummary() {
  return (
    <div>
       <FranchiseHeader />
       <div className="flex flex-col md:flex-row gap-6 bg-muted/30 min-h-screen">
      {/* Left: Project Description & Target Audience */}
      <Card className="flex-1 min-w-[340px]">
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-8">
            Give a high-level overview of the product / project you&apos;re working on, its goals, etc..Elaborate on the target audience of your project/product, link out to additional resources
          </p>
          <div className="mb-4">
            <h2 className="font-semibold text-lg mb-2">Target Audience</h2>
            <p className="text-muted-foreground mb-2">
              Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
            </p>
            <ul className="text-muted-foreground list-disc pl-5 space-y-1 mb-4 text-sm">
              <li>Nulla tincidunt metus nec commodo volutpat.</li>
              <li>Aliquam erat volutpat.</li>
              <li>Vestibulum ante ipsum primis in faucibus orci luctus.</li>
              <li>Ultrices posuere cubilia curae.</li>
              <li>Ul luctus et erat vel efficitur.</li>
            </ul>
            <p className="text-muted-foreground text-sm">
              Vivamus vehicula eros id pharetra viverra. In ac ipsum lacus. Phasellus facilisis libero eu dolor placerat, sed porttitor augue efficitur. Vestibulum tincidunt augue tempus, venenatis sem id, ultricies justo. Aliquam erat volutpat.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Right: Manager, Team, Dates, Cost */}
      <div className="flex flex-col gap-6 w-full md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="size-14">
                <AvatarImage src="/avatar/avatar-m-1.png" alt="Manager" />
                <AvatarFallback>MM</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-lg">Marvin McKinney</div>
                <div className="text-muted-foreground text-sm">Manager</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2">Team</div>
              <div className="flex -space-x-3">
                {[2,3,4,5,6,7].map((n, i) => (
                  <Avatar key={i} className="border-2 border-background size-10">
                    <AvatarImage src={`/avatar/avatar-${n%2===0?'m':'f'}-${n%6+1}.png`} alt={`Team member ${i+1}`} />
                    <AvatarFallback>TM</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><span className="i-lucide-calendar" />Start Date</span>
                <span className="font-medium">01 Jan, 2021</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><span className="i-lucide-calendar" />End Date</span>
                <span className="font-medium">30 Dec, 2021</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><span className="i-lucide-clock" />Estimated Time</span>
                <span className="font-medium">30 Days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground"><span className="i-lucide-dollar-sign" />Cost</span>
                <span className="font-medium">$18,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
    
  )
}

export default FranchiseSummary