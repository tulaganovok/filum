import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { signInFormSchema } from '../utils/schema'
import { authClient } from '#/lib/auth-client'
import { Alert, AlertTitle } from '#/components/ui/alert'
import { AlertCircleIcon, XIcon } from 'lucide-react'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export default function SignInForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const signInForm = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onSubmit: signInFormSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      await authClient.signIn.email(
        { email: value.email, password: value.password },
        {
          onSuccess: () => {
            setIsSubmitting(false)
            navigate({ to: '/files' })
          },
          onError: ({ error }) => {
            setIsSubmitting(false)
            setErrorMessage(error.message)
          },
        },
      )
    },
  })

  return (
    <div>
      {errorMessage && (
        <Alert variant={'destructive'} className='w-full mb-3 bg-red-100 rounded-sm relative'>
          <AlertCircleIcon />
          <AlertTitle>{errorMessage}</AlertTitle>
          <Button
            variant='ghost'
            size='icon-sm'
            className='absolute top-0 right-0 hover:bg-destructive/10 rounded-0 size-6 hover:text-destructive'
            onClick={() => setErrorMessage(null)}
          >
            <XIcon className='size-4' />
          </Button>
        </Alert>
      )}

      <form
        id='sign-in-form'
        onSubmit={e => {
          e.preventDefault()
          signInForm.handleSubmit()
        }}
      >
        <FieldGroup>
          <signInForm.Field
            name='email'
            children={field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email address</FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    disabled={isSubmitting}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type='email'
                    placeholder='Enter your email address'
                    autoComplete='email'
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <signInForm.Field
            name='password'
            children={field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    disabled={isSubmitting}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type='password'
                    placeholder='Enter your password'
                    autoComplete='current-password'
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
