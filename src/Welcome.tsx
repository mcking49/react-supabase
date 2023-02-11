import { useMemo, useState } from 'react'
import { redirect, useNavigate } from 'react-router-dom'

import Dialog from './components/Dialog'
import { useUser } from './hooks/use-user'
import { supaClient } from './supa-client'

export async function welcomeLoader() {
  const {
    data: { user },
  } = await supaClient.auth.getUser()

  if (!user) {
    return redirect('/')
  }

  const { data } = await supaClient
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (data?.username) {
    return redirect('/')
  }
}

/**
 * This only validates the form on the front end.
 * Server side validation is done at the sql level.
 */
function validateUsername(username: string): string | undefined {
  if (!username) {
    return 'Username is required'
  }

  const regex = /^[a-zA-Z0-9_]+$/

  if (username.length < 4) {
    return 'Username must be at least 4 characters long'
  }

  if (username.length > 14) {
    return 'Username must be less than 15 characters long'
  }

  if (!regex.test(username)) {
    return 'Username can only contain letters, numbers, and underscores'
  }

  return undefined
}

const Welcome = () => {
  const user = useUser()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const [serverError, setServerError] = useState('')
  const [formIsDirty, setFormIsDirty] = useState(false)
  const invalidString = useMemo(() => validateUsername(userName), [userName])

  return (
    <Dialog
      allowClose={false}
      open={true}
      contents={
        <>
          <h2 className="welcome-header">Welcome to Supaship!!</h2>
          <p className="text-center">Let's get started by creating a username:</p>

          <form
            className="welcome-name-form"
            onSubmit={(event) => {
              event.preventDefault()
              supaClient
                .from('user_profiles')
                .insert([{ user_id: user.session?.user.id || '', username: userName }])
                .then(({ error }) => {
                  if (error) {
                    setServerError(`Username "${userName}" is already taken`)
                  } else {
                    const target = localStorage.getItem('returnPath') || '/'
                    localStorage.removeItem('returnPath')
                    navigate(target)
                  }
                })
            }}
          >
            <input
              type="text"
              className="welcome-name-input"
              name="username"
              placeholder="Username"
              onChange={({ target }) => {
                setUserName(target.value)

                if (!formIsDirty) {
                  setFormIsDirty(true)
                }

                if (serverError) {
                  setServerError('')
                }
              }}
            />

            {formIsDirty && (invalidString || serverError) && (
              <p className="welcome-form-error-message validation-feedback">
                {serverError || invalidString}
              </p>
            )}
          </form>
        </>
      }
    />
  )
}

export default Welcome
