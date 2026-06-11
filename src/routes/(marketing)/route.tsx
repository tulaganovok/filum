import Footer from '#/features/marketing/components/footer'
import Navbar from '#/features/marketing/components/navbar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(marketing)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />

      <div className='flex-1 pt-36 pb-20'>
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
