export interface UserRecord {
  id: string
  name: string
  email: string
  passwordHash: string
  phone?: string
  birthDate?: string
  savedTourIds?: string[]
  updatedAt?: string
  createdAt: string
}

const USERS_KEY = 'users'

export const readUsers = async (): Promise<UserRecord[]> => {
  const storage = useStorage('data')
  const raw = await storage.getItem<UserRecord[]>(USERS_KEY)
  if (!Array.isArray(raw)) {
    return []
  }

  return raw
}

export const writeUsers = async (users: UserRecord[]): Promise<void> => {
  const storage = useStorage('data')
  await storage.setItem(USERS_KEY, users)
}
