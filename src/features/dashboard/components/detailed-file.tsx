import { Button } from '#/components/ui/button'
import { Lightbulb, Loader, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  deleteDraftedFileFn,
  extractCellContentFn,
  extractDocContentFn,
  extractPdfContentFn,
  generateDepartmentWithAIFn,
  generateTagsWithAIFn,
  summarizeWithAIFn,
  updateStoredFileFn,
} from '../utils/functions'
import { Badge } from '#/components/ui/badge'
import type { File } from '#/db/schema'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DetailedFileProps {
  storedFile: File
}

export default function DetailedFile({ storedFile }: DetailedFileProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [summary, setSummary] = useState(storedFile.summary ?? '')
  const [tags, setTags] = useState<string[]>(storedFile.tags)
  const [department, setDepartment] = useState(storedFile.department ?? '')
  const [isDeleting, setIsDeleting] = useState(false)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const searchParams = useSearch({ strict: false })

  const handleSummarize = async () => {
    setIsAnalyzing(true)
    const extension = storedFile.fileName.split('.').at(storedFile.fileName.split('.').length - 1)

    let content = ''

    if (extension === 'pdf') {
      const result = await extractPdfContentFn({
        data: { url: storedFile.storageUrl },
      })

      content = result.content
    }

    if (extension === 'doc' || extension === 'docx') {
      const result = await extractDocContentFn({
        data: { url: storedFile.storageUrl },
      })

      content = result.content
    }

    if (extension === 'xls' || extension === 'xlsx') {
      const result = await extractCellContentFn({
        data: { url: storedFile.storageUrl },
      })

      content = result.content
    }

    const aiSummary = await summarizeWithAIFn({ data: { content } })
    const aiTags = await generateTagsWithAIFn({ data: { content } })
    const aiDepartment = await generateDepartmentWithAIFn({ data: { content } })

    await updateStoredFileFn({
      data: {
        id: storedFile.id,
        summary: aiSummary,
        tags: aiTags.split(', '),
        department: aiDepartment,
      },
    })

    setIsAnalyzing(false)
    setSummary(aiSummary)
    setTags(aiTags.split(', '))
    setDepartment(aiDepartment)
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true)

    await deleteDraftedFileFn({ data: { id } })
    await queryClient.invalidateQueries({
      queryKey: ['files', searchParams.search, searchParams.department, searchParams.page],
    })

    setIsDeleting(false)
    navigate({ to: '/files' })
  }

  return (
    <div>
      <div>
        <div
          role='button'
          onClick={() => window.open(storedFile.storageUrl, '_blank')}
          className='flex items-center justify-between bg-secondary rounded-2xl p-4 cursor-pointer hover:border-primary hover:border'
        >
          <div className='flex items-center gap-x-2'>
            <div className='size-16'>
              <img
                src={`/${storedFile.fileName
                  .split('.')
                  .at(storedFile.fileName.split('.').length - 1)
                  ?.slice(0, 3)}.png`}
                alt={storedFile.fileName}
                className='object-contain'
              />
            </div>
            <span className='text-lg font-semibold'>{storedFile.fileName}</span>
          </div>
        </div>

        {!summary && tags.length === 0 && (
          <Button
            disabled={isAnalyzing}
            onClick={handleSummarize}
            variant={'outline'}
            className='w-full my-4 border-primary text-primary font-semibold rounded-lg bg-accent hover:text-primary'
          >
            {isAnalyzing ? (
              <Loader className='size-5 animate-spin' />
            ) : (
              <Lightbulb className='size-5' />
            )}
            {isAnalyzing ? 'Summarizing with AI...' : 'Summarize with AI'}
          </Button>
        )}

        {summary && tags.length > 0 && department && (
          <div className='bg-secondary max-w-full p-3 space-y-4 rounded-2xl my-4'>
            <p className='text-sm'>{summary}</p>

            <div className='flex items-center gap-2 flex-wrap '>
              {tags.map((tag, index) => (
                <Badge key={index} className='bg-accent text-primary lowercase font-bold'>
                  {tag}
                </Badge>
              ))}
            </div>

            <div className='my-4'>
              <h4 className='font-semibold text-sm'>{department} Department</h4>
            </div>
          </div>
        )}

        <div className='flex items-center justify-end'>
          <div className='flex items-center gap-x-2'>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={'outline'}
                  className='border-destructive hover:text-destructive text-destructive hover:bg-destructive/10'
                >
                  <Trash2 className='text-destructive' />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your file from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant={'destructive'}
                    disabled={isDeleting}
                    onClick={() => handleDelete(storedFile.id)}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  )
}
