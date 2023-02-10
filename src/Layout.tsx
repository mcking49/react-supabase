import { Outlet } from 'react-router-dom'

import NavBar from './NavBar'
import UserProvider from './providers/user-provider'

const Layout = () => {
  return (
    <UserProvider>
      <NavBar />
      <Outlet />
    </UserProvider>
  )
}

export default Layout
