import { Button } from '#/components/ui/button'
import UploadBox from '#/features/dashboard/components/upload-box'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/(dashboard)/files/upload/')({
  component: RouteComponent,
})

function RouteComponent() {
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
        <UploadBox />
      </div>
    </div>
  )
}
