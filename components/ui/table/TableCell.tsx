import React from 'react';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className = '', ...props }, ref) => (
  <td ref={ref} className={className} {...props} />
));

TableCell.displayName = 'TableCell';

export default TableCell; 