import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import nhost from './nhost'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

export default function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NhostApolloProvider>
    </NhostProvider>
  )
}
