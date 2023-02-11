import { Link } from 'react-router-dom'

import { Login } from './components/Login'
import UserMenu from './components/UserMenu'
import { useUser } from './hooks/use-user'

const NavBar = () => {
  const { session } = useUser()

  return (
    <nav className="nav-bar">
      <Link className="nav-logo-link" to="/">
        <img
          src="https://supaship.io/supaship_logo_with_text.svg"
          alt="logo"
          className="nav-logo"
          id="logo"
        />
      </Link>

      <ul className="nav-right-list">
        <li className="nav-message-board-list-item">
          <Link to="/1" className="nav-message-board-link">
            message board
          </Link>
        </li>
        <li className="nav-auth-item">{session?.user ? <UserMenu /> : <Login />}</li>
      </ul>
    </nav>
  )
}

export default NavBar
