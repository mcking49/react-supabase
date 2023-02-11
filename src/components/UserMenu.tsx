import { useUser } from '../hooks/use-user'
import { supaClient } from '../supa-client'

const UserMenu = () => {
  const { profile } = useUser()

  return (
    <div className="flex flex-col">
      <h2>Welcome {profile?.username || 'dawg'}</h2>

      <button onClick={() => supaClient.auth.signOut()} className="user-menu-logout-button">
        Logout
      </button>
    </div>
  )
}

export default UserMenu
