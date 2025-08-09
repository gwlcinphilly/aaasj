'use client'

import { Card, CardContent } from '@/components/ui/card'

type Member = { name: string; note?: string }
type BoardSection = { role: string; members: Member[] }

const board: BoardSection[] = [
  {
    role: 'President',
    members: [
      { name: 'Nina Gao', note: 'Rutgers University faculty' },
    ],
  },
  {
    role: 'Secretaries',
    members: [
      { name: 'Xuan Zhou', note: 'Attorney' },
    ],
  },
  {
    role: 'Treasurers',
    members: [
      { name: 'Qing Sun' },
    ],
  },
  {
    role: 'Community Outreach',
    members: [
      { name: 'Jess Kim' },
      { name: 'Nina Pan' },
      { name: 'Dorothy Wang' },
      { name: 'Hester Luo' },
    ],
  },
  {
    role: 'Support',
    members: [
      { name: 'Qiang Lu', note: 'Software Engineer' },
    ],
  },
]

export default function BoardPage() {
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Board Members</h1>
          <p className="text-white/90 text-lg">
            Meet the dedicated leaders of the Asian American Alliance in South Jersey.
          </p>
        </div>

        <div className="space-y-6">
          {board.map((section) => (
            <Card key={section.role} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6 text-white">
                <h2 className="text-xl font-bold mb-3">{section.role}</h2>
                <ul className="list-disc list-inside space-y-1">
                  {section.members.map((m) => (
                    <li key={`${section.role}-${m.name}`}>
                      <span className="font-semibold">{m.name}</span>
                      {m.note ? <span className="text-white/80"> ({m.note})</span> : null}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6 text-white/90">
              <p className="mb-2">
                We are volunteers and will try our best to serve our community.
              </p>
              <p>
                If you have any questions, please contact us at{' '}
                <a href="mailto:boards@aaa-sj.org" className="underline text-white">boards@aaa-sj.org</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
