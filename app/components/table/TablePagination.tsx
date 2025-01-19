import React, { useMemo } from "react";
import { useSearchParams } from "react-router";
import useModifyQueryParams from "~/hooks/use-modify-query-params";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface TablePaginationProps {
  totalPages?: number;
}

const TablePagination = ({ totalPages = 10 }: TablePaginationProps) => {
  let [searchParams, setSearchParams] = useSearchParams();
  const { modifyParams } = useModifyQueryParams();

  const page = useMemo(() => Number(searchParams.get("page")), [searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return; // Prevent navigating out of bounds

    // Get the updated query params URL
    const updatedUrl = modifyParams("set", "page", newPage.toString());

    // Update the URL with the new page query parameter
    setSearchParams(updatedUrl);
  };

  return (
    <Pagination className="justify-center sm:justify-end">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
          </PaginationItem>
        )}

        {/* when page near starting */}
        {page <= 2 && (
          <>
            {Array(3)
              .fill(0)
              .map((_, index) => {
                const contextPage = index + 1;
                return (
                  <PaginationItem key={contextPage}>
                    <PaginationLink
                      isActive={page === contextPage}
                      onClick={() => handlePageChange(contextPage)}
                    >
                      {contextPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            {totalPages > 3 && (
              <PaginationItem>
                <PaginationEllipsis
                  onClick={() => handlePageChange(page + 1)}
                />
              </PaginationItem>
            )}
          </>
        )}

        {/* when page near ending */}
        {totalPages - page < 2 && (
          <>
            {totalPages > 3 && (
              <PaginationItem>
                <PaginationEllipsis
                  onClick={() => handlePageChange(page - 1)}
                />
              </PaginationItem>
            )}
            {Array(3)
              .fill(0)
              .map((_, index) => {
                const contextPage = totalPages - (3 - index - 1);
                return (
                  <PaginationItem key={contextPage}>
                    <PaginationLink
                      isActive={page === contextPage}
                      onClick={() => handlePageChange(contextPage)}
                    >
                      {contextPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
          </>
        )}

        {page > 2 && page <= totalPages - 2 && (
          <>
            <PaginationItem>
              <PaginationEllipsis onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
            {Array(3)
              .fill(0)
              .map((_, index) => {
                const contextPage = index + page - 1;
                return (
                  <PaginationItem key={contextPage}>
                    <PaginationLink
                      isActive={page === contextPage}
                      onClick={() => handlePageChange(contextPage)}
                    >
                      {contextPage}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
            <PaginationItem>
              <PaginationEllipsis onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          </>
        )}

        {totalPages - page > 0 && (
          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(page + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default TablePagination;
