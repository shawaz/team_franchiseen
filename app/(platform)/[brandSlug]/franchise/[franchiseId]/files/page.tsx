import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import FranchiseHeader from '@/components/franchise/FranchiseHeader';
const mockFiles = [
  {
    id: 1,
    name: 'Admin-Dashboard-Design.xlsx',
    icon: 'spreadsheet',
    size: '2.3MB',
    modified: '27 Sept, 2021',
    uploader: { name: 'John Doe', avatar: '/avatars/1.png', fallback: 'J' },
  },
  {
    id: 2,
    name: 'Admin-Dashboard-Design.jpeg',
    icon: 'image',
    size: '10MB',
    modified: '29 Sept, 2021',
    uploader: { name: 'Jane Smith', avatar: '/avatars/2.png', fallback: 'J' },
  },
  {
    id: 3,
    name: 'Geeks UI Description.doc',
    icon: 'doc',
    size: '45MB',
    modified: '01 Oct, 2021',
    uploader: { name: 'JW', avatar: '', fallback: 'JW' },
  },
  {
    id: 4,
    name: 'Geeks-UI-Marketing-Process.ppt',
    icon: 'ppt',
    size: '122MB',
    modified: '04 Oct, 2021',
    uploader: { name: 'Alice', avatar: '/avatars/3.png', fallback: 'A' },
  },
  {
    id: 5,
    name: 'Geeks-UI-Marketing-Process.txt',
    icon: 'txt',
    size: '43.5MB',
    modified: '06 Oct, 2021',
    uploader: { name: 'NS', avatar: '', fallback: 'NS' },
  },
  {
    id: 6,
    name: 'Geeks-UI-promo-trailer-template.mov',
    icon: 'video',
    size: '115MB',
    modified: '08 Oct, 2021',
    uploader: { name: 'Bob', avatar: '/avatars/4.png', fallback: 'B' },
  },
  {
    id: 7,
    name: 'Earning-from-Dashboard.xlsx',
    icon: 'spreadsheet',
    size: '55MB',
    modified: '12 Oct, 2021',
    uploader: { name: 'Emma', avatar: '/avatars/5.png', fallback: 'E' },
  },
];



function FranchiseFiles() {
  return (
    <div >
       <FranchiseHeader />
      <h2 className="text-xl font-bold mb-4">Files</h2>
      <input
        type="text"
        placeholder="Search Filename"
        className="border rounded-md px-3 py-2 w-full max-w-md mb-6 focus:outline-none focus:ring"
      />
      <div className="overflow-x-auto rounded-xl shadow border bg-white dark:bg-stone-800">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-stone-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File Size</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Modified</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Uploaded By</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Options</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-stone-800 divide-y divide-gray-100 dark:divide-stone-700">
            {mockFiles.map((file) => (
              <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-stone-700 transition">
                <td className="flex items-center gap-3 px-4 py-3">
                  <span className="font-semibold text-black dark:text-white">{file.name}</span>
                </td>
                <td className="px-4 py-3">{file.size}</td>
                <td className="px-4 py-3">{file.modified}</td>
                <td className="px-4 py-3">
                  <Avatar>
                    {file.uploader.avatar ? (
                      <AvatarImage src={file.uploader.avatar} alt={file.uploader.name} />
                    ) : null}
                    <AvatarFallback>{file.uploader.fallback}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Download">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 4v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="18" width="16" height="2" rx="1" fill="currentColor"/></svg>
                    </Button>
                    <Button variant="ghost" size="icon" title="Copy Link">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M8 12v-2a4 4 0 014-4h4a4 4 0 014 4v4a4 4 0 01-4 4h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="2" y="8" width="8" height="12" rx="4" stroke="currentColor" strokeWidth="2"/></svg>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Open menu</span>
                          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem>Copy Link</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FranchiseFiles;