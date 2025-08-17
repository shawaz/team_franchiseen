import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSolOnly } from '@/contexts/SolOnlyContext'

type Status = 'Fundraising' | 'Launching' | 'Live' | 'Closed';

type Franchise = {
  id: string;
  name: string;
  industry: string;
  address: string;
  totalInvestment: number;
  carpetArea: number;
  costPerShare: number;
  status: Status;
  coverPhoto: string;
  logo: string;
  // Add other fields if needed
};

type FranchiseCardProps = {
  franchise: Franchise;
};

const statusColors: Record<Status, string> = {
  Fundraising: 'bg-red-50 text-red-700 dark:bg-red-900/50 dark:text-red-100',
  Launching: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-100',
  Live: 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-100',
  Closed: 'bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-100',
};

const FranchiseCard: React.FC<FranchiseCardProps> = ({ franchise }) => {
  const { formatSol } = useSolOnly();

  return (
    <Link href={`/franchise/${franchise.id}`} className="block">
      <div className="rounded-xl shadow-sm overflow-hidden duration-300 bg-white dark:bg-stone-800 cursor-pointer">
        {/* Cover Photo */}
        <div className="relative h-48 w-full">
          <Image
            src={franchise.coverPhoto}
            alt={`${franchise.name} cover`}
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Logo and Name */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative h-10 w-10 rounded overflow-hidden border">
              <Image
                src={franchise.logo}
                alt={`${franchise.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-md leading-tight">{franchise.name}</div>
              <div className="text-sm dark:text-gray-400 text-gray-600 flex items-center gap-1">
                <span>{franchise.industry}</span>
                {/* <span className="text-gray-400">•</span>
                <span>{franchise.category}</span> */}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mb-1 text-sm dark:text-gray-400 text-gray-600">
            {franchise.address}
          </div>

          {/* Investment and Area */}
          <div className="mb-4">
            <div className="text-sm dark:text-gray-400  text-gray-600">
              Budget: {formatSol(franchise.totalInvestment)} • {franchise.carpetArea} sq.ft
            </div>
          </div>

          <div className="flex items-center justify-between align-middle gap-3">
            {/* Cost per Share */}
            <div className="text-sm dark:text-gray-100 text-gray-600 font-bold">
              {formatSol(franchise.costPerShare)} / Share
            </div>

            {/* Status */}
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColors[franchise.status]}`}>
              {franchise.status}
            </div>

          </div>

          
        </div>
      </div>
    </Link>
  );
};

export default FranchiseCard; 