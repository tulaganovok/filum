import SignUpForm from '#/features/auth/components/sign-up-form'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-up/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-center text-center'>
        <h1 className='text-xl font-bold'>Create an account</h1>
        <p className='text-muted-foreground text-balance'>Get started with our service</p>
      </div>

      <SignUpForm />

      <div className='flex items-center gap-x-2 justify-center'>
        <p className='text-sm text-muted-foreground'>Already have an account?</p>
        <Link
          to='/sign-in'
          className='text-sm font-medium text-primary underline-offset-4 hover:underline'
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
