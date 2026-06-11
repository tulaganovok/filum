import { PDFParse } from 'pdf-parse'
import { createServerFn } from '@tanstack/react-start'
import {
  deleteStoredFileSchema,
  fileSchema,
  getUserFileByIdSchema,
  getUserFilesSchema,
  saveDraftedFileSchema,
  storeFileSchema,
  summarizeWithAISchema,
  updateStoredFileSchema,
} from './schema'
import { extractRawText } from 'mammoth'
import * as XLSX from 'xlsx'
import { authFnMiddleware } from '#/middleware/auth'
import { db } from '#/db/index'
import { file } from '#/db/schema'
import { openai } from '#/lib/open-ai'
import { and, count, desc, eq, ilike } from 'drizzle-orm'
import { utapi } from '#/lib/uploadthing'
import { notFound } from '@tanstack/react-router'

export const extractPdfContentFn = createServerFn({
  method: 'POST',
})
  .validator(fileSchema)
  .handler(async ({ data: { url } }) => {
    const parser = new PDFParse({ url })
    const pdf = await parser.getText()
    return { content: pdf.text }
  })

export const extractDocContentFn = createServerFn({
  method: 'POST',
})
  .validator(fileSchema)
  .handler(async ({ data: { url } }) => {
    const response = await fetch(url)
    const buffer = Buffer.from(await response.arrayBuffer())

    const { value } = await extractRawText({
      buffer,
    })

    return { content: value }
  })

export const extractCellContentFn = createServerFn({ method: 'POST' })
  .validator(fileSchema)
  .handler(async ({ data: { url } }) => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()

    const workbook = XLSX.read(arrayBuffer)

    const sheet = workbook.Sheets[workbook.SheetNames[0]]

    const rows = XLSX.utils.sheet_to_json(sheet)

    return { content: JSON.stringify(rows) }
  })

export const storeFileFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .validator(storeFileSchema)
  .handler(async ({ data, context }) => {
    const [storedFile] = await db
      .insert(file)
      .values({ ...data, userId: context.session.user.id })
      .returning()

    return storedFile
  })

export const summarizeWithAIFn = createServerFn({ method: 'POST' })
  .validator(summarizeWithAISchema)
  .handler(async ({ data: { content } }) => {
    const response = await openai.responses.create({
      model: 'gpt-5',
      input: [
        {
          role: 'user',
          content: `
You are an expert document analyst. Generate short, concise and accurate summary for the document below.

Document:
${content}
`,
        },
      ],
    })

    return response.output_text
  })

export const generateTagsWithAIFn = createServerFn({ method: 'POST' })
  .validator(summarizeWithAISchema)
  .handler(async ({ data: { content } }) => {
    const response = await openai.responses.create({
      model: 'gpt-5',
      input: [
        {
          role: 'user',
          content: `
You are an expert document analyst. Generate maximum five short tags through comma for this document. Each tag must be only consists maximum two words.

Document:
${content}
`,
        },
      ],
    })

    return response.output_text
  })

export const generateDepartmentWithAIFn = createServerFn({ method: 'POST' })
  .validator(summarizeWithAISchema)
  .handler(async ({ data: { content } }) => {
    const response = await openai.responses.create({
      model: 'gpt-5',
      input: [
        {
          role: 'user',
          content: `
You are an expert document analyst. Generate department that the documents belongs. Generated department must be only the following department: IT, HR, Accounting and Other.

Document:
${content}
`,
        },
      ],
    })

    return response.output_text
  })

export const updateStoredFileFn = createServerFn({ method: 'POST' })
  .validator(updateStoredFileSchema)
  .handler(async ({ data: { id, summary, tags, department } }) => {
    await db.update(file).set({ summary, tags, department }).where(eq(file.id, id))
  })

export const deleteDraftedFileFn = createServerFn({
  method: 'POST',
})
  .middleware([authFnMiddleware])
  .validator(deleteStoredFileSchema)
  .handler(async ({ data: { id }, context }) => {
    const [deletedFile] = await db
      .delete(file)
      .where(and(eq(file.id, id), eq(file.userId, context.session.user.id)))
      .returning()

    if (!deletedFile) {
      throw new Error('File not found or unauthorized')
    }

    await utapi.deleteFiles(deletedFile.storageKey)

    return deletedFile
  })

export const saveDraftedFileFn = createServerFn({
  method: 'POST',
})
  .middleware([authFnMiddleware])
  .validator(saveDraftedFileSchema)
  .handler(async ({ data: { id }, context }) => {
    await db
      .update(file)
      .set({ status: 'saved' })
      .where(and(eq(file.id, id), eq(file.userId, context.session.user.id)))
  })

export const getUserFilesFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .validator(getUserFilesSchema)
  .handler(async ({ data, context }) => {
    const { search, page, pageSize, department } = data

    const filteredFiles = await db
      .select()
      .from(file)
      .where(
        and(
          eq(file.userId, context.session.user.id),
          eq(file.status, 'saved'),
          search ? ilike(file.fileName, `%${search}%`) : undefined,
          department && department !== 'All' ? eq(file.department, department) : undefined,
        ),
      )
      .orderBy(desc(file.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize)

    const [totalFiles] = await db
      .select({ count: count() })
      .from(file)
      .where(
        and(
          eq(file.userId, context.session.user.id),
          eq(file.status, 'saved'),
          search ? ilike(file.fileName, `%${search}%`) : undefined,
          department && department !== 'All' ? eq(file.department, department) : undefined,
        ),
      )

    const totalFilesPages = Math.ceil(totalFiles.count / pageSize)

    return {
      files: filteredFiles,
      total: totalFiles.count,
      totalPages: totalFilesPages,
    }
  })

export const getUserFileByIdFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .validator(getUserFileByIdSchema)
  .handler(async ({ data, context }) => {
    const [selectedFile] = await db
      .select()
      .from(file)
      .where(and(eq(file.id, data.id), eq(file.userId, context.session.user.id)))

    if (!selectedFile) throw notFound()

    return selectedFile
  })
