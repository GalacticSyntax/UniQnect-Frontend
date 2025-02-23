import * as React from "react";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  ArrowDownNarrowWide as AscendingIcon,
  ArrowUpNarrowWide as DescendingIcon,
  Minus,
} from "lucide-react";
import { useSearchParams } from "react-router";
import useModifyQueryParams from "~/hooks/use-modify-query-params";

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableActionHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement> & {
    sortable?: boolean;
    id: string;
    center?: boolean;
    sortedType?: "acc" | "desc";
  }
>(
  (
    { className, sortable, id, center = false, sortedType, children, ...props },
    ref
  ) => {
    let [searchParams, setSearchParams] = useSearchParams();
    const { modifyParams } = useModifyQueryParams();

    React.useEffect(() => {
      if (!searchParams.get("sort"))
        setSearchParams(modifyParams("delete", "sort"));
    }, [searchParams]);

    // Helper function to check if the column id is in the query params and what type of sorting it has
    const getSortType = () => {
      const sortParam = searchParams.get("sort");
      if (!sortParam) return null;

      const sortArray = sortParam.split(",");
      const currentSort = sortArray.find((item) => item.includes(id));
      if (!currentSort) return null;

      if (currentSort.startsWith("-")) return "desc"; // descending
      if (currentSort.startsWith("+")) return "acc"; // ascending
      return null;
    };

    // Function to handle sorting
    const handleSort = () => {
      let sortParam = searchParams.get("sort");
      const sortArray = sortParam ? sortParam.split(",") : [];

      const currentSortIndex = sortArray.findIndex((item) => item.includes(id));

      if (currentSortIndex !== -1) {
        // If the column is already in the sort query, toggle its value
        if (!sortArray[currentSortIndex].startsWith("-")) {
          sortArray[currentSortIndex] = `-${id}`; // Change to descending
        } else if (sortArray[currentSortIndex].startsWith("-")) {
          sortArray.splice(currentSortIndex, 1); // Remove the sort parameter
        }
      } else {
        // If the column is not in the sort query, add it as ascending
        sortArray.push(id);
      }

      // Update the sort parameter in the query
      const updatedUrl = modifyParams("set", "sort", sortArray.join(","));
      setSearchParams(updatedUrl);
    };

    const sortType = getSortType();

    return (
      <th
        ref={ref}
        className={cn(
          "h-10 px-2 text-left align-middle font-medium text-muted-foreground select-none [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
          {
            "text-center": center,
          },
          className
        )}
        {...props}
      >
        {sortable ? (
          <Button variant={"ghost"} className="pl-0" onClick={handleSort}>
            {children}
            {sortType === "acc" && <DescendingIcon />}
            {sortType === "desc" && <AscendingIcon />}
            {!sortType && <Minus />}
          </Button>
        ) : (
          children
        )}
      </th>
    );
  }
);
TableActionHead.displayName = "TableActionHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableActionHead,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
