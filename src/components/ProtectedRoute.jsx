import React from 'react'
import { useAuthenticationStatus } from '@nhost/react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthenticationStatus()

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
