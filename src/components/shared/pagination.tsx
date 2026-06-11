import { Button } from '#/components/ui/button'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center justify-end space-x-4 py-4 mx-auto'>
        <Button
          disabled={page === 1}
          variant={'outline'}
          className='text-primary border-primary hover:text-primary'
          size='sm'
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Prev
        </Button>

        <span className='text-sm'>
          {page} of {totalPages}
        </span>

        <Button
          disabled={page === totalPages}
          variant={'outline'}
          className='text-primary border-primary hover:text-primary'
          size='sm'
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export { Pagination }
