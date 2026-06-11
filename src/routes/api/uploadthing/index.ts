import { uploadRouter } from '#/lib/uploadthing'
import { createFileRoute } from '@tanstack/react-router'
import { createRouteHandler } from 'uploadthing/server'

const handler = createRouteHandler({ router: uploadRouter })

export const Route = createFileRoute('/api/uploadthing/')({
  server: {
    handlers: { GET: ({ request }) => handler(request), POST: ({ request }) => handler(request) },
  },
})
