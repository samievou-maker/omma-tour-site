interface SavedToursResponse {
  savedTourIds: string[]
}

export const useSavedTours = () => {
  const savedTourIds = useState<string[]>('saved-tour-ids', () => [])
  const loaded = useState<boolean>('saved-tour-loaded', () => false)
  const authenticated = useState<boolean>('saved-tour-authenticated', () => false)
  const loading = useState<boolean>('saved-tour-loading', () => false)

  const ensureLoaded = async (): Promise<void> => {
    if (loaded.value || loading.value) {
      return
    }

    loading.value = true
    try {
      const response = await $fetch<SavedToursResponse>('/api/account/saved')
      savedTourIds.value = response.savedTourIds
      authenticated.value = true
    } catch {
      savedTourIds.value = []
      authenticated.value = false
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  const isSaved = (tourId: string): boolean => savedTourIds.value.includes(tourId)

  const toggleSaved = async (tourId: string): Promise<boolean> => {
    try {
      const response = await $fetch<{ saved: boolean; savedTourIds: string[] }>('/api/account/saved', {
        method: 'POST',
        body: { tourId }
      })

      savedTourIds.value = response.savedTourIds
      authenticated.value = true
      loaded.value = true
      return response.saved
    } catch {
      await navigateTo('/auth')
      return false
    }
  }

  return {
    savedTourIds,
    authenticated,
    ensureLoaded,
    isSaved,
    toggleSaved
  }
}
