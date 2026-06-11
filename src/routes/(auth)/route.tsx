import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/(auth)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative'>
      <div className='w-full max-w-md md:max-w-3xl'>
        <div className='flex flex-col gap-6'>
          <Card className='overflow-hidden p-0'>
            <CardContent className='grid p-0 md:grid-cols-2'>
              <div className='bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center'>
                <img src='/auth-bg.jpg' alt='Image' className='size-full' />
              </div>

              <div className='p-6 md:p-8'>
                <Outlet />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button variant={'outline'} className='absolute left-8 top-4 md:left-24 md:top-12' asChild>
        <Link to='/'>
          <ArrowLeft className='size-4' /> Back to Home
        </Link>
      </Button>
    </div>
  )
}
