import React from 'react';

const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(({ className = '', ...props }, ref) => (
  <table ref={ref} className={`min-w-full divide-y divide-gray-200 ${className}`} {...props} />
));

Table.displayName = 'Table';

export default Table; 