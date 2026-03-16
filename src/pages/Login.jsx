import React, { useState } from 'react'
import { useSignInEmailPassword } from '@nhost/react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInEmailPassword, isLoading, isError, error } = useSignInEmailPassword()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { isSuccess } = await signInEmailPassword(email, password)
    if (isSuccess) navigate('/')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">📝 Nhost Todo</h1>
        <h2 className="auth-subtitle">Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isError && (
            <p className="error-msg">
              {error?.message || 'Invalid credentials. Please try again.'}
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
