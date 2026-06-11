import { Button } from '#/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '#/components/ui/empty'
import { getUserFilesFn } from '#/features/dashboard/utils/functions'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Cloud, Loader2, Plus } from 'lucide-react'
import { zodValidator } from '@tanstack/zod-adapter'
import { filesSearchSchema } from '#/features/dashboard/utils/schema'
import { DepartmentFilter, SearchFilter } from '#/features/dashboard/components/filter'
import { Pagination } from '#/components/shared/pagination'

export const Route = createFileRoute('/(dashboard)/files/')({
  component: RouteComponent,
  validateSearch: zodValidator(filesSearchSchema),
})

function RouteComponent() {
  const searchParams = useSearch({ from: '/(dashboard)/files/' })
  const getUserFiles = useServerFn(getUserFilesFn)
  const navigate = useNavigate()

  const { isLoading, data } = useQuery({
    queryKey: ['files', searchParams.search, searchParams.department, searchParams.page],
    queryFn: () => getUserFiles({ data: searchParams }),
  })

  return (
    <div className='px-4 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto'>
      <div className='flex items-center md:justify-between'>
        <h3 className='text-xl font-bold max-md:hidden'>Files</h3>

        <div className='flex flex-col md:flex-row gap-2 max-md:w-full'>
          <SearchFilter />

          <div className='flex items-center gap-2'>
            <DepartmentFilter />

            <Button size={'sm'} asChild>
              <Link to='/files/upload'>
                <Plus /> New file
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className='h-72 max-w-xl bg-secondary rounded-2xl flex items-center mx-auto mt-24 justify-center'>
          <div className='flex flex-col items-center'>
            <Loader2 className='size-16 animate-spin text-muted-foreground' />
            <h3 className='text-lg font-semibold text-muted-foreground mt-4'>Loading files...</h3>
            <span className='text-sm text-muted-foreground mt-1'>
              This will take a few seconds.
            </span>
          </div>
        </div>
      )}

      <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4 mb-2'>
        {data &&
          data.files.length > 0 &&
          data.files.map(file => (
            <Link
              key={file.id}
              to='/files/$fileId'
              params={{ fileId: file.id }}
              className='flex flex-col border-2 border-input rounded-xl pt-4 shadow-sm'
            >
              <div className='w-full h-32'>
                <img
                  src={`/${file.fileName
                    .split('.')
                    .at(file.fileName.split('.').length - 1)
                    ?.slice(0, 3)}.png`}
                  alt={file.fileName}
                  className='object-contain object-center size-full'
                />
              </div>

              <div className='px-3 py-2 flex flex-col'>
                <span className=' text-sm font-semibold truncate'>{file.fileName}</span>
                <span className='text-xs text-muted-foreground'>{file.department} Department</span>
              </div>
            </Link>
          ))}
      </div>

      {data && data.files.length === 0 && (
        <Empty className='border border-dashed bg-secondary max-w-xl mx-auto mt-24 rounded-2xl'>
          <EmptyHeader>
            <EmptyMedia variant={'icon'} className='mb-8 mt-4'>
              <Cloud className='size-24 text-muted-foreground' />
            </EmptyMedia>

            <EmptyTitle>No files found.</EmptyTitle>
            <EmptyDescription>You can upload files to our platform</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {data && data.files.length > 0 && (
        <Pagination
          page={searchParams.page ?? 1}
          totalPages={data.totalPages}
          onPageChange={newPage =>
            navigate({
              to: '/files',
              search: { ...searchParams, page: newPage === 1 ? undefined : newPage },
            })
          }
        />
      )}
    </div>
  )
}
