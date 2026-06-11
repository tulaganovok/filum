import { Button } from '#/components/ui/button'
import DetailedFile from '#/features/dashboard/components/detailed-file'
import { getUserFileByIdFn } from '#/features/dashboard/utils/functions'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { ArrowLeft, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/(dashboard)/files/$fileId/')({
  component: RouteComponent,
  pendingMs: 0,
  pendingComponent: PendingComponent,
  loader: ({ params }) => getUserFileByIdFn({ data: { id: params.fileId } }),
})

function RouteComponent() {
  const storedFile = useLoaderData({ from: '/(dashboard)/files/$fileId/' })

  return (
    <div className='px-4 md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto'>
      <div>
        <Button variant='outline' size='sm' asChild>
          <Link to='/files'>
            <ArrowLeft className='size-4' /> Back to Files
          </Link>
        </Button>
      </div>

      <div className='max-w-xl mx-auto my-8'>
        <DetailedFile storedFile={storedFile} />
      </div>
    </div>
  )
}

function PendingComponent() {
  return (
    <div>
      <div className='h-72 max-w-xl bg-secondary rounded-2xl flex items-center mx-auto mt-24 justify-center'>
        <div className='flex flex-col items-center'>
          <Loader2 className='size-16 animate-spin text-muted-foreground' />
          <h3 className='text-lg font-semibold text-muted-foreground mt-4'>Loading file...</h3>
          <span className='text-sm text-muted-foreground mt-1'>This will take a few seconds.</span>
        </div>
      </div>
    </div>
  )
}
