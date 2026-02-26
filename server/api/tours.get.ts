import { readContent } from '~/server/utils/contentStore'

export default defineEventHandler(async () => {
  const content = await readContent()
  return content.tours
})
