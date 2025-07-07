'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useState } from 'react';

const members = [
  {
    name: 'Jenny Wilson',
    role: 'Front-end Developer, Designer',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Dianna Smiley',
    role: 'Front End Developer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Nia Sikhone',
    role: 'Web Developer, Designer, and Teacher',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
  {
    name: 'Jacob Jones',
    role: 'Bootstrap Expert',
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
  },
  {
    name: 'Kristin Watson',
    role: 'Web Development',
    avatar: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    name: 'Rivao Luke',
    role: 'Web Development',
    avatar: 'https://randomuser.me/api/portraits/men/48.jpg',
  },
  {
    name: 'Xiaon Merry',
    role: 'Web Developer, Designer, and Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/49.jpg',
  },
  {
    name: 'Sina Ray',
    role: 'Engineering Architect',
    avatar: 'https://randomuser.me/api/portraits/women/50.jpg',
  },
];

export default function TeamClient() {
  const [search, setSearch] = useState('');
  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="shadow-sm w-full mx-auto mb-8">
        <input
          type="text"
          placeholder="Search member"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredMembers.map((member, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-6 flex flex-col gap-4 items-start"
          >
            <div className="flex items-center gap-4">
              <Avatar className="size-12">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
            </div>
              <div>
                <div className="font-semibold text-lg">{member.name}</div>
                <div className="text-gray-500 text-sm">{member.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 