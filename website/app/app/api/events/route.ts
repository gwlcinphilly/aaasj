import { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { EventItem } from '@/lib/types'

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

export async function GET() {
  const events = await readEvents()
  // Sort: upcoming first by date asc, then past by date desc
  const now = new Date()
  const [upcoming, past] = events.reduce<[EventItem[], EventItem[]]>(
    (acc, e) => {
      if (e.status === 'upcoming') acc[0].push(e)
      else acc[1].push(e)
      return acc
    },
    [[], []]
  )
  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return Response.json([...upcoming, ...past])
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<EventItem>
    if (!body.title || !body.date) {
      return new Response('Missing required fields: title, date', { status: 400 })
    }
    const newEvent: EventItem = {
      id: randomUUID(),
      title: String(body.title),
      date: String(body.date),
      time: body.time ? String(body.time) : undefined,
      location: body.location ? String(body.location) : undefined,
      description: body.description ? String(body.description) : undefined,
      image: body.image ? String(body.image) : undefined,
      category: body.category ? String(body.category) : undefined,
      status: body.status === 'past' ? 'past' : 'upcoming',
      link: body.link ? String(body.link) : undefined,
    }
    const events = await readEvents()
    events.push(newEvent)
    await writeEvents(events)
    return Response.json(newEvent, { status: 201 })
  } catch (e: any) {
    return new Response(e?.message || 'Invalid JSON', { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<EventItem> & { id?: string }
    if (!body.id) return new Response('Missing id', { status: 400 })
    const events = await readEvents()
    const idx = events.findIndex((e) => e.id === body.id)
    if (idx === -1) return new Response('Not found', { status: 404 })
    const updated: EventItem = {
      ...events[idx],
      ...body,
      status: body.status === 'past' ? 'past' : body.status === 'upcoming' ? 'upcoming' : events[idx].status,
    }
    events[idx] = updated
    await writeEvents(events)
    return Response.json(updated)
  } catch (e: any) {
    return new Response(e?.message || 'Invalid JSON', { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })
  const events = await readEvents()
  const filtered = events.filter((e) => e.id !== id)
  await writeEvents(filtered)
  return new Response(null, { status: 204 })
}


