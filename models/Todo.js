import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Todo text is required'],
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 관리
  }
)

// 개발 환경에서만 모델이 이미 존재하는지 확인
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema)

export default Todo

