import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const level = (body?.level || 'info') as 'debug' | 'info' | 'warn' | 'error'
    const message = typeof body?.message === 'string' ? body.message : 'client-log'
    const data = body?.data
    
    console.log(`[CLIENT ${level.toUpperCase()}] ${message}`, data ? JSON.stringify(data, null, 2) : '')
    
    return new Response(null, { status: 204 })
  } catch (e: any) {
    return new Response(e?.message || 'Invalid JSON', { status: 400 })
  }
}


