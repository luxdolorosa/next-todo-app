// lib/logger.js
import winston from 'winston'

// level과 message만 포함하는 커스텀 포맷
const customFormat = winston.format.printf(({ level, message }) => {
  return JSON.stringify({ level, message })
})

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),  // 타임스탬프는 내부적으로 사용
    customFormat                  // level과 message만 출력
  ),
  transports: [
    new winston.transports.Console()
  ]
})

export default logger