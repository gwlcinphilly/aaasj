'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select'
import { toast } from 'sonner'

export default function AdminEventsPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return null
  if (!session) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto py-16 text-center text-white">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-2">Admin: Events</h1>
              <p className="opacity-90">Please log in with your AAA-SJ account to access this page.</p>
              <div className="mt-6">
                <Link href="/">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Back to Home</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <EventsManager />
    </div>
  )
}

type EventItem = {
  id: string
  title: string
  date: string
  time?: string
  location?: string
  description?: string
  image?: string
  category?: string
  status: 'upcoming' | 'past'
  link?: string
}

function EventsManager() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<Partial<EventItem>>({ status: 'upcoming' })
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const resetForm = () => {
    setForm({ status: 'upcoming' })
    setEditingId(null)
  }

  const submit = async () => {
    if (!form.title || !form.date) {
      toast.error('Title and date are required')
      return
    }
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch('/api/events', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: editingId }),
        })
        if (!res.ok) throw new Error(await res.text())
        toast.success('Event updated')
      } else {
        const res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error(await res.text())
        toast.success('Event created')
      }
      resetForm()
      await loadEvents()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to save event')
    } finally {
      setSaving(false)
    }
  }

  const edit = (e: EventItem) => {
    setEditingId(e.id)
    setForm({ ...e })
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this event?')) return
    setSaving(true)
    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(id)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error(await res.text())
      toast.success('Event deleted')
      await loadEvents()
    } catch (e: any) {
      toast.error(e?.message || 'Failed to delete event')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-12 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Events Manager</h1>
        <Button
          className="bg-white/10 hover:bg-white/20 text-white"
          onClick={async () => {
            try {
              const res = await fetch('/api/events/import-from-site', { method: 'POST' })
              if (!res.ok) throw new Error(await res.text())
              const data = await res.json()
              toast.success(`Imported ${data.added} events from site`)
              await loadEvents()
            } catch (e: any) {
              toast.error(e?.message || 'Import failed')
            }
          }}
        >
          Import from Site Events
        </Button>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold">{editingId ? 'Edit Event' : 'Add New Event'}</h2>
            <div>
              <Label className="text-white/90">Title</Label>
              <Input value={form.title || ''} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="bg-white/90" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/90">Date</Label>
                <Input type="date" value={form.date || ''} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="bg-white/90" />
              </div>
              <div>
                <Label className="text-white/90">Time</Label>
                <Input value={form.time || ''} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="bg-white/90" />
              </div>
            </div>
            <div>
              <Label className="text-white/90">Location</Label>
              <Input value={form.location || ''} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} className="bg-white/90" />
            </div>
            <div>
              <Label className="text-white/90">Category</Label>
              <Input value={form.category || ''} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="bg-white/90" />
            </div>
            <div>
              <Label className="text-white/90">Image URL</Label>
              <Input value={form.image || ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="bg-white/90" />
            </div>
            <div>
              <Label className="text-white/90">External Link</Label>
              <Input value={form.link || ''} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} className="bg-white/90" />
            </div>
            <div>
              <Label className="text-white/90">Status</Label>
              <Select value={form.status || 'upcoming'} onValueChange={(v) => setForm((f) => ({ ...f, status: v as 'upcoming' | 'past' }))}>
                <SelectTrigger className="bg-white/90 text-black"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/90">Description</Label>
              <Textarea value={form.description || ''} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="bg-white/90 min-h-[120px]" />
            </div>
            <div className="flex gap-3">
              <Button onClick={submit} disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white">
                {editingId ? 'Save Changes' : 'Create Event'}
              </Button>
              {editingId && (
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white" onClick={resetForm}>Cancel</Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">All Events</h2>
            {loading ? (
              <p className="opacity-90">Loading…</p>
            ) : events.length === 0 ? (
              <p className="opacity-90">No events yet.</p>
            ) : (
              <div className="space-y-3">
                {events.map((e) => (
                  <div key={e.id} className="p-4 rounded-lg bg-white text-slate-900 border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-slate-600">{e.status.toUpperCase()} • {e.date}{e.time ? ` • ${e.time}` : ''}</div>
                        <div className="text-lg font-semibold">{e.title}</div>
                        {e.location && <div className="text-slate-700">{e.location}</div>}
                        {e.category && <div className="text-slate-600 text-sm">{e.category}</div>}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => edit(e)}>Edit</Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => remove(e.id)}>Delete</Button>
                      </div>
                    </div>
                    {e.description && <p className="mt-2 text-slate-700 text-sm">{e.description}</p>}
                    {e.link && (
                      <div className="mt-2 text-sm">
                        <a href={e.link} className="underline text-orange-600" target="_blank" rel="noreferrer">External Link</a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

