import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useState } from 'react'

import { supaClient } from '../supa-client'

import Dialog from './Dialog'

export const setReturnPath = () => {
  localStorage.setItem('returnPath', window.location.pathname)
}

export const Login = () => {
  const [showModal, setShowModal] = useState(false)
  const [authMode, setAuthMode] = useState<'sign_in' | 'sign_up'>('sign_in')

  return (
    <>
      <div className="flex m-4 place-items-container">
        <button
          onClick={() => {
            setShowModal(true)
            setAuthMode('sign_in')
            setReturnPath()
          }}
        >
          login
        </button>{' '}
        <span className="p-2">or</span>{' '}
        <button
          onClick={() => {
            setShowModal(true)
            setAuthMode('sign_up')
            setReturnPath()
          }}
        >
          Sign Up
        </button>
      </div>

      <Dialog
        open={showModal}
        contents={
          <>
            <Auth
              view={authMode}
              supabaseClient={supaClient}
              appearance={{
                theme: ThemeSupa,
                className: {
                  container: 'login-form-container',
                  label: 'login-form-label',
                  button: 'login-form-button',
                  input: 'login-form-input',
                },
              }}
            />
          </>
        }
        dialogStateChange={setShowModal}
      />
    </>
  )
}
