import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { signUpFormSchema } from '../utils/schema'
import { authClient } from '#/lib/auth-client'
import { Alert, AlertTitle } from '#/components/ui/alert'
import { AlertCircleIcon, XIcon } from 'lucide-react'
import { Field, FieldError, FieldGroup, FieldLabel } from '#/components/ui/field'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'

export default function SignUpForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const signUpForm = useForm({
    defaultValues: { name: '', email: '', password: '' },
    validators: { onSubmit: signUpFormSchema },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true)

      await authClient.signUp.email(value, {
        onSuccess: () => {
          setIsSubmitting(false)
          navigate({ to: '/files' })
        },
        onError: ({ error }) => {
          setIsSubmitting(false)
          setErrorMessage(error.message)
        },
      })
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
        id='sign-up-form'
        onSubmit={e => {
          e.preventDefault()
          signUpForm.handleSubmit()
        }}
      >
        <FieldGroup>
          <signUpForm.Field
            name='name'
            children={field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    disabled={isSubmitting}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type='text'
                    placeholder='Enter your name'
                    autoComplete='name'
                  />

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <signUpForm.Field
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

          <signUpForm.Field
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
            {isSubmitting ? 'Signing up...' : 'Sign up'}
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
