
import { Metadata } from 'next'
import ScholarshipForm from '@/components/scholarship-form'

export const metadata: Metadata = {
  title: '2026 Scholarship Application - AAASJ',
  description: 'Apply for the 2026 AAASJ Community Service Scholarship. Supporting Asian American students in South Jersey with awards up to $1,000.',
}

export default function ScholarshipPage() {
  return <ScholarshipForm />
}
