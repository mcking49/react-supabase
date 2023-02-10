import { FC, PropsWithChildren } from 'react'

import { UserContext } from '../contexts/user-context'
import { useSession } from '../hooks/use-session'

const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const supaShipUserInfo = useSession()

  return <UserContext.Provider value={supaShipUserInfo}>{children}</UserContext.Provider>
}

export default UserProvider
