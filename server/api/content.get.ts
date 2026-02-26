import { readContent } from '~/server/utils/contentStore'

export default defineEventHandler(async () => readContent())
