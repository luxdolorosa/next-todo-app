'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // 투두 목록 불러오기
  const fetchTodos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/todos')
      const data = await response.json()
      if (response.ok) {
        setTodos(data.todos)
      }
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // 새 투두 추가
  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newTodo }),
      })

      if (response.ok) {
        setNewTodo('')
        fetchTodos()
      }
    } catch (error) {
      console.error('Error adding todo:', error)
    } finally {
      setSubmitting(false)
    }
  }

  // 투두 완료 상태 토글
  const handleToggleTodo = async (_id, completed) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id, completed: !completed }),
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  // 투두 삭제
  const handleDeleteTodo = async (_id) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/todos?_id=${_id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            📝 Todo App 1
          </h1>

          {/* 투두 추가 폼 */}
          <form onSubmit={handleAddTodo} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="새로운 할 일을 입력하세요..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !newTodo.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? '추가 중...' : '추가'}
              </button>
            </div>
          </form>

          {/* 투두 목록 */}
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                로딩 중...
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                할 일이 없습니다. 새로운 할 일을 추가해보세요!
              </div>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo._id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                    todo.completed
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-300 hover:border-indigo-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo._id, todo.completed)}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 통계 */}
          {!loading && todos.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
              전체: {todos.length}개 | 완료: {todos.filter((t) => t.completed).length}개 | 미완료: {todos.filter((t) => !t.completed).length}개
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

