import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export default function NotFoundComponent() {
  return (
    <div className='min-h-screen w-full flex items-center justify-center'>
      <Empty className='bg-secondary rounded-2xl'>
        <EmptyHeader>
          <EmptyTitle className='font-bold'>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. You can go back to home below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size={'sm'} asChild>
            <Link to={'/files'}>
              <ArrowLeft /> Back to Home page
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
