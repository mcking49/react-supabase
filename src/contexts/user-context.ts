import { createContext } from 'react'

import { SupashipUserInfo } from '../hooks/use-session'

export const UserContext = createContext<SupashipUserInfo>({
  session: null,
  profile: null,
})
