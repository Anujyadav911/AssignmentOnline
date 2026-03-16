import React, { useState } from 'react'
import { useSignUpEmailPassword } from '@nhost/react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const { signUpEmailPassword, isLoading, isError, error, needsEmailVerification } =
    useSignUpEmailPassword()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { isSuccess } = await signUpEmailPassword(email, password, {
      displayName,
    })
    if (isSuccess) navigate('/')
  }

  if (needsEmailVerification) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">📝 Nhost Todo</h1>
          <div className="verify-msg">
            <span className="verify-icon">📧</span>
            <h2>Check your email</h2>
            <p>
              A verification link has been sent to <strong>{email}</strong>.
              Please verify your email to continue.
            </p>
            <Link to="/login" className="btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">📝 Nhost Todo</h1>
        <h2 className="auth-subtitle">Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
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
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {isError && (
            <p className="error-msg">
              {error?.message || 'Registration failed. Please try again.'}
            </p>
          )}
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
