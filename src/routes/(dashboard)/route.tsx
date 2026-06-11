import { getSessionFn } from '#/features/auth/utils/functions'
import Navbar from '#/features/dashboard/components/navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)')({
  component: RouteComponent,
  loader: () => getSessionFn(),
  errorComponent: ({ error }) => {
    console.error(error) 
    return <pre>{error.message}</pre>
  },
})

function RouteComponent() {
  return (
    <>
      <Navbar />

      <div className='pt-18'>
        <Outlet />
      </div>
    </>
  )
}
