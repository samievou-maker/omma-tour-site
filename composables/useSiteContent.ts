import type { SiteContent } from '~/types/tour'

export const useSiteContent = async () => {
  const response = await useFetch<SiteContent>('/api/content', {
    key: 'site-content'
  })

  return response
}
