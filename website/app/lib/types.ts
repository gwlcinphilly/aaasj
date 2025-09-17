export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

// Events
export type EventItem = {
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
  registrationDisabled?: boolean
}