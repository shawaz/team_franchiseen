import React from 'react';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className = '', ...props }, ref) => (
  <tbody ref={ref} className={`bg-white dark:bg-stone-800 divide-y divide-gray-100 dark:divide-stone-700 ${className}`} {...props} />
));

TableBody.displayName = 'TableBody';

export default TableBody; 