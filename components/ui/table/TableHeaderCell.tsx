import React from 'react';

const TableHeaderCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className = '', ...props }, ref) => (
  <th ref={ref} className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`} {...props} />
));

TableHeaderCell.displayName = 'TableHeaderCell';

export default TableHeaderCell; 