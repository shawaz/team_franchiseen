'use client'

import React from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import Table from '@/components/ui/table/Table'
import TableHead from '@/components/ui/table/TableHead'
import TableBody from '@/components/ui/table/TableBody'
import TableRow from '@/components/ui/table/TableRow'
import TableCell from '@/components/ui/table/TableCell'
import TableHeaderCell from '@/components/ui/table/TableHeaderCell'

const tasks = [
  {
    name: 'Design Wireframes',
    endDate: 'Set end date',
    status: { label: 'In Review', color: 'bg-purple-100 text-purple-800' },
    progress: 65,
    assignee: { img: '/avatar/avatar-m-1.png', name: 'John Doe' },
  },
  {
    name: 'Prototype design',
    endDate: 'Aug 15, 2021',
    status: { label: 'In Progress', color: 'bg-sky-100 text-sky-700' },
    progress: 75,
    assignee: { img: '/avatar/avatar-f-1.png', name: 'Jane Smith' },
  },
  {
    name: 'Content Writing',
    endDate: 'Aug 16, 2021',
    status: { label: 'Cancel', color: 'bg-red-100 text-red-700' },
    progress: 86,
    assignee: { img: '/avatar/avatar-f-2.png', name: 'Alice Brown' },
  },
  {
    name: 'Figma to Bootstrap Conversion',
    endDate: 'Aug 18, 2021',
    status: { label: 'In Review', color: 'bg-purple-100 text-purple-800' },
    progress: 40,
    assignee: { img: '/avatar/avatar-m-2.png', name: 'Bob Lee' },
  },
  {
    name: 'User Interface Design',
    endDate: 'Aug 18, 2021',
    status: { label: 'In Review', color: 'bg-purple-100 text-purple-800' },
    progress: 35,
    assignee: { img: '/avatar/avatar-f-3.png', name: 'Clara White' },
  },
]

function CircularProgress({ value }: { value: number }) {
  // 44 is the circumference of the circle (2 * pi * r, r=7)
  const radius = 16
  const stroke = 3
  const normalizedRadius = radius - stroke / 2
  const circumference = 2 * Math.PI * normalizedRadius
  const offset = circumference - (value / 100) * circumference
  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
        stroke="#E5EAF1"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#22C55E"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="12"
        fill="#22C55E"
        fontWeight="bold"
      >
        {value}%
      </text>
    </svg>
  )
}

export default function TaskTableClient() {
  return (
    <div className="bg-white rounded-2xl shadow-sm mt-8 p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHead>
            <TableRow className="bg-muted/30">
              <TableHeaderCell>Tasks</TableHeaderCell>
              <TableHeaderCell>End Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Progress</TableHeaderCell>
              <TableHeaderCell>Assignee</TableHeaderCell>
              <TableHeaderCell className="px-2 py-3" />
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.name} className="hover:bg-muted/20 transition-colors group">
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground font-medium">{task.name}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{task.endDate}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm ${task.status.color} group-hover:brightness-95 transition`}>{task.status.label}</span>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <CircularProgress value={task.progress} />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <Avatar>
                    <AvatarImage src={task.assignee.img} alt={task.assignee.name} />
                    <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="px-2 py-3 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-full hover:bg-accent focus:outline-none">
                        <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 