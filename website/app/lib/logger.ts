import { promises as fs } from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'app', 'logs')
const LOG_FILE = path.join(LOG_DIR, 'app.log')

async function ensureLogFile() {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true })
  } catch {}
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export async function logToFile(level: LogLevel, message: string, data?: unknown) {
  try {
    await ensureLogFile()
    const entry = {
      ts: new Date().toISOString(),
      level,
      message,
      data,
    }
    const line = JSON.stringify(entry) + '\n'
    await fs.appendFile(LOG_FILE, line, 'utf-8')
  } catch {
    // swallow logging errors
  }
}

export function getLogFilePath() {
  return LOG_FILE
}


