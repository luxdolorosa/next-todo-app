import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import Todo from '@/models/Todo'

// GET: 모든 투두 조회
export async function GET() {
  try {
    await connectDB()
    const todos = await Todo.find({}).sort({ createdAt: -1 }).lean()
    
    // _id를 문자열로 변환 (lean() 사용 시 필요)
    const formattedTodos = todos.map(todo => ({
      ...todo,
      _id: todo._id.toString()
    }))
    
    return NextResponse.json({ todos: formattedTodos }, { status: 200 })
  } catch (error) {
    console.error('Error fetching todos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    )
  }
}

// POST: 새 투두 생성
export async function POST(request) {
  try {
    const { text } = await request.json()
    
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Todo text is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const todo = await Todo.create({
      text: text.trim(),
      completed: false,
    })
    
    return NextResponse.json(
      {
        _id: todo._id.toString(),
        text: todo.text,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating todo:', error)
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    )
  }
}

// PUT: 투두 수정 (완료 상태 토글)
export async function PUT(request) {
  try {
    const { _id, text, completed } = await request.json()
    
    if (!_id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      )
    }

    await connectDB()
    
    const updateData = {}
    
    if (text !== undefined) {
      updateData.text = text.trim()
    }
    
    if (completed !== undefined) {
      updateData.completed = completed
    }
    
    const todo = await Todo.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    )
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Todo updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating todo:', error)
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    )
  }
}

// DELETE: 투두 삭제
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const _id = searchParams.get('_id')
    
    if (!_id) {
      return NextResponse.json(
        { error: 'Todo ID is required' },
        { status: 400 }
      )
    }

    await connectDB()
    const todo = await Todo.findByIdAndDelete(_id)
    
    if (!todo) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: 'Todo deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting todo:', error)
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    )
  }
}

