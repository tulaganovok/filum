import { Avatar, AvatarFallback } from '#/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import type { User } from '#/db/schema'
import { authClient } from '#/lib/auth-client'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

interface UserBoxProps {
  user: User
}

export default function UserBox({ user }: UserBoxProps) {
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    setIsPending(true)

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false)
          navigate({ to: '/sign-in' })
        },
        onError: ({ error }) => {
          setIsPending(false)
          toast.error(error.message)
        },
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='size-8 cursor-pointer'>
          <AvatarFallback className='bg-primary text-background font-bold text-lg pb-px uppercase'>
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='py-0'>
        <DropdownMenuItem className='focus:bg-transparent focus:text-foreground flex flex-col items-start gap-0 p-1'>
          <span className='font-bold text-base'>{user.name}</span>
          <span className='text-sm text-muted-foreground'>{user.email}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className='m-0 p-0' />

        <DropdownMenuItem
          className='text-destructive focus:bg-transparent focus:text-destructive focus:cursor-pointer font-medium'
          disabled={isPending}
          onSelect={handleLogout}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
