import { Button } from '#/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'
import { NotepadText } from 'lucide-react'

export const Route = createFileRoute('/(marketing)/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex items-center justify-center flex-col'>
        <div className='mb-4 flex items-center border shadow-sm p-2 md:p-4 bg-amber-100 text-amber-700 rounded-full uppercase font-bold max-md:text-sm'>
          <NotepadText className='size-6 mr-2' />
          Productive file management
        </div>

        <h1 className='text-3xl md:text-6xl text-center mb-6 font-bold'>Filum helps you move</h1>

        <div className='text-3xl md:text-6xl bg-linear-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit font-bold'>
          work forward.
        </div>
      </div>

      <div className='text-sm md:text-xl text-muted-foreground mt-6 max-w-xs md:max-w-2xl text-center mx-auto font-semibold'>
        Collaborate, manage projects and reach new productivity peaks. From high rises to the home
        office, the way your team works is unique - accomplish it all with Filum.
      </div>

      <Button className='mt-6' size={'lg'} asChild>
        <Link to={'/sign-up'}>Get Filum for free</Link>
      </Button>
    </div>
  )
}
