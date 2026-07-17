import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps extends React.ComponentProps<"nav"> {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function Pagination({
  className,
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  ...props
}: PaginationProps) {
  const range = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const generatePages = () => {
    const totalPageNumbers = siblingCount * 2 + 5
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)
    const showLeftDots = leftSiblingIndex > 2
    const showRightDots = rightSiblingIndex < totalPages - 2

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, "...", totalPages]
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [1, "...", ...rightRange]
    }

    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [1, "...", ...middleRange, "...", totalPages]
  }

  const pages = generatePages()

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <PaginationContent>
        <PaginationItem>
          <PaginationButton
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Go to previous page"
            className="gap-1 pl-2.5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </PaginationButton>
        </PaginationItem>

        {pages.map((page, idx) => {
          if (page === "...") {
            return (
              <PaginationItem key={`ellipsis-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
          const pageNum = page as number
          return (
            <PaginationItem key={pageNum}>
              <PaginationButton
                isActive={pageNum === currentPage}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </PaginationButton>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationButton
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Go to next page"
            className="gap-1 pr-2.5"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </PaginationButton>
        </PaginationItem>
      </PaginationContent>
    </nav>
  )
}
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn("flex flex-row items-center gap-1", className)} {...props} />
  )
)
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("", className)} {...props} />
  )
)
PaginationItem.displayName = "PaginationItem"

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  size?: "default" | "sm" | "lg" | "icon" | null
}

const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, isActive, size = "icon", ...props }, ref) => (
    <button
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: "sm",
        }),
        className
      )}
      {...props}
    />
  )
)
PaginationButton.displayName = "PaginationButton"

const PaginationEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationButton,
  PaginationItem,
  PaginationEllipsis,
}
