import { Link, Outlet } from 'react-router-dom'

import { Login } from './components/Login'
import { useUser } from './hooks/use-user'

const MessageBoard = () => {
  const userProfile = useUser()

  return (
    <div className="message-board-container">
      <Link to="/1">
        <h2 className="message-board-header-link">Message Board</h2>
      </Link>

      {userProfile.session ? (
        <></>
      ) : (
        <h2 className="message-board-login-message" data-e2e="message-board-login">
          Yo Dawg. You gotta <Login /> to join in the discussion.
        </h2>
      )}

      <Outlet />
    </div>
  )
}

export default MessageBoard
