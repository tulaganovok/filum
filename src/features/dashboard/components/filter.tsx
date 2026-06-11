import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

function SearchFilter() {
  const searchParams = useSearch({ from: '/(dashboard)/files/' })
  const navigate = useNavigate()

  const [searchValue, setSearchValue] = useState(searchParams.search ?? '')

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmed = searchValue.trimStart()

      if (trimmed === (searchParams.search ?? '')) return

      navigate({
        to: '/files',
        search: { ...searchParams, search: trimmed || undefined },
      })
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchValue, searchParams.search])

  useEffect(() => {
    setSearchValue(searchParams.search ?? '')
  }, [searchParams.search])

  return (
    <div className='relative w-full md:w-64'>
      <Input
        placeholder='Search by file name..'
        className='bg-white w-full md:w-64 px-7 h-8'
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />

      <SearchIcon className='size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground' />
    </div>
  )
}

function DepartmentFilter() {
  const searchParams = useSearch({ from: '/(dashboard)/files/' })
  const navigate = useNavigate()

  return (
    <Select
      value={searchParams.department}
      onValueChange={value => {
        navigate({
          to: '/files',
          search: { ...searchParams, department: value },
        })
      }}
    >
      <SelectTrigger className='w-full bg-background md:min-w-40'>
        <SelectValue placeholder='Select department' />
      </SelectTrigger>

      <SelectContent position='popper'>
        <SelectGroup>
          {['All', 'IT', 'HR', 'Accounting', 'Other'].map((option, index) => (
            <SelectItem
              key={index}
              value={option}
              className='flex items-center gap-x-2 py-1.5 px-2'
            >
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export { SearchFilter, DepartmentFilter }
