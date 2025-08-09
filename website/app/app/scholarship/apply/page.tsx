import type { Metadata } from 'next'
import ScholarshipForm from '@/components/scholarship-form'

export const metadata: Metadata = {
  title: 'Apply - AAASJ Scholarship',
  description: 'Apply for the AAASJ Community Service Scholarship.',
}

export default function ScholarshipApplyPage() {
  return <ScholarshipForm />
}
