import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import AllPosts from './AllPosts'
import Layout from './Layout'
import MessageBoard from './MessageBoard'
import PostView from './PostView'
import Welcome, { welcomeLoader } from './Welcome'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <MessageBoard />,
        children: [
          {
            path: ':pageNumber',
            element: <AllPosts />,
          },
          {
            path: 'post/:postId',
            element: <PostView />,
          },
        ],
      },
      {
        path: 'welcome',
        element: <Welcome />,
        loader: welcomeLoader,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
