import SignInForm from '#/features/auth/components/sign-in-form'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/sign-in/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col items-center text-center'>
        <h1 className='text-xl font-bold'>Welcome back</h1>
        <p className='text-muted-foreground text-balance'>Login to your account</p>
      </div>

      <SignInForm />

      <div className='flex items-center gap-x-2 justify-center'>
        <p className='text-sm text-muted-foreground'>Don't have an account?</p>

        <Link
          to='/sign-up'
          className='text-sm font-medium text-primary underline-offset-4 hover:underline'
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}
