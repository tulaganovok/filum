import { Button } from '#/components/ui/button'
import { Link } from '@tanstack/react-router'

export default function Navbar() {
  return (
    <header className='fixed top-0 w-full px-4 h-14 border-b-2 flex items-center bg-background z-50'>
      <div className='md:max-w-3xl lg:max-w-5xl xl:max-w-7xl mx-auto flex items-center w-full justify-between'>
        <Link to={'/'} className='text-2xl font-black text-neutral-700'>
          Filum
        </Link>

        <Button size={'sm'} asChild>
          <Link to={'/sign-in'}>Login</Link>
        </Button>
      </div>
    </header>
  )
}
