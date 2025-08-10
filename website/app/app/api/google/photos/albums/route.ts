import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logToFile } from '@/lib/logger'

async function getAccessToken() {
  const session = await getServerSession(authOptions)
  const token = (session as any)?.accessToken as string | undefined
  return token
}

export async function GET(req: NextRequest) {
  const accessToken = await getAccessToken()
  if (!accessToken) return new Response('Unauthorized', { status: 401 })

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }

  const debugEnabled = req.nextUrl.searchParams.get('debug') === '1'
  const debug: any = { haveAccessToken: Boolean(accessToken) }

  // Try tokeninfo for scope/client diagnostics
  try {
    const infoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`, { cache: 'no-store' })
    debug.tokenInfoStatus = infoRes.status
    debug.tokenInfo = infoRes.ok ? await infoRes.json() : await infoRes.text()
  } catch (e: any) {
    debug.tokenInfoError = e?.message || String(e)
  }

  // paginate owned albums
  let owned: any[] = []
  let pageToken: string | undefined
  for (let i = 0; i < 50; i++) {
    const url = new URL('https://photoslibrary.googleapis.com/v1/albums')
    url.searchParams.set('pageSize', '50')
    if (pageToken) url.searchParams.set('pageToken', pageToken)
    const res = await fetch(url.toString(), { headers, cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text()
      debug.albumsErrorStatus = res.status
      debug.albumsError = text
      if (!debugEnabled) return new Response(text || 'Failed to fetch albums', { status: res.status })
      break
    }
    const data = await res.json()
    owned = owned.concat(data.albums || [])
    pageToken = data.nextPageToken
    if (!pageToken) break
  }
  debug.ownedCount = owned.length

  // paginate shared albums
  let shared: any[] = []
  let sharedToken: string | undefined
  for (let i = 0; i < 50; i++) {
    const url = new URL('https://photoslibrary.googleapis.com/v1/sharedAlbums')
    url.searchParams.set('pageSize', '50')
    if (sharedToken) url.searchParams.set('pageToken', sharedToken)
    const res = await fetch(url.toString(), { headers, cache: 'no-store' })
    if (!res.ok) {
      const text = await res.text()
      debug.sharedErrorStatus = res.status
      debug.sharedError = text
      if (!debugEnabled) return new Response(text || 'Failed to fetch shared albums', { status: res.status })
      break
    }
    const data = await res.json()
    shared = shared.concat(data.sharedAlbums || [])
    sharedToken = data.nextPageToken
    if (!sharedToken) break
  }
  debug.sharedCount = shared.length

  const map = new Map<string, any>()
  for (const a of owned) map.set(a.id, a)
  for (const a of shared) map.set(a.id, a)
  const albums = Array.from(map.values()).sort((a, b) => (a.title || '').localeCompare(b.title || ''))
  const body = debugEnabled ? { albums, debug } : { albums }
  if (debugEnabled) {
    console.log('[Photos Albums Debug]', debug)
    console.log('[Photos Albums Debug JSON]', JSON.stringify(debug, null, 2))
  }
  return Response.json(body)
}

export async function POST(req: NextRequest) {
  const accessToken = await getAccessToken()
  if (!accessToken) return new Response('Unauthorized', { status: 401 })
  const { title } = await req.json()
  if (!title) return new Response('Missing title', { status: 400 })
  const res = await fetch('https://photoslibrary.googleapis.com/v1/albums', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ album: { title } }),
  })
  const text = await res.text()
  if (!res.ok) return new Response(text || 'Failed to create album', { status: res.status })
  return new Response(text, { status: 201 })
}


