import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Lightbulb, Loader, Save, Upload, X } from 'lucide-react'
import { useUploadThing } from '../utils/uploadthing'
import { useRef, useState } from 'react'
import {
  deleteDraftedFileFn,
  extractCellContentFn,
  extractDocContentFn,
  extractPdfContentFn,
  generateDepartmentWithAIFn,
  generateTagsWithAIFn,
  saveDraftedFileFn,
  storeFileFn,
  summarizeWithAIFn,
  updateStoredFileFn,
} from '../utils/functions'
import { Progress } from '#/components/ui/progress'
import { Badge } from '#/components/ui/badge'
import type { File as StoredFile } from '#/db/schema'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'

export default function UploadBox() {
  const { startUpload } = useUploadThing('documentUploader')
  const [storedFile, setStoredFile] = useState<StoredFile | null>(null)
  const [file, setFile] = useState<File>()
  const [fileContent, setFileContent] = useState('')
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [summary, setSummary] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [department, setDepartment] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDiscarding, setIsDiscarding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const searchParams = useSearch({ strict:false })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    try {
      setIsProcessing(true)
      setProgress(10)

      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      const extension = selectedFile.name.split('.').pop()?.toLowerCase()

      setProgress(33)

      const data = await startUpload([selectedFile])
      const storageKey = data?.[0].key
      const storageUrl = data?.[0].ufsUrl

      if (!storageKey || !storageUrl) {
        throw new Error('Upload failed')
      }

      setProgress(67)

      let content = ''

      if (extension === 'pdf') {
        const result = await extractPdfContentFn({
          data: { url: data[0].ufsUrl },
        })

        content = result.content
      }

      if (extension === 'doc' || extension === 'docx') {
        const result = await extractDocContentFn({
          data: { url: data[0].ufsUrl },
        })

        content = result.content
      }

      if (extension === 'xls' || extension === 'xlsx') {
        const result = await extractCellContentFn({
          data: { url: data[0].ufsUrl },
        })

        content = result.content
      }

      setProgress(90)
      setFileContent(content)
      setProgress(100)

      const storedFileData = await storeFileFn({
        data: {
          fileName: selectedFile.name,
          storageKey,
          storageUrl,
          summary: null,
        },
      })

      setStoredFile(storedFileData)

      setTimeout(() => {
        setIsProcessing(false)
      }, 1000)
    } catch (error) {
      console.error(error)
      setIsProcessing(false)
      setProgress(0)
    }
  }

  const handleSummarize = async () => {
    if (!file || !fileContent || !storedFile) return

    setIsAnalyzing(true)

    const aiSummary = await summarizeWithAIFn({ data: { content: fileContent } })
    const aiTags = await generateTagsWithAIFn({ data: { content: fileContent } })
    const department = await generateDepartmentWithAIFn({ data: { content: fileContent } })

    await updateStoredFileFn({
      data: { id: storedFile.id, summary: aiSummary, tags: aiTags.split(', '), department },
    })

    setIsAnalyzing(false)
    setSummary(aiSummary)
    setTags(aiTags.split(', '))
    setDepartment(department)
  }

  const handleDiscard = async (id: string) => {
    setIsDiscarding(true)

    await deleteDraftedFileFn({ data: { id } })
    setIsDiscarding(false)
    setStoredFile(null)
  }

  const handleSave = async (id: string) => {
    setIsSaving(true)

    await saveDraftedFileFn({ data: { id } })
    await queryClient.invalidateQueries({
      queryKey: ['files', searchParams.search, searchParams.department, searchParams.page],
    })

    setIsSaving(false)
    navigate({ to: '/files' })
    setStoredFile(null)
  }

  return (
    <div>
      {!storedFile && !isProcessing && (
        <div>
          <div
            role='button'
            onClick={() => inputRef.current?.click()}
            className='w-full h-64 flex items-center justify-center bg-secondary rounded-2xl border-2 border-muted-foreground border-dashed'
          >
            <div className='flex flex-col items-center'>
              <Upload className='size-24 text-muted-foreground' />
              <h4 className='text-muted-foreground font-bold'>Upload your file</h4>
              <span className='text-sm text-muted-foreground'>
                Accepted file formats are .pdf, .doc, .docx, .xls, xlsx
              </span>
            </div>
          </div>

          <Input
            ref={inputRef}
            id='file'
            type='file'
            accept='.pdf,.doc,.docx,.xls,.xlsx,.csv'
            className='hidden'
            disabled={isProcessing}
            onChange={handleFileChange}
          />
        </div>
      )}

      {isProcessing && (
        <div className='space-y-2'>
          <Progress value={progress} />
          <p className='text-sm text-muted-foreground text-center'>{progress}% uploaded</p>
        </div>
      )}

      {storedFile && (
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

          {fileContent && !summary && tags.length === 0 && (
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
              <Button
                variant={'outline'}
                disabled={isDiscarding}
                onClick={() => handleDiscard(storedFile.id)}
              >
                <X />
                Discard
              </Button>

              <Button disabled={isSaving} onClick={() => handleSave(storedFile.id)}>
                <Save />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
