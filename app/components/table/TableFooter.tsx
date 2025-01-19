import React from "react";
import TableRowNumberSelector from "~/components/table/TableRowNumberSelector";
import TablePagination from "~/components/table/TablePagination";

interface TableFooterProps {
  rowSizeList?: Array<string>;
  totalPages?: number;
}
const TableFooter = ({ rowSizeList, totalPages }: TableFooterProps) => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sticky bottom-2 backdrop-blur-md shadow-lg px-4 py-2 border rounded-md">
      <TableRowNumberSelector rowSizeList={rowSizeList} />
      <TablePagination totalPages={10} />
    </div>
  );
};

export default TableFooter;
