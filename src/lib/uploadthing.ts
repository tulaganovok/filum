import { createUploadthing } from 'uploadthing/server'
import type { FileRouter } from 'uploadthing/server'
import { UTApi } from 'uploadthing/server'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const uploadRouter = {
  documentUploader: f({
    blob: {
      maxFileSize: '32MB',
      maxFileCount: 1,
    },
  }).onUploadComplete(async ({}) => {}),
  // Define as many FileRoutes as you like, each with a unique routeSlug
} satisfies FileRouter

// lib/uploadthing.ts

export const utapi = new UTApi()

export type UploadRouter = typeof uploadRouter
