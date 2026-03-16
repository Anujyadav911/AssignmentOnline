import { gql } from '@apollo/client'

export const GET_TODOS = gql`
  query GetTodos {
    todos(order_by: { created_at: desc }) {
      id
      title
      is_completed
      created_at
    }
  }
`

export const INSERT_TODO = gql`
  mutation InsertTodo($title: String!, $user_id: uuid!) {
    insert_todos_one(
      object: { title: $title, is_completed: false, user_id: $user_id }
    ) {
      id
      title
      is_completed
      created_at
    }
  }
`

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: uuid!, $is_completed: Boolean!) {
    update_todos_by_pk(
      pk_columns: { id: $id }
      _set: { is_completed: $is_completed }
    ) {
      id
      is_completed
    }
  }
`

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`

export const UPDATE_TODO_TITLE = gql`
  mutation UpdateTodoTitle($id: uuid!, $title: String!) {
    update_todos_by_pk(
      pk_columns: { id: $id }
      _set: { title: $title }
    ) {
      id
      title
    }
  }
`
