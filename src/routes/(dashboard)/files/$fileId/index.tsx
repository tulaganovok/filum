import { Button } from '#/components/ui/button'
import DetailedFile from '#/features/dashboard/components/detailed-file'
import { getUserFileByIdFn } from '#/features/dashboard/utils/functions'
import { createFileRoute, Link, useLoaderData } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/(dashboard)/files/$fileId/')({
  component: RouteComponent,
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
