import { Link, useLoaderData } from '@tanstack/react-router'
import UserBox from './user-box'
import { Skeleton } from '#/components/ui/skeleton'

export default function Navbar() {
  const { user } = useLoaderData({ from: '/(dashboard)' })

  return (
    <header className='fixed top-0 w-full px-4 h-14 border-b-2 flex items-center  bg-background z-50'>
      <div className='md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto flex items-center w-full justify-between'>
        <Link to={'/files'} className='text-2xl font-black text-neutral-700'>
          Filum
        </Link>

        {user ? (
          <UserBox user={{ ...user, image: user.image ?? null }} />
        ) : (
          <Skeleton className='size-8 rounded-full' />
        )}
      </div>
    </header>
  )
}
