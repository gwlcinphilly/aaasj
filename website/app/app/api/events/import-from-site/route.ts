import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { EventItem } from '@/lib/types'
import { siteAllEvents } from '@/lib/static-events'

const dataFile = path.join(process.cwd(), 'app', 'data', 'events.json')

async function ensureFile() {
  try {
    await fs.access(dataFile)
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true })
    await fs.writeFile(dataFile, '[]', 'utf-8')
  }
}

async function readEvents(): Promise<EventItem[]> {
  await ensureFile()
  const raw = await fs.readFile(dataFile, 'utf-8')
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeEvents(events: EventItem[]) {
  await fs.writeFile(dataFile, JSON.stringify(events, null, 2), 'utf-8')
}

export async function POST(_req: NextRequest) {
  const existing = await readEvents()
  // Merge by title+date heuristic
  const key = (e: EventItem) => `${e.title}|${e.date}`
  const existingKeys = new Set(existing.map(key))

  const toAdd = siteAllEvents.filter((e) => !existingKeys.has(key(e)))
  const merged = [...existing, ...toAdd]
  await writeEvents(merged)
  return Response.json({ added: toAdd.length, total: merged.length })
}


