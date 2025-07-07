import React from 'react';

const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className = '', ...props }, ref) => (
  <thead ref={ref} className={`bg-gray-50 dark:bg-stone-700 ${className}`} {...props} />
));

TableHead.displayName = 'TableHead';

export default TableHead; 