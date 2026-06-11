import z from 'zod'

export const fileSchema = z.object({
  url: z.url('Invalid URL').trim(),
})

export const storeFileSchema = z.object({
  fileName: z.string(),
  storageKey: z.string(),
  storageUrl: z.url(),
  summary: z.string().nullable(),
  tags: z.string().array().default([]),
})

export const summarizeWithAISchema = z.object({
  content: z.string(),
})

export const updateStoredFileSchema = z.object({
  id: z.string(),
  summary: z.string(),
  tags: z.string().array(),
  department: z.string(),
})

export const deleteStoredFileSchema = z.object({
  id: z.string(),
})

export const saveDraftedFileSchema = z.object({
  id: z.string(),
})

export const getUserFileByIdSchema = z.object({
  id: z.string(),
})

export const filesSearchSchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  page: z.number().optional(),
})

export const DEFAULT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 100
export const MIN_PAGE_SIZE = 1

export const getUserFilesSchema = z.object({
  page: z.number().default(DEFAULT_PAGE),
  pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  department: z.string().optional(),
})
