import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useAuthQuery } from '@nhost/react-apollo'
import { useUserData, useSignOut } from '@nhost/react'
import {
  GET_TODOS,
  INSERT_TODO,
  TOGGLE_TODO,
  DELETE_TODO,
  UPDATE_TODO_TITLE,
} from '../graphql/todos'

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.title)

  const handleEditSubmit = (e) => {
    e.preventDefault()
    if (editValue.trim()) {
      onEdit(todo.id, editValue.trim())
      setEditing(false)
    }
  }

  return (
    <li className={`todo-item ${todo.is_completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.is_completed}
        onChange={() => onToggle(todo.id, !todo.is_completed)}
        className="todo-checkbox"
      />
      {editing ? (
        <form onSubmit={handleEditSubmit} className="edit-form">
          <input
            autoFocus
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="edit-input"
          />
          <button type="submit" className="btn-icon save">✓</button>
          <button type="button" className="btn-icon cancel" onClick={() => setEditing(false)}>✕</button>
        </form>
      ) : (
        <>
          <span className="todo-title" onDoubleClick={() => setEditing(true)}>
            {todo.title}
          </span>
          <div className="todo-actions">
            <button
              className="btn-icon edit"
              onClick={() => setEditing(true)}
              title="Edit"
            >✏️</button>
            <button
              className="btn-icon delete"
              onClick={() => onDelete(todo.id)}
              title="Delete"
            >🗑️</button>
          </div>
        </>
      )}
    </li>
  )
}

export default function Dashboard() {
  const user = useUserData()
  const { signOut } = useSignOut()
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all') // all | active | completed

  const { data, loading, error } = useAuthQuery(GET_TODOS)
  const [insertTodo] = useMutation(INSERT_TODO, {
    refetchQueries: [GET_TODOS],
  })
  const [toggleTodo] = useMutation(TOGGLE_TODO, {
    refetchQueries: [GET_TODOS],
  })
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [GET_TODOS],
  })
  const [updateTodoTitle] = useMutation(UPDATE_TODO_TITLE, {
    refetchQueries: [GET_TODOS],
  })

  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    await insertTodo({ variables: { title: newTodo.trim() } })
    setNewTodo('')
  }

  const handleToggle = (id, is_completed) => {
    toggleTodo({ variables: { id, is_completed } })
  }

  const handleDelete = (id) => {
    deleteTodo({ variables: { id } })
  }

  const handleEdit = (id, title) => {
    updateTodoTitle({ variables: { id, title } })
  }

  const todos = data?.todos || []
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.is_completed
    if (filter === 'completed') return t.is_completed
    return true
  })

  const activeCount = todos.filter((t) => !t.is_completed).length
  const completedCount = todos.filter((t) => t.is_completed).length

  const queryErrorMessage =
    error?.graphQLErrors?.[0]?.message ||
    error?.networkError?.result?.errors?.[0]?.message ||
    error?.message ||
    ''

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <h1 className="app-title">📝 Nhost Todo</h1>
          <div className="user-info">
            <span>👤 {user?.displayName || user?.email}</span>
            <button className="btn-signout" onClick={signOut}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {/* Add Todo */}
        <form onSubmit={handleAddTodo} className="add-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="add-input"
          />
          <button type="submit" className="btn-add">+ Add</button>
        </form>

        {/* Stats */}
        <div className="stats">
          <span>{activeCount} task{activeCount !== 1 ? 's' : ''} left</span>
          <span>✅ {completedCount} completed</span>
        </div>

        {/* Filter */}
        <div className="filters">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        {loading && <p className="status-msg">Loading todos…</p>}
        {error && (
          <p className="error-msg">
            Error loading todos: {queryErrorMessage || 'Check your Nhost configuration.'}
          </p>
        )}
        {!loading && !error && filteredTodos.length === 0 && (
          <p className="empty-msg">
            {filter === 'all'
              ? '🎉 No todos yet. Add one above!'
              : `No ${filter} todos.`}
          </p>
        )}
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      </main>
    </div>
  )
}
